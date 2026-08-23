import json
import uuid
from fastapi import status

from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence
from backend.app.reports.generator import generate_nexus_report_data, export_report_to_markdown

def test_report_compilation_and_markdown(db_session):
    # 1. Setup metadata structures
    user = User(email="rep_tester@example.com", hashed_password="hashed_pw_placeholder")
    db_session.add(user)
    db_session.commit()

    repo = Repository(owner_id=user.id, name="Test Repo", clone_url="https://github.com/example/test", default_branch="main")
    db_session.add(repo)
    db_session.commit()

    analysis = Analysis(repository_id=repo.id, status="COMPLETED")
    db_session.add(analysis)
    db_session.commit()

    # 2. Setup claims
    c1 = Claim(
        analysis_id=analysis.id,
        title="Claim One",
        description="Backend uses FastAPI framework",
        file_path="README.md",
        line_number=10,
        category="ARCHITECTURE",
        original_text="Backend uses FastAPI framework",
        extraction_method="rule",
        confidence=0.90
    )
    c2 = Claim(
        analysis_id=analysis.id,
        title="Claim Two",
        description="Has OpenAPI specs",
        file_path="README.md",
        line_number=20,
        category="API",
        original_text="Has OpenAPI specs",
        extraction_method="rule",
        confidence=0.90
    )
    db_session.add(c1)
    db_session.add(c2)
    db_session.commit()

    # 3. Setup evidence
    ev1 = Evidence(
        claim_id=c1.id,
        source_type="DEPENDENCY",
        file_path="requirements.txt",
        line_number=1,
        content="fastapi==0.112",
        explanation="Found dependency fastapi in requirements.",
        discovery_method="dependency_parsing",
        confidence=1.0
    )
    db_session.add(ev1)
    db_session.commit()

    # 4. Setup verdicts
    v1 = Verdict(
        claim_id=c1.id,
        status="VERIFIED",
        confidence=0.85,
        explanation="FastAPI dependency exists.",
        supporting_evidence_ids=json.dumps([str(ev1.id)]),
        contradicting_evidence_ids="[]",
        contextual_evidence_ids="[]"
    )
    v2 = Verdict(
        claim_id=c2.id,
        status="UNCERTAIN",
        confidence=0.90,
        explanation="OpenAPI file is absent.",
        supporting_evidence_ids="[]",
        contradicting_evidence_ids="[]",
        contextual_evidence_ids="[]"
    )
    db_session.add(v1)
    db_session.add(v2)
    db_session.commit()

    # 5. Compile Report Data
    report = generate_nexus_report_data(analysis.id, db_session)
    assert report["metadata"]["repository_name"] == "Test Repo"
    assert report["summary"]["total_claims"] == 2
    assert report["summary"]["verified_count"] == 1
    assert report["summary"]["uncertain_count"] == 1
    assert report["summary"]["contradicted_count"] == 0
    # Score: round((100 * 1 + 50 * 1) / 2) = 75
    assert report["summary"]["truth_score"] == 75

    # 6. Format Markdown Report
    md = export_report_to_markdown(report)
    assert "Nexus Documentation Truth Report" in md
    assert "No contradictions were detected in this analysis" in md
    assert "Uncertain Findings" in md
    assert "Verified Findings" in md


def test_report_security_owner_locked(client, db_session):
    # 1. Setup authenticated users
    client.post("/auth/register", json={"email": "owner@example.com", "password": "password"})
    owner_token = client.post("/auth/token", data={"username": "owner@example.com", "password": "password"}).json()["access_token"]
    owner_headers = {"Authorization": f"Bearer {owner_token}"}

    client.post("/auth/register", json={"email": "attacker@example.com", "password": "password"})
    attacker_token = client.post("/auth/token", data={"username": "attacker@example.com", "password": "password"}).json()["access_token"]
    attacker_headers = {"Authorization": f"Bearer {attacker_token}"}

    owner = db_session.query(User).filter(User.email == "owner@example.com").first()

    # 2. Setup repository mapping
    repo = Repository(owner_id=owner.id, name="Owner Repo", clone_url="https://github.com/owner/repo", default_branch="main")
    db_session.add(repo)
    db_session.commit()

    analysis = Analysis(repository_id=repo.id, status="COMPLETED")
    db_session.add(analysis)
    db_session.commit()

    # Trigger verify run first (so that verdicts exist)
    c1 = Claim(
        analysis_id=analysis.id,
        title="Claim One",
        description="Backend uses FastAPI framework",
        file_path="README.md",
        line_number=10,
        category="ARCHITECTURE",
        original_text="Backend uses FastAPI framework",
        extraction_method="rule",
        confidence=0.90
    )
    db_session.add(c1)
    db_session.commit()
    
    # Run mock verify
    v1 = Verdict(
        claim_id=c1.id,
        status="VERIFIED",
        confidence=0.85,
        explanation="Verified claim details.",
        supporting_evidence_ids="[]",
        contradicting_evidence_ids="[]",
        contextual_evidence_ids="[]"
    )
    db_session.add(v1)
    db_session.commit()

    # 3. Verify owner access
    resp_owner = client.get(f"/reports/{analysis.id}/json", headers=owner_headers)
    assert resp_owner.status_code == status.HTTP_200_OK

    # 4. Verify attacker blocked with 404
    resp_attacker = client.get(f"/reports/{analysis.id}/json", headers=attacker_headers)
    assert resp_attacker.status_code == status.HTTP_404_NOT_FOUND
