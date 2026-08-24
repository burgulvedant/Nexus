import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from backend.app.core.config import settings

# Determine database path
db_url = settings.DATABASE_URL
if not db_url:
    # Resolve workspace root/data directory dynamically
    # __file__ is /workspace/backend/app/core/database.py
    # parents[3] points to /workspace
    workspace_root = Path(__file__).resolve().parents[3]
    data_dir = workspace_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    db_url = f"sqlite:///{data_dir}/dev.db"
elif db_url.startswith("postgres://"):
    # SQLAlchemy requires postgresql:// instead of legacy postgres:// scheme
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine_kwargs = {}
# SQLite requires check_same_thread: False to be used by multiple threads in FastAPI
if db_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # Resilient connection pooling for cloud PostgreSQL (Supabase / Render)
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(db_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
