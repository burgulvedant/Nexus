import uuid
import secrets
import urllib.parse
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.core.security import (
    verify_password,
    create_access_token,
    create_oauth_state_token,
    verify_oauth_state_token,
)
from backend.app.auth.schemas import Token
from backend.app.users.models import User
from backend.app.users.schemas import UserCreate, UserResponse
from backend.app.users.service import get_user_by_email, create_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account with email/password.
    """
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )
    return create_user(db, user_in)


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, retrieve access token.
    """
    user = get_user_by_email(db, form_data.username)
    if not user or not user.hashed_password or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
        
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/github")
def github_login():
    """
    Redirect the user to GitHub's OAuth authorization endpoint.
    Requests minimal scope: 'read:user user:email repo' for repository verification.
    """
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GITHUB_CLIENT_ID is not configured on the server."
        )

    # Generate cryptographically signed, timestamped stateless OAuth CSRF token
    state = create_oauth_state_token(expires_minutes=15)

    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "read:user user:email repo",
        "state": state,
        "allow_signup": "true",
    }
    github_auth_url = f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=github_auth_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)


@router.get("/github/callback")
async def github_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    error_description: str | None = None,
    db: Session = Depends(get_db)
):
    """
    GitHub OAuth callback handler:
    1. Validates CSRF state
    2. Exchanges authorization code for GitHub access token
    3. Fetches user profile and email from GitHub API
    4. Upserts Nexus user record
    5. Issues standard Nexus JWT access token
    6. Redirects frontend to dashboard with token
    """
    frontend_base = settings.FRONTEND_URL.rstrip("/")

    # Handle user denial or OAuth error
    if error:
        redirect_err = urllib.parse.quote(error_description or error)
        return RedirectResponse(url=f"{frontend_base}/#auth_error={redirect_err}")

    if not code or not state:
        redirect_err = urllib.parse.quote("Missing code or state parameter from GitHub OAuth callback.")
        return RedirectResponse(url=f"{frontend_base}/#auth_error={redirect_err}")

    # Validate CSRF state using stateless cryptographic signature and expiration
    if not verify_oauth_state_token(state):
        redirect_err = urllib.parse.quote("Invalid or expired OAuth state parameter.")
        return RedirectResponse(url=f"{frontend_base}/#auth_error={redirect_err}")

    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        redirect_err = urllib.parse.quote("GitHub OAuth client credentials are not configured.")
        return RedirectResponse(url=f"{frontend_base}/#auth_error={redirect_err}")

    # 1. Exchange code for GitHub access token
    try:
        async with httpx.AsyncClient() as client:
            token_resp = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                json={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": settings.GITHUB_REDIRECT_URI,
                },
                timeout=15.0,
            )
            token_json = token_resp.json()
            github_token = token_json.get("access_token")

            if not github_token:
                err_msg = token_json.get("error_description", "Failed to retrieve access token from GitHub.")
                return RedirectResponse(url=f"{frontend_base}/#auth_error={urllib.parse.quote(err_msg)}")

            # 2. Retrieve GitHub user profile
            profile_resp = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {github_token}",
                    "Accept": "application/vnd.github+json",
                },
                timeout=15.0,
            )
            if profile_resp.status_code != 200:
                return RedirectResponse(url=f"{frontend_base}/#auth_error={urllib.parse.quote('Failed to fetch GitHub profile.')}")
            
            profile_data = profile_resp.json()
            github_id = str(profile_data.get("id"))
            github_username = profile_data.get("login")
            github_avatar = profile_data.get("avatar_url")
            email = profile_data.get("email")

            # 3. Retrieve primary email if not public in profile
            if not email:
                emails_resp = await client.get(
                    "https://api.github.com/user/emails",
                    headers={
                        "Authorization": f"Bearer {github_token}",
                        "Accept": "application/vnd.github+json",
                    },
                    timeout=15.0,
                )
                if emails_resp.status_code == 200:
                    emails_data = emails_resp.json()
                    # Find primary or verified email
                    for em in emails_data:
                        if em.get("primary") and em.get("verified"):
                            email = em.get("email")
                            break
                    if not email and emails_data:
                        email = emails_data[0].get("email")

            if not email:
                email = f"{github_username}@users.noreply.github.com"

    except Exception as e:
        return RedirectResponse(url=f"{frontend_base}/#auth_error={urllib.parse.quote(f'Network error communicating with GitHub: {str(e)}')}")

    # 4. Find or create Nexus User safely
    try:
        user = None
        if github_id:
            user = db.query(User).filter(User.github_id == github_id).first()

        if not user and email:
            user = db.query(User).filter(User.email == email).first()

        if user:
            # Update existing user record with latest GitHub info & access token
            user_id = user.id
            user.github_id = github_id
            user.github_username = github_username
            user.github_avatar_url = github_avatar
            user.github_access_token = github_token
            db.commit()
        else:
            # Create new Nexus user with explicit UUID (avoids post-commit lazy reload)
            user_id = uuid.uuid4()
            user = User(
                id=user_id,
                email=email,
                hashed_password=None,
                github_id=github_id,
                github_username=github_username,
                github_avatar_url=github_avatar,
                github_access_token=github_token,
                is_active=True,
            )
            db.add(user)
            db.commit()

        # 5. Create standard Nexus JWT access token without post-commit database calls
        nexus_jwt = create_access_token(subject=user_id)
    except Exception as e:
        db.rollback()
        error_name = type(e).__name__
        print(f"[Nexus Auth Notice] Database user upsert failed ({error_name}). Safe redirect sent to client.")
        redirect_err = urllib.parse.quote("Database temporarily unavailable")
        return RedirectResponse(url=f"{frontend_base}/#auth_error={redirect_err}")

    # 6. Redirect to frontend dashboard with token in hash fragment
    return RedirectResponse(
        url=f"{frontend_base}/#token={nexus_jwt}",
        status_code=status.HTTP_307_TEMPORARY_REDIRECT
    )

