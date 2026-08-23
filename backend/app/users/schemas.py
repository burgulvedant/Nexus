import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = None
    is_active: bool | None = None

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    github_id: str | None = None
    github_username: str | None = None
    github_avatar_url: str | None = None
    is_active: bool
    created_at: datetime
