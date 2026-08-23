import uuid
import json
from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_validator

class VerdictResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: str  # VERIFIED, UNCERTAIN, CONTRADICTED
    confidence: float
    explanation: str
    supporting_evidence_ids: list[uuid.UUID]
    contradicting_evidence_ids: list[uuid.UUID]
    contextual_evidence_ids: list[uuid.UUID]
    created_at: datetime

    @field_validator("supporting_evidence_ids", "contradicting_evidence_ids", "contextual_evidence_ids", mode="before")
    @classmethod
    def parse_json_ids(cls, v):
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                return [uuid.UUID(uid) for uid in parsed]
            except Exception:
                return []
        return v

class ClaimBase(BaseModel):
    title: str
    description: str
    file_path: str
    line_number: int | None = None
    category: str
    original_text: str
    extraction_method: str
    confidence: float

class ClaimResponse(ClaimBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    analysis_id: uuid.UUID
    created_at: datetime
    verdict: VerdictResponse | None = None
