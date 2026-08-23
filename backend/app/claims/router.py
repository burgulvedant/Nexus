import os
import shutil
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.repositories.scanner import acquire_repository, scan_directory
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim
from backend.app.claims.schemas import ClaimResponse
from backend.app.claims.extractor import extract_claims_from_file

router = APIRouter(tags=["Claims"])

@router.get("/analyses/{analysis_id}/claims", response_model=list[ClaimResponse])
def list_analysis_claims(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all extracted claims and their associated verdicts for a specific analysis run.
    """
    # Verify the analysis belongs to a repository owned by the current user
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access denied."
        )
        
    return db.query(Claim).filter(Claim.analysis_id == analysis_id).all()

@router.get("/claims/{claim_id}", response_model=ClaimResponse)
def get_claim(
    claim_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve details of a single claim, including its verdict.
    """
    claim = db.query(Claim).join(Analysis).join(Repository).filter(
        Claim.id == claim_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found or access denied."
        )
        
    return claim

@router.post("/analyses/{analysis_id}/extract-claims", response_model=list[ClaimResponse], status_code=status.HTTP_201_CREATED)
def extract_analysis_claims(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clones the repository associated with this analysis, extracts technical claims from documentation,
    saves them to the database, and returns the result.
    """
    # Verify ownership of the target analysis
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access denied."
        )
        
    repo = analysis.repository

    # Create project-local temp path
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    temp_root = os.path.join(project_root, "data", "temp_scans")
    os.makedirs(temp_root, exist_ok=True)
    temp_dir = os.path.join(temp_root, f"claim_ext_{analysis_id}")

    try:
        # 1. Acquire Repository (clone or copy)
        meta = acquire_repository(repo.clone_url, temp_dir)
        
        # 2. Scan structure and find doc files
        scan_data = scan_directory(temp_dir)
        
        # Update metadata state
        analysis.commit_sha = meta["commit_sha"]
        analysis.status = "RUNNING"
        db.commit()

        # Idempotence: remove any prior claims for this specific run
        db.query(Claim).filter(Claim.analysis_id == analysis_id).delete()
        db.commit()

        created_claims = []

        # 3. Extract claims from documentation files
        for doc_file in scan_data["documentation_files"]:
            local_file_path = os.path.join(temp_dir, doc_file.path)
            extracted = extract_claims_from_file(local_file_path, doc_file.path)
            
            for item in extracted:
                db_claim = Claim(
                    analysis_id=analysis_id,
                    title=item.title,
                    description=item.description,
                    file_path=doc_file.path,
                    line_number=item.line_number,
                    category=item.category,
                    original_text=item.original_text,
                    extraction_method=item.extraction_method,
                    confidence=item.confidence
                )
                db.add(db_claim)
                created_claims.append(db_claim)

        # 4. Save and set status to COMPLETED
        analysis.status = "COMPLETED"
        analysis.completed_at = datetime.now(timezone.utc)
        db.commit()

        # Refresh models to return complete structures
        for c in created_claims:
            db.refresh(c)

        return created_claims

    except Exception as e:
        analysis.status = "FAILED"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Claims extraction failed: {str(e)}"
        )
    finally:
        # Clean up temp folder
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
