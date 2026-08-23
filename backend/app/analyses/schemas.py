import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class AnalysisBase(BaseModel):
    commit_sha: str | None = None

class AnalysisCreate(AnalysisBase):
    repository_id: uuid.UUID

class AnalysisStatusResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    analysis_id: uuid.UUID
    status: str
    current_stage: str | None = None
    progress: dict | None = None
    error_message: str | None = None
    created_at: datetime
    completed_at: datetime | None = None

class RepositorySummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    clone_url: str
    default_branch: str

class AnalysisDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    repository_id: uuid.UUID
    repository: RepositorySummary | None = None
    status: str
    current_stage: str | None = None
    commit_sha: str | None = None
    error_message: str | None = None
    total_claims: int = 0
    verified_count: int = 0
    uncertain_count: int = 0
    contradicted_count: int = 0
    truth_score: int = 0
    created_at: datetime
    completed_at: datetime | None = None

class AnalysisResponse(AnalysisBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    repository_id: uuid.UUID
    status: str
    current_stage: str | None = None
    error_message: str | None = None
    total_claims: int = 0
    verified_count: int = 0
    uncertain_count: int = 0
    contradicted_count: int = 0
    truth_score: int = 0
    created_at: datetime
    completed_at: datetime | None = None
