from contextlib import asynccontextmanager
from fastapi import FastAPI
from backend.app.core.database import Base, engine

# Import models to register them on Base.metadata
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence

# Import routers
from backend.app.auth.router import router as auth_router
from backend.app.users.router import router as users_router
from backend.app.repositories.router import router as repositories_router
from backend.app.analyses.router import router as analyses_router
from backend.app.claims.router import router as claims_router
from backend.app.evidence.router import router as evidence_router
from backend.app.verification.router import router as verification_router
from backend.app.reports.router import router as reports_router

from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe table auto-creation on startup without blocking server boot
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        error_name = type(e).__name__
        print(f"[Nexus DB Notice] Automatic table creation deferred on startup ({error_name}). API server is operational.")
    yield

app = FastAPI(
    title="Nexus API",
    description="Evidence-based software documentation verification platform.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(repositories_router)
app.include_router(analyses_router)
app.include_router(claims_router)
app.include_router(evidence_router)
app.include_router(verification_router)
app.include_router(reports_router)

@app.get("/")
def read_root():
    return {
        "name": "Documentation Truth Engine API",
        "version": "0.1.0",
        "description": "Are the claims made by this software's documentation actually supported by the current software?"
    }
