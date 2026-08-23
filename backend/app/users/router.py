from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.users.schemas import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Get current user profile.
    """
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete current user's Nexus account and all cascaded repositories,
    analyses, claims, evidence, and verdicts.
    """
    db.delete(current_user)
    db.commit()
    return None
