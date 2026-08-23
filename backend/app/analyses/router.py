import uuid
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.analyses.schemas import (
    AnalysisCreate,
    AnalysisResponse,
    AnalysisStatusResponse,
    AnalysisDetailResponse,
)
from backend.app.analyses.pipeline import run_pipeline

router = APIRouter(tags=["Analyses"])

@router.post("/analyses", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
def trigger_analysis(
    analysis_in: AnalysisCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Trigger a new documentation truth analysis run for a repository.
    Sets status to QUEUED and launches the background analysis pipeline immediately.
    """
    # Verify repository ownership
    repo = db.query(Repository).filter(
        Repository.id == analysis_in.repository_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied."
        )
        
    db_analysis = Analysis(
        repository_id=analysis_in.repository_id,
        status="QUEUED",
        current_stage=None,
        commit_sha=analysis_in.commit_sha
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    
    # Launch background orchestration pipeline
    background_tasks.add_task(run_pipeline, db_analysis.id)
    
    return db_analysis


@router.get("/analyses/{analysis_id}/status", response_model=AnalysisStatusResponse)
def get_analysis_status(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed lifecycle status of an ongoing or completed analysis.
    """
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access denied."
        )

    progress_info = None
    if analysis.status == "COMPLETED":
        progress_info = {
            "total_claims": analysis.total_claims,
            "verified": analysis.verified_count,
            "uncertain": analysis.uncertain_count,
            "contradicted": analysis.contradicted_count,
            "truth_score": analysis.truth_score,
        }

    return AnalysisStatusResponse(
        analysis_id=analysis.id,
        status=analysis.status,
        current_stage=analysis.current_stage,
        progress=progress_info,
        error_message=analysis.error_message,
        created_at=analysis.created_at,
        completed_at=analysis.completed_at,
    )


@router.get("/analyses/{analysis_id}", response_model=AnalysisDetailResponse)
def get_analysis(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get full metadata and summary metrics for a specific analysis run.
    """
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access denied."
        )
    return analysis


@router.get("/repositories/{repository_id}/analyses", response_model=list[AnalysisDetailResponse])
def list_repository_analyses(
    repository_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all historical and active analyses for a specific repository.
    """
    repo = db.query(Repository).filter(
        Repository.id == repository_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found or access denied."
        )
        
    return db.query(Analysis).filter(Analysis.repository_id == repository_id).order_by(Analysis.created_at.desc()).all()
