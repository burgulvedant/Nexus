import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.reports.generator import generate_nexus_report_data, export_report_to_markdown

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/{analysis_id}/json", status_code=status.HTTP_200_OK)
def get_json_truth_report(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves the complete Nexus Truth Report in structured, nested JSON format
    for a given analysis run (owner locked).
    """
    # Verify owner credentials
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run not found or access denied."
        )
        
    report = generate_nexus_report_data(analysis_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to generate report data."
        )
        
    return report


@router.get("/{analysis_id}/markdown", response_class=PlainTextResponse, status_code=status.HTTP_200_OK)
def get_markdown_truth_report(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves the complete Nexus Truth Report in human-readable Markdown format
    for a given analysis run (owner locked).
    """
    # Verify owner credentials
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run not found or access denied."
        )
        
    report_data = generate_nexus_report_data(analysis_id, db)
    if not report_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Failed to generate report data."
        )
        
    return export_report_to_markdown(report_data)
