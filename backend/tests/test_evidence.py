import json
import os
import subprocess
import tempfile
from fastapi import status

from backend.app.evidence.engine import EvidenceEngine, FoundEvidence
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim
from backend.app.evidence.models import Evidence

def test_evidence_engine_locally():
    with tempfile.TemporaryDirectory() as temp_repo:
        # 1. Create requirements.txt
        with open(os.path.join(temp_repo, "requirements.txt"), "w") as f:
            f.write("fastapi==0.112.2\npsycopg2-binary==2.9.9\n")

        # 2. Create package.json
        with open(os.path.join(temp_repo, "package.json"), "w") as f:
            f.write(json.dumps({
                "dependencies": {"react": "^18.2.0"},
                "scripts": {"dev": "vite"}
            }))

        # 3. Create backend router file
        os.makedirs(os.path.join(temp_repo, "backend", "app"))
        with open(os.path.join(temp_repo, "backend", "app", "main.py"), "w") as f:
            f.write("""
from fastapi import FastAPI
app = FastAPI()

@app.get("/api/courses")
def get_courses():
    return []

# Configured sqlite fallback
db_url = "sqlite:///local.db"
""")

        # Instantiate engine
        engine = EvidenceEngine(temp_repo)

        # A. Test Database claim (matches psycopg dependency and sqlite source file context)
        ev1 = engine.gather_evidence_for_claim(
            claim_category="DATABASE",
            claim_description="Database: PostgreSQL, psycopg v3.",
            original_text="Database: PostgreSQL, psycopg v3."
        )
        assert len(ev1) > 0
        deps = [e for e in ev1 if e.source_type == "DEPENDENCY"]
        assert len(deps) == 1
        assert deps[0].file_path == "requirements.txt"
        assert "psycopg" in deps[0].content

        sqlite_ev = [e for e in ev1 if "sqlite" in e.content.lower()]
        assert len(sqlite_ev) == 1
        assert sqlite_ev[0].source_type == "SOURCE_CODE"
        assert sqlite_ev[0].file_path == os.path.join("backend", "app", "main.py")
        assert sqlite_ev[0].line_number == 10
        assert "sqlite" in sqlite_ev[0].content
        assert "contradictory" in sqlite_ev[0].explanation

        # B. Test NPM Command scripts
        ev2 = engine.gather_evidence_for_claim(
            claim_category="COMMAND",
            claim_description="Run npm run dev to start the frontend",
            original_text="npm run dev"
        )
        assert len(ev2) == 1
        assert ev2[0].source_type == "CONFIGURATION"
        assert ev2[0].file_path == "package.json"
        assert "dev" in ev2[0].content
        assert ev2[0].discovery_method == "package_script_inspection"

        # C. Test API Routing matching
        ev3 = engine.gather_evidence_for_claim(
            claim_category="API",
            claim_description="GET /api/courses returns courses",
            original_text="GET /api/courses"
        )
        assert len(ev3) == 1
        assert ev3[0].source_type == "SOURCE_CODE"
        assert ev3[0].file_path == os.path.join("backend", "app", "main.py")
        assert ev3[0].line_number == 5
        assert "get_courses" in ev3[0].content

        # D. Test Missing API Specs & Tests (should yield empty lists cleanly)
        # Search for swagger.json / spec files which don't exist
        assert len(engine._scan_api_evidence("swagger.json")) == 0


def test_gather_evidence_api_route(client, db_session):
    # 1. Register and login
    user_payload = {"email": "ev_tester@example.com", "password": "password"}
    client.post("/auth/register", json=user_payload)
    token = client.post("/auth/token", data={"username": "ev_tester@example.com", "password": "password"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    user = db_session.query(User).filter(User.email == "ev_tester@example.com").first()

    # 2. Register mock repository
    with tempfile.TemporaryDirectory() as temp_repo:
        subprocess.run(["git", "init"], cwd=temp_repo, check=True, capture_output=True)
        subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=temp_repo, check=True)
        subprocess.run(["git", "config", "user.name", "Test User"], cwd=temp_repo, check=True)
        
        with open(os.path.join(temp_repo, "requirements.txt"), "w") as f:
            f.write("psycopg2-binary==2.9.9\n")
        with open(os.path.join(temp_repo, "README.md"), "w") as f:
            f.write("# Database Setup\n")
            
        subprocess.run(["git", "add", "."], cwd=temp_repo, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "initial commit"], cwd=temp_repo, check=True, capture_output=True)

        repo = Repository(
            owner_id=user.id,
            name="Mock Repo",
            clone_url=temp_repo,
            default_branch="main"
        )
        db_session.add(repo)
        db_session.commit()

        analysis = Analysis(
            repository_id=repo.id,
            status="PENDING"
        )
        db_session.add(analysis)
        db_session.commit()

        # Add claim to DB
        claim = Claim(
            analysis_id=analysis.id,
            title="Database claim",
            description="The database uses PostgreSQL",
            file_path="README.md",
            line_number=1,
            category="DATABASE",
            original_text="The database uses PostgreSQL",
            extraction_method="rule",
            confidence=0.90
        )
        db_session.add(claim)
        db_session.commit()

        # 3. Trigger evidence gathering
        resp = client.post(f"/analyses/{analysis.id}/gather-evidence", headers=headers)
        assert resp.status_code == status.HTTP_201_CREATED
        ev_data = resp.json()
        assert len(ev_data) == 1
        assert ev_data[0]["source_type"] == "DEPENDENCY"
        assert ev_data[0]["file_path"] == "requirements.txt"
        assert "psycopg2" in ev_data[0]["content"]
        assert ev_data[0]["discovery_method"] == "dependency_parsing"
