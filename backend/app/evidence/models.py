import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, Integer, Float, ForeignKey, DateTime, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("claims.id", ondelete="CASCADE"), nullable=False
    )
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)  # DOCUMENTATION, SOURCE_CODE, CONFIGURATION, DEPENDENCY, API_SPECIFICATION, TEST, GIT_HISTORY, RUNTIME
    file_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    line_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    discovery_method: Mapped[str] = mapped_column(String(100), default="exact_token", nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    claim: Mapped["Claim"] = relationship("Claim", back_populates="evidence")
