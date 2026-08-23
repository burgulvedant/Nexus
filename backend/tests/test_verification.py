import json
import uuid
from fastapi import status

from backend.app.verification.verifier import verify_claim_against_evidence, calculate_truth_score
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence

# Mock class representing DB evidence records for verification tests
class MockEvidence:
    def __init__(self, source_type, file_path, line_number, content, explanation, discovery_method):
        self.id = uuid.uuid4()
        self.source_type = source_type
        self.file_path = file_path
        self.line_number = line_number
        self.content = content
        self.explanation = explanation
        self.discovery_method = discovery_method


def test_verify_supported_script():
    ev = [MockEvidence(
        source_type="CONFIGURATION",
        file_path="package.json",
        line_number=7,
        content='"dev": "vite"',
        explanation="Found script configuration for dev containing run target: vite",
        discovery_method="package_script_inspection"
    )]
    res = verify_claim_against_evidence(
        claim_category="COMMAND",
        claim_description="Run npm run dev to start the frontend",
        original_text="npm run dev",
        evidence_list=ev
    )
    assert res.status == "VERIFIED"
    assert res.confidence == 0.95
    assert len(res.supporting_evidence_ids) == 1
    assert "package.json" in res.explanation


def test_verify_contradicted_script():
    ev = [MockEvidence(
        source_type="CONFIGURATION",
        file_path="package.json",
        line_number=7,
        content='"dev": "webpack"',
        explanation="Found script configuration mismatch dev target: webpack",
        discovery_method="package_script_inspection"
    )]
    res = verify_claim_against_evidence(
        claim_category="COMMAND",
        claim_description="Run npm run dev to start the frontend",
        original_text="npm run dev",
        evidence_list=ev
    )
    assert res.status == "CONTRADICTED"
    assert res.confidence == 0.95
    assert len(res.contradicting_evidence_ids) == 1


def test_verify_missing_evidence():
    res = verify_claim_against_evidence(
        claim_category="API",
        claim_description="GET /api/courses returns courses",
        original_text="GET /api/courses",
        evidence_list=[]
    )
    assert res.status == "UNCERTAIN"
    assert res.confidence == 0.90
    assert "No evidence" in res.explanation


def test_verify_postgres_sqlite_fallback():
    ev = [
        MockEvidence(
            source_type="DEPENDENCY",
            file_path="requirements.txt",
            line_number=5,
            content="psycopg2-binary==2.9.9",
            explanation="Found PostgreSQL driver psycopg dependency in Python requirements.",
            discovery_method="dependency_parsing"
        ),
        MockEvidence(
            source_type="SOURCE_CODE",
            file_path="backend/app/database.py",
            line_number=12,
            content="sqlite:///./sql_app.db",
            explanation="Found SQLite configuration, which acts as contradictory evidence against a PostgreSQL claim.",
            discovery_method="token_keyword_match"
        )
    ]
    res = verify_claim_against_evidence(
        claim_category="DATABASE",
        claim_description="Database: PostgreSQL, psycopg v3.",
        original_text="Database: PostgreSQL, psycopg v3.",
        evidence_list=ev
    )
    assert res.status == "UNCERTAIN"
    assert res.confidence == 0.85
    assert len(res.supporting_evidence_ids) == 1
    assert len(res.contextual_evidence_ids) == 1
    assert "fallback" in res.explanation.lower()


def test_verify_api_method_mismatch():
    ev = [
        MockEvidence(
            source_type="SOURCE_CODE",
            file_path="backend/app/routes/calculator.py",
            line_number=90,
            content='@router.post("/course-comparison")',
            explanation="Found route decorator for courses",
            discovery_method="route_regex_matching"
        )
    ]
    res = verify_claim_against_evidence(
        claim_category="API",
        claim_description="GET /api/course-comparison returns other records",
        original_text="GET /api/course-comparison",
        evidence_list=ev
    )
    assert res.status == "CONTRADICTED"
    assert res.confidence == 0.95
    assert len(res.contradicting_evidence_ids) == 1


def test_calculate_truth_score():
    score = calculate_truth_score(["VERIFIED", "VERIFIED", "UNCERTAIN", "CONTRADICTED"])
    assert score in {62, 63}


def test_verify_api_route(client, db_session):
    # 1. Register and login
    user_payload = {"email": "ver_tester@example.com", "password": "password"}
    client.post("/auth/register", json=user_payload)
    token = client.post("/auth/token", data={"username": "ver_tester@example.com", "password": "password"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    user = db_session.query(User).filter(User.email == "ver_tester@example.com").first()

    # 2. Setup mock data
    repo = Repository(owner_id=user.id, name="Test Repo", clone_url="https://github.com/test", default_branch="main")
    db_session.add(repo)
    db_session.commit()

    analysis = Analysis(repository_id=repo.id, status="COMPLETED")
    db_session.add(analysis)
    db_session.commit()

    claim = Claim(
        analysis_id=analysis.id,
        title="Db Check",
        description="Database is PostgreSQL",
        file_path="README.md",
        line_number=5,
        category="DATABASE",
        original_text="Database is PostgreSQL",
        extraction_method="rule",
        confidence=0.90
    )
    db_session.add(claim)
    db_session.commit()

    evidence = Evidence(
        claim_id=claim.id,
        source_type="DEPENDENCY",
        file_path="requirements.txt",
        line_number=2,
        content="psycopg2==2.9",
        explanation="Found PostgreSQL driver psycopg dependency in requirements.",
        discovery_method="dependency_parsing",
        confidence=1.0
    )
    db_session.add(evidence)
    db_session.commit()

    # 3. Call endpoint
    resp = client.post(f"/analyses/{analysis.id}/verify", headers=headers)
    assert resp.status_code == status.HTTP_201_CREATED
    data = resp.json()
    assert len(data) == 1
    assert data[0]["status"] == "VERIFIED"
    assert data[0]["confidence"] == 0.85
    assert str(evidence.id) in [str(uid) for uid in data[0]["supporting_evidence_ids"]]
