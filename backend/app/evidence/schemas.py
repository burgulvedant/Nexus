import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class EvidenceBase(BaseModel):
    source_type: str  # DOCUMENTATION, SOURCE_CODE, CONFIGURATION, DEPENDENCY, API_SPECIFICATION, TEST, GIT_HISTORY, RUNTIME
    file_path: str
    line_number: int | None = None
    content: str | None = None
    explanation: str
    discovery_method: str
    confidence: float

class EvidenceResponse(EvidenceBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    claim_id: uuid.UUID
    created_at: datetime
