import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.repositories.scanner import acquire_repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim
from backend.app.evidence.models import Evidence
from backend.app.evidence.schemas import EvidenceResponse
from backend.app.evidence.engine import EvidenceEngine

router = APIRouter(tags=["Evidence"])

@router.get("/claims/{claim_id}/evidence", response_model=list[EvidenceResponse])
def list_claim_evidence(
    claim_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all collected evidence backing or contradicting a specific claim.
    """
    # Verify the claim belongs to an analysis/repository owned by the current user
    claim = db.query(Claim).join(Analysis).join(Repository).filter(
        Claim.id == claim_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found or access denied."
        )
        
    return db.query(Evidence).filter(Evidence.claim_id == claim_id).all()

@router.post("/analyses/{analysis_id}/gather-evidence", response_model=list[EvidenceResponse], status_code=status.HTTP_201_CREATED)
def gather_analysis_evidence(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clones the repository for this analysis, runs the Evidence Engine over all extracted claims,
    and stores all gathered evidence in the database.
    """
    # Verify ownership of the target analysis
    analysis = db.query(Analysis).join(Repository).filter(
        Analysis.id == analysis_id,
        Repository.owner_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or access denied."
        )
        
    repo = analysis.repository
    claims = db.query(Claim).filter(Claim.analysis_id == analysis_id).all()
    if not claims:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No claims exist for this analysis. Run claim extraction first."
        )

    # Setup project-local temp path
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    temp_root = os.path.join(project_root, "data", "temp_scans")
    os.makedirs(temp_root, exist_ok=True)
    temp_dir = os.path.join(temp_root, f"ev_gather_{analysis_id}")

    try:
        # Acquire Repository
        acquire_repository(repo.clone_url, temp_dir)
        
        # Instantiate Evidence Engine
        engine = EvidenceEngine(temp_dir)
        
        # Clean existing evidence for these claims (idempotence)
        claim_ids = [c.id for c in claims]
        db.query(Evidence).filter(Evidence.claim_id.in_(claim_ids)).delete(synchronize_session=False)
        db.commit()

        created_evidence = []

        # Gather evidence for each claim
        for claim in claims:
            found = engine.gather_evidence_for_claim(claim.category, claim.description, claim.original_text)
            for item in found:
                db_ev = Evidence(
                    claim_id=claim.id,
                    source_type=item.source_type,
                    file_path=item.file_path,
                    line_number=item.line_number,
                    content=item.content,
                    explanation=item.explanation,
                    discovery_method=item.discovery_method,
                    confidence=item.confidence
                )
                db.add(db_ev)
                created_evidence.append(db_ev)

        db.commit()

        # Refresh models
        for ev in created_evidence:
            db.refresh(ev)

        return created_evidence

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Evidence gathering failed: {str(e)}"
        )
    finally:
        # Clean up temp folder
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
