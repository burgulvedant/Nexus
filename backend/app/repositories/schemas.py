import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RepositoryBase(BaseModel):
    name: str
    clone_url: str
    default_branch: str = "main"

class RepositoryCreate(RepositoryBase):
    pass

class RepositoryUpdate(BaseModel):
    name: str | None = None
    clone_url: str | None = None
    default_branch: str | None = None

class RepositoryResponse(RepositoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime


class GitHubRepositoryItem(BaseModel):
    id: int
    name: str
    full_name: str
    owner: str
    html_url: str
    clone_url: str
    default_branch: str
    private: bool
    description: str | None = None
    updated_at: str | None = None
