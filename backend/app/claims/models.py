import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, Integer, Float, ForeignKey, DateTime, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

class Claim(Base):
    __tablename__ = "claims"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    line_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    category: Mapped[str] = mapped_column(String(100), default="OTHER", nullable=False)
    original_text: Mapped[str] = mapped_column(Text, nullable=False)
    extraction_method: Mapped[str] = mapped_column(String(50), default="rule", nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    analysis: Mapped["Analysis"] = relationship("Analysis", back_populates="claims")
    evidence: Mapped[list["Evidence"]] = relationship(
        "Evidence", back_populates="claim", cascade="all, delete-orphan"
    )
    verdict: Mapped[Optional["Verdict"]] = relationship(
        "Verdict", back_populates="claim", uselist=False, cascade="all, delete-orphan"
    )


class Verdict(Base):
    __tablename__ = "verdicts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("claims.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), nullable=False)  # VERIFIED, UNCERTAIN, CONTRADICTED
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    supporting_evidence_ids: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    contradicting_evidence_ids: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    contextual_evidence_ids: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    claim: Mapped["Claim"] = relationship("Claim", back_populates="verdict")
