import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

class Repository(Base):
    __tablename__ = "repositories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    clone_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    default_branch: Mapped[str] = mapped_column(String(255), default="main", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="repositories")
    analyses: Mapped[list["Analysis"]] = relationship(
        "Analysis", back_populates="repository", cascade="all, delete-orphan"
    )
