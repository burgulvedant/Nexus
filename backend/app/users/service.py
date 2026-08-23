import uuid
from sqlalchemy.orm import Session
from backend.app.core.security import get_password_hash
from backend.app.users.models import User
from backend.app.users.schemas import UserCreate, UserUpdate

def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_pw = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_pw,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: User, user_in: UserUpdate) -> User:
    if user_in.email is not None:
        db_user.email = user_in.email
    if user_in.password is not None:
        db_user.hashed_password = get_password_hash(user_in.password)
    if user_in.is_active is not None:
        db_user.is_active = user_in.is_active
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
