import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    DATABASE_URL: Optional[str] = None
    JWT_SECRET_KEY: str = "supersecretjwtkeyplaceholder1234567890"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days session

    # Server
    PORT: int = 8000

    # GitHub OAuth
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/auth/github/callback"
    FRONTEND_URL: str = "http://localhost:5174"

    @property
    def cors_origins(self) -> list[str]:
        origins = ["http://localhost:5174", "http://localhost:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5173"]
        if self.FRONTEND_URL:
            cleaned = self.FRONTEND_URL.rstrip("/")
            if cleaned not in origins:
                origins.append(cleaned)
        return origins

settings = Settings()
