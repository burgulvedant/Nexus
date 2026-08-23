import json
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.dependencies import get_current_user
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence
from backend.app.claims.schemas import VerdictResponse
from backend.app.verification.verifier import verify_claim_against_evidence

router = APIRouter(tags=["Verification"])

@router.post("/analyses/{analysis_id}/verify", response_model=list[VerdictResponse], status_code=status.HTTP_201_CREATED)
def verify_analysis_claims(
    analysis_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Runs the Truth Verification Engine on all claims extracted for this analysis,
    generating and saving verdict assertions with mapped evidence link IDs.
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
        
    claims = db.query(Claim).filter(Claim.analysis_id == analysis_id).all()
    if not claims:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No claims exist for this analysis. Run claim extraction first."
        )

    verdicts_list = []

    for claim in claims:
        # Load evidence associated with this specific claim
        evidence_records = db.query(Evidence).filter(Evidence.claim_id == claim.id).all()
        
        # Verify the claim
        res = verify_claim_against_evidence(
            claim_category=claim.category,
            claim_description=claim.description,
            original_text=claim.original_text,
            evidence_list=evidence_records
        )

        # Check if a verdict record already exists for this claim (idempotency)
        db_verdict = db.query(Verdict).filter(Verdict.claim_id == claim.id).first()
        
        supporting_json = json.dumps([str(uid) for uid in res.supporting_evidence_ids])
        contradicting_json = json.dumps([str(uid) for uid in res.contradicting_evidence_ids])
        contextual_json = json.dumps([str(uid) for uid in res.contextual_evidence_ids])

        if db_verdict:
            db_verdict.status = res.status
            db_verdict.confidence = res.confidence
            db_verdict.explanation = res.explanation
            db_verdict.supporting_evidence_ids = supporting_json
            db_verdict.contradicting_evidence_ids = contradicting_json
            db_verdict.contextual_evidence_ids = contextual_json
        else:
            db_verdict = Verdict(
                claim_id=claim.id,
                status=res.status,
                confidence=res.confidence,
                explanation=res.explanation,
                supporting_evidence_ids=supporting_json,
                contradicting_evidence_ids=contradicting_json,
                contextual_evidence_ids=contextual_json
            )
            db.add(db_verdict)
        
        verdicts_list.append(db_verdict)

    # Save and commit all records
    db.commit()

    # Refresh models to unpack JSON array columns correctly in VerdictResponse
    for v in verdicts_list:
        db.refresh(v)

    return verdicts_list
