import os
import subprocess
import tempfile
from fastapi import status
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim
from backend.app.claims.extractor import extract_claims_from_text

def test_claims_extraction_fixture():
    doc_content = """# Overview

This is an amazing decision-support tool. It helps students plan. (non-claim)

## Architecture

* The backend is built with FastAPI.
* The frontend uses React.

## Database Setup

We store all data in PostgreSQL.

## How to run

```bash
npm install
npm run dev
```
"""
    claims = extract_claims_from_text(doc_content, "README.md")

    # We expect 5 claims: FastAPI, React, PostgreSQL, and 2 commands
    assert len(claims) == 5

    categories = [c.category for c in claims]
    assert "ARCHITECTURE" in categories
    assert "DEPENDENCY" in categories
    assert "DATABASE" in categories
    assert "COMMAND" in categories

    # Verify line number mapping and metadata tracing
    fastapi_claim = next(c for c in claims if "FastAPI" in c.original_text)
    assert fastapi_claim.line_number == 7
    assert fastapi_claim.category == "ARCHITECTURE"
    assert fastapi_claim.confidence == 0.85
    assert fastapi_claim.original_text == "* The backend is built with FastAPI."

    npm_run = next(c for c in claims if "npm run dev" in c.original_text)
    assert npm_run.line_number == 18
    assert npm_run.category == "COMMAND"


def test_filtering_non_claims():
    doc_content = """# My App
This app is amazing. It simplifies everything.
I love it so much.
Welcome to the home page!
Footer copyright 2026.
"""
    claims = extract_claims_from_text(doc_content, "README.md")
    assert len(claims) == 0


def test_empty_documentation():
    assert len(extract_claims_from_text("", "README.md")) == 0
    assert len(extract_claims_from_text("\n\n   \n", "README.md")) == 0


def test_mixed_prose_and_claims():
    doc_content = """# Project Guide
This project is built for Vit Pune. It helps automate grading.
The system uses JWT authentication to verify requests.
Also, the configuration is stored in pyproject.toml.
The platform is limited to capital cities only.
"""
    claims = extract_claims_from_text(doc_content, "README.md")
    assert len(claims) == 3
    
    auth_claim = next(c for c in claims if c.category == "AUTHENTICATION")
    assert "JWT" in auth_claim.description
    
    config_claim = next(c for c in claims if c.category == "CONFIGURATION")
    assert "pyproject.toml" in config_claim.description
    
    limit_claim = next(c for c in claims if c.category == "LIMIT")
    assert "limited" in limit_claim.description


def test_extract_claims_api_route(client, db_session):
    # 1. Register and login
    user_payload = {"email": "claims_tester@example.com", "password": "password"}
    client.post("/auth/register", json=user_payload)
    token = client.post("/auth/token", data={"username": "claims_tester@example.com", "password": "password"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    user = db_session.query(User).filter(User.email == "claims_tester@example.com").first()

    # 2. Register mock repository using a local folder with Git initialized
    with tempfile.TemporaryDirectory() as temp_repo:
        subprocess.run(["git", "init"], cwd=temp_repo, check=True, capture_output=True)
        subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=temp_repo, check=True)
        subprocess.run(["git", "config", "user.name", "Test User"], cwd=temp_repo, check=True)
        
        with open(os.path.join(temp_repo, "README.md"), "w") as f:
            f.write("# Mock Title\nThe backend uses PostgreSQL database.\n")
            
        subprocess.run(["git", "add", "README.md"], cwd=temp_repo, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "initial commit"], cwd=temp_repo, check=True, capture_output=True)

        repo = Repository(
            owner_id=user.id,
            name="Mock Repo",
            clone_url=temp_repo,
            default_branch="main"
        )
        db_session.add(repo)
        db_session.commit()

        # 3. Create Analysis
        analysis = Analysis(
            repository_id=repo.id,
            status="PENDING"
        )
        db_session.add(analysis)
        db_session.commit()

        # 4. Trigger claims extraction
        resp = client.post(f"/analyses/{analysis.id}/extract-claims", headers=headers)
        assert resp.status_code == status.HTTP_201_CREATED
        claims_data = resp.json()
        assert len(claims_data) == 1
        assert claims_data[0]["category"] == "DATABASE"
        assert "PostgreSQL" in claims_data[0]["description"]
        assert claims_data[0]["file_path"] == "README.md"
        assert claims_data[0]["line_number"] == 2
