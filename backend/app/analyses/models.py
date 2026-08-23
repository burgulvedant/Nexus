import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, Integer, Float, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), default="QUEUED", nullable=False)  # QUEUED, RUNNING, COMPLETED, FAILED
    current_stage: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # SCANNING, EXTRACTING_CLAIMS, COLLECTING_EVIDENCE, VERIFYING, GENERATING_REPORT
    commit_sha: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Summary metrics cached on completion for fast dashboard access
    total_claims: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    verified_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    uncertain_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    contradicted_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    truth_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    repository: Mapped["Repository"] = relationship("Repository", back_populates="analyses")
    claims: Mapped[list["Claim"]] = relationship(
        "Claim", back_populates="analysis", cascade="all, delete-orphan"
    )
