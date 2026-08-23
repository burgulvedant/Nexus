import json
import os
import shutil
import tempfile
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.app.core.database import SessionLocal
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence
from backend.app.repositories.scanner import (
    validate_repository_url,
    acquire_repository,
    scan_directory,
    RepositoryScanResult,
)
from backend.app.claims.extractor import extract_claims_from_file
from backend.app.evidence.engine import EvidenceEngine
from backend.app.verification.verifier import (
    verify_claim_against_evidence,
    calculate_truth_score,
)
from backend.app.reports.generator import generate_nexus_report_data


def run_pipeline(analysis_id: uuid.UUID, db: Session | None = None) -> None:
    """
    Main synchronous entry point for the analysis pipeline.
    Opens its own isolated database session if not provided and updates status at each stage.
    """
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True
    temp_dir = None
    try:
        # 1. Fetch analysis and repository
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return

        repo = analysis.repository
        if not repo:
            analysis.status = "FAILED"
            analysis.error_message = "Repository associated with analysis not found."
            analysis.completed_at = datetime.now(timezone.utc)
            db.commit()
            return

        # 2. Update status to RUNNING / SCANNING
        analysis.status = "RUNNING"
        analysis.current_stage = "SCANNING"
        db.commit()

        # Check repository source (local path vs git URL)
        repo_target = repo.clone_url

        # Create temporary workspace directory for scanning & analysis if needed
        is_local_dir = os.path.isabs(repo_target) and os.path.isdir(repo_target)

        if is_local_dir:
            work_dir = repo_target
            scan_data = scan_directory(work_dir)
            # Fetch git commit if available, else record default
            commit_sha = analysis.commit_sha or "local"
        else:
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
            temp_root = os.path.join(project_root, "data", "temp_scans")
            os.makedirs(temp_root, exist_ok=True)
            temp_dir = os.path.join(temp_root, f"pipeline_{analysis.id}_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}")
            
            user_gh_token = repo.owner.github_access_token if repo.owner else None
            meta = acquire_repository(repo_target, temp_dir, github_token=user_gh_token)
            work_dir = temp_dir
            scan_data = scan_directory(temp_dir)
            commit_sha = meta.get("commit_sha", "unknown")
            if not analysis.commit_sha or analysis.commit_sha == "unknown":
                analysis.commit_sha = commit_sha
            db.commit()

        doc_files = scan_data.get("documentation_files", [])

        # 3. Stage: EXTRACTING_CLAIMS
        analysis.current_stage = "EXTRACTING_CLAIMS"
        db.commit()

        # Delete any pre-existing claims/evidence/verdicts for this analysis to ensure idempotency
        existing_claims = db.query(Claim).filter(Claim.analysis_id == analysis_id).all()
        for ec in existing_claims:
            db.delete(ec)
        db.commit()

        extracted_claims_data = []
        for doc in doc_files:
            full_path = os.path.join(work_dir, doc.path)
            file_claims = extract_claims_from_file(full_path, doc.path)
            extracted_claims_data.extend(file_claims)

        # Persist claims
        db_claims = []
        for c in extracted_claims_data:
            db_claim = Claim(
                analysis_id=analysis.id,
                title=c.title,
                description=c.description,
                file_path=c.source_file,
                line_number=c.line_number,
                category=c.category,
                original_text=c.original_text,
                extraction_method=c.extraction_method,
                confidence=c.confidence,
            )
            db.add(db_claim)
            db_claims.append(db_claim)
        db.commit()

        # Refresh db_claims to get database-assigned UUIDs
        for db_claim in db_claims:
            db.refresh(db_claim)

        # 4. Stage: COLLECTING_EVIDENCE
        analysis.current_stage = "COLLECTING_EVIDENCE"
        db.commit()

        engine = EvidenceEngine(work_dir)
        claim_evidence_map = {}

        for db_claim in db_claims:
            found_ev_list = engine.gather_evidence_for_claim(
                db_claim.category, db_claim.description, db_claim.original_text
            )
            db_evidence_records = []
            for ev in found_ev_list:
                db_ev = Evidence(
                    id=ev.id,
                    claim_id=db_claim.id,
                    source_type=ev.source_type,
                    file_path=ev.file_path,
                    line_number=ev.line_number,
                    content=ev.content,
                    explanation=ev.explanation,
                    discovery_method=ev.discovery_method,
                    confidence=ev.confidence,
                )
                db.add(db_ev)
                db_evidence_records.append(db_ev)
            claim_evidence_map[db_claim.id] = db_evidence_records

        db.commit()

        # 5. Stage: VERIFYING
        analysis.current_stage = "VERIFYING"
        db.commit()

        verdicts_list = []
        verified_count = 0
        uncertain_count = 0
        contradicted_count = 0

        for db_claim in db_claims:
            ev_records = claim_evidence_map.get(db_claim.id, [])
            verdict_res = verify_claim_against_evidence(
                db_claim.category, db_claim.description, db_claim.original_text, ev_records
            )
            verdicts_list.append(verdict_res)

            if verdict_res.status == "VERIFIED":
                verified_count += 1
            elif verdict_res.status == "CONTRADICTED":
                contradicted_count += 1
            else:
                uncertain_count += 1

            db_verdict = Verdict(
                claim_id=db_claim.id,
                status=verdict_res.status,
                confidence=verdict_res.confidence,
                explanation=verdict_res.explanation,
                supporting_evidence_ids=json.dumps([str(u) for u in verdict_res.supporting_evidence_ids]),
                contradicting_evidence_ids=json.dumps([str(u) for u in verdict_res.contradicting_evidence_ids]),
                contextual_evidence_ids=json.dumps([str(u) for u in verdict_res.contextual_evidence_ids]),
            )
            db.add(db_verdict)

        db.commit()

        # Calculate truth score
        truth_score = calculate_truth_score(verdicts_list) if verdicts_list else 0

        # 6. Stage: GENERATING_REPORT
        analysis.current_stage = "GENERATING_REPORT"
        db.commit()

        # Verify report generation runs cleanly
        generate_nexus_report_data(analysis.id, db)

        # 7. Final Stage: COMPLETED
        analysis.status = "COMPLETED"
        analysis.current_stage = None
        analysis.total_claims = len(db_claims)
        analysis.verified_count = verified_count
        analysis.uncertain_count = uncertain_count
        analysis.contradicted_count = contradicted_count
        analysis.truth_score = truth_score
        analysis.completed_at = datetime.now(timezone.utc)
        db.commit()

    except Exception as e:
        import traceback
        traceback.print_exc()
        try:
            analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
            if analysis:
                analysis.status = "FAILED"
                analysis.current_stage = None
                analysis.error_message = str(e)
                analysis.completed_at = datetime.now(timezone.utc)
                db.commit()
        except Exception:
            pass
    finally:
        if should_close:
            db.close()
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
