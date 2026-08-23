import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.repositories.models import Repository
import httpx
from backend.app.repositories.schemas import (
    RepositoryCreate,
    RepositoryResponse,
    RepositoryUpdate,
    GitHubRepositoryItem,
)
from backend.app.repositories.scanner import perform_scan, RepositoryScanResult

router = APIRouter(prefix="/repositories", tags=["Repositories"])

class ScanRequest(BaseModel):
    repository_url: str

class ResolveGitHubRepoRequest(BaseModel):
    name: str
    clone_url: str
    default_branch: str = "main"


@router.get("/github", response_model=list[GitHubRepositoryItem])
async def list_github_repositories(
    current_user: User = Depends(get_current_user)
):
    """
    Fetch accessible GitHub repositories for the authenticated user using their stored OAuth token.
    """
    if not current_user.github_access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your GitHub connection is not configured or has expired. Please connect with GitHub.",
        )

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.github.com/user/repos",
                headers={
                    "Authorization": f"Bearer {current_user.github_access_token}",
                    "Accept": "application/vnd.github+json",
                },
                params={
                    "sort": "updated",
                    "per_page": 100,
                    "affiliation": "owner,collaborator,organization_member",
                },
                timeout=15.0,
            )

            if resp.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Your GitHub connection has expired. Please reconnect with GitHub.",
                )
            elif resp.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"GitHub API returned error status {resp.status_code}.",
                )

            repos_data = resp.json()
            results: list[GitHubRepositoryItem] = []
            for r in repos_data:
                owner_login = r.get("owner", {}).get("login", "") if isinstance(r.get("owner"), dict) else ""
                results.append(
                    GitHubRepositoryItem(
                        id=r.get("id"),
                        name=r.get("name", "untitled"),
                        full_name=r.get("full_name", r.get("name", "untitled")),
                        owner=owner_login,
                        html_url=r.get("html_url", ""),
                        clone_url=r.get("clone_url", ""),
                        default_branch=r.get("default_branch", "main"),
                        private=r.get("private", False),
                        description=r.get("description"),
                        updated_at=r.get("updated_at"),
                    )
                )
            return results

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to reach GitHub API: {str(e)}",
        )


@router.post("/resolve-github", response_model=RepositoryResponse)
def resolve_github_repo(
    repo_in: ResolveGitHubRepoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Resolves or registers a GitHub repository against the current user account without duplicates.
    """
    existing_repo = db.query(Repository).filter(
        Repository.owner_id == current_user.id,
        Repository.clone_url == repo_in.clone_url
    ).first()

    if existing_repo:
        # Update name or default branch if changed
        existing_repo.name = repo_in.name
        existing_repo.default_branch = repo_in.default_branch
        db.commit()
        db.refresh(existing_repo)
        return existing_repo

    db_repo = Repository(
        owner_id=current_user.id,
        name=repo_in.name,
        clone_url=repo_in.clone_url,
        default_branch=repo_in.default_branch
    )
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo


@router.post("", response_model=RepositoryResponse, status_code=status.HTTP_201_CREATED)
def create_repo(
    repo_in: RepositoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Register a new repository for scanning under the active user account.
    """
    db_repo = Repository(
        owner_id=current_user.id,
        name=repo_in.name,
        clone_url=repo_in.clone_url,
        default_branch=repo_in.default_branch
    )
    db.add(db_repo)
    db.commit()
    db.refresh(db_repo)
    return db_repo

@router.get("", response_model=list[RepositoryResponse])
def list_repos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all repositories owned by the current user.
    """
    return db.query(Repository).filter(Repository.owner_id == current_user.id).all()

@router.get("/{repository_id}", response_model=RepositoryResponse)
def get_repo(
    repository_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get details of a specific repository.
    """
    repo = db.query(Repository).filter(
        Repository.id == repository_id,
        Repository.owner_id == current_user.id
    ).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied."
        )
    return repo

@router.delete("/{repository_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_repo(
    repository_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a repository and all its associated analyses/claims.
    """
    repo = db.query(Repository).filter(
        Repository.id == repository_id,
        Repository.owner_id == current_user.id
    ).first()
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied."
        )
    db.delete(repo)
    db.commit()
    return


@router.post("/scan", response_model=RepositoryScanResult)
def scan_repository(
    scan_in: ScanRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Clones and scans a repository to build a file classification index.
    """
    try:
        return perform_scan(scan_in.repository_url)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Repository scan failed: {str(e)}"
        )

