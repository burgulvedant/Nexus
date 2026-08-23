import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    github_id: Mapped[str | None] = mapped_column(String(100), unique=True, index=True, nullable=True)
    github_username: Mapped[str | None] = mapped_column(String(100), nullable=True)
    github_avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    github_access_token: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    repositories: Mapped[list["Repository"]] = relationship(
        "Repository", back_populates="owner", cascade="all, delete-orphan"
    )
