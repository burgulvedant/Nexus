import os
import sys
import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session

# Setup db connection local import
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence

from backend.app.repositories.scanner import perform_scan
from backend.app.claims.extractor import extract_claims_from_file
from backend.app.evidence.engine import EvidenceEngine
from backend.app.verification.verifier import verify_claim_against_evidence
from backend.app.reports.generator import generate_nexus_report_data, export_report_to_markdown

def main():
    target_path = "/Users/vedantburgul/Desktop/LifeCost Project"
    print(f"Acquiring repository from: {target_path} ...")
    
    # Ensure all tables are created on the target database before session starts
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Setup a dummy user, repo, and analysis in local database
        email = f"runner_{int(datetime.now().timestamp())}@nexus.local"
        user = User(email=email, hashed_password="hashed_pw_placeholder")
        db.add(user)
        db.commit()

        # Perform scan to extract git metadata
        scan_res = perform_scan(target_path)
        
        repo = Repository(
            owner_id=user.id,
            name="LifeCost Project (Nexus)",
            clone_url=target_path,
            default_branch=scan_res.default_branch
        )
        db.add(repo)
        db.commit()

        analysis = Analysis(
            repository_id=repo.id,
            commit_sha=scan_res.commit_sha,
            status="RUNNING"
        )
        db.add(analysis)
        db.commit()

        # 2. Extract Claims from documentation files
        print("Extracting technical claims from docs...")
        claims_list = []
        for doc in scan_res.documentation_files:
            full_doc_path = os.path.join(target_path, doc.path)
            extracted = extract_claims_from_file(full_doc_path, doc.path)
            
            for item in extracted:
                claim = Claim(
                    analysis_id=analysis.id,
                    title=item.title,
                    description=item.description,
                    file_path=doc.path,
                    line_number=item.line_number,
                    category=item.category,
                    original_text=item.original_text,
                    extraction_method=item.extraction_method,
                    confidence=item.confidence
                )
                db.add(claim)
                claims_list.append(claim)
        db.commit()

        # 3. Gather Evidence for each claim
        print("Gathering evidence from source, configurations, and packages...")
        ev_engine = EvidenceEngine(target_path)
        for claim in claims_list:
            found_ev = ev_engine.gather_evidence_for_claim(claim.category, claim.description, claim.original_text)
            for ev in found_ev:
                db_ev = Evidence(
                    claim_id=claim.id,
                    source_type=ev.source_type,
                    file_path=ev.file_path,
                    line_number=ev.line_number,
                    content=ev.content,
                    explanation=ev.explanation,
                    discovery_method=ev.discovery_method,
                    confidence=ev.confidence
                )
                db.add(db_ev)
        db.commit()

        # 4. Verify Claims against evidence
        print("Running verification reasoning engine...")
        for claim in claims_list:
            evs = db.query(Evidence).filter(Evidence.claim_id == claim.id).all()
            res = verify_claim_against_evidence(claim.category, claim.description, claim.original_text, evs)
            
            supp_json = json.dumps([str(uid) for uid in res.supporting_evidence_ids])
            contr_json = json.dumps([str(uid) for uid in res.contradicting_evidence_ids])
            cont_json = json.dumps([str(uid) for uid in res.contextual_evidence_ids])

            db_verdict = Verdict(
                claim_id=claim.id,
                status=res.status,
                confidence=res.confidence,
                explanation=res.explanation,
                supporting_evidence_ids=supp_json,
                contradicting_evidence_ids=contr_json,
                contextual_evidence_ids=cont_json
            )
            db.add(db_verdict)
        
        analysis.status = "COMPLETED"
        analysis.completed_at = datetime.now(timezone.utc)
        db.commit()

        # 5. Compile and generate report structures
        print("Compiling Nexus Truth Report...")
        report_data = generate_nexus_report_data(analysis.id, db)
        
        # Save JSON
        json_path = "gradscope_nexus_report.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(report_data, f, indent=2, default=str)
        print(f"  Saved JSON Report to:  {json_path}")

        # Save Markdown
        md_content = export_report_to_markdown(report_data)
        md_path = "gradscope_nexus_report.md"
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(md_content)
        print(f"  Saved Markdown Report to: {md_path}")

        # Print report summary
        print("\n" + "="*50)
        print("NEXUS TRUTH REPORT GENERATION SUMMARY")
        print("="*50)
        meta = report_data["metadata"]
        sumry = report_data["summary"]
        print(f"Repository:               {meta['repository_name']}")
        print(f"Total Claims Analyzed:    {sumry['total_claims']}")
        print(f"Truth Score:              {sumry['truth_score']} / 100")
        print()
        print("Verdict Distribution:")
        print(f"  VERIFIED:               {sumry['verified_count']}")
        print(f"  UNCERTAIN:              {sumry['uncertain_count']}")
        print(f"  CONTRADICTED:           {sumry['contradicted_count']}")
        print("="*50 + "\n")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
