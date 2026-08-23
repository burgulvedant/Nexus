import os
import uuid
import tempfile
import pytest
from fastapi import status

from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.analyses.pipeline import run_pipeline


@pytest.fixture
def auth_client_and_user(client):
    reg_u1 = {"email": "testowner@example.com", "password": "password123"}
    client.post("/auth/register", json=reg_u1)
    token = client.post("/auth/token", data={"username": "testowner@example.com", "password": "password123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    return client, headers


@pytest.fixture
def other_user_headers(client):
    reg_u2 = {"email": "otheruser@example.com", "password": "password123"}
    client.post("/auth/register", json=reg_u2)
    token = client.post("/auth/token", data={"username": "otheruser@example.com", "password": "password123"}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_repo(auth_client_and_user):
    client, headers = auth_client_and_user
    temp_dir = tempfile.mkdtemp()
    
    # Create mock README.md
    readme_path = os.path.join(temp_dir, "README.md")
    with open(readme_path, "w") as f:
        f.write("# Sample Project\n\nRuns on port 8000 and uses PostgreSQL database.\n")

    # Create mock requirements.txt
    req_path = os.path.join(temp_dir, "requirements.txt")
    with open(req_path, "w") as f:
        f.write("fastapi==0.112.0\npsycopg2-binary==2.9.9\n")

    resp = client.post(
        "/repositories",
        json={"name": "sample-project", "clone_url": temp_dir, "default_branch": "main"},
        headers=headers,
    )
    assert resp.status_code == status.HTTP_201_CREATED
    return resp.json(), temp_dir


def test_analysis_creation_and_lifecycle(client, auth_client_and_user, other_user_headers, sample_repo, db_session):
    _, headers = auth_client_and_user
    repo_data, temp_dir = sample_repo
    repo_id = repo_data["id"]

    # 1. Trigger analysis
    create_resp = client.post(
        "/analyses",
        json={"repository_id": repo_id, "commit_sha": "abc1234"},
        headers=headers,
    )
    assert create_resp.status_code == status.HTTP_201_CREATED
    analysis_data = create_resp.json()
    analysis_id = analysis_data["id"]
    assert analysis_data["status"] == "QUEUED"
    assert analysis_data["repository_id"] == repo_id

    # 2. Run pipeline synchronously using db_session
    run_pipeline(uuid.UUID(analysis_id), db=db_session)

    # 3. Check status endpoint
    status_resp = client.get(f"/analyses/{analysis_id}/status", headers=headers)
    assert status_resp.status_code == status.HTTP_200_OK
    status_data = status_resp.json()
    assert status_data["status"] == "COMPLETED"
    assert status_data["current_stage"] is None
    assert status_data["progress"] is not None
    assert status_data["progress"]["total_claims"] > 0
    assert status_data["progress"]["truth_score"] > 0

    # 4. Check analysis detail endpoint
    detail_resp = client.get(f"/analyses/{analysis_id}", headers=headers)
    assert detail_resp.status_code == status.HTTP_200_OK
    detail_data = detail_resp.json()
    assert detail_data["status"] == "COMPLETED"
    assert detail_data["total_claims"] > 0
    assert detail_data["verified_count"] >= 1
    assert detail_data["repository"]["name"] == "sample-project"

    # 5. Check repository analyses list endpoint
    list_resp = client.get(f"/repositories/{repo_id}/analyses", headers=headers)
    assert list_resp.status_code == status.HTTP_200_OK
    list_data = list_resp.json()
    assert len(list_data) >= 1
    assert list_data[0]["id"] == analysis_id

    # 6. Check report endpoints (JSON and Markdown)
    json_report_resp = client.get(f"/reports/{analysis_id}/json", headers=headers)
    assert json_report_resp.status_code == status.HTTP_200_OK
    report_json = json_report_resp.json()
    assert report_json["summary"]["truth_score"] > 0
    assert report_json["summary"]["total_claims"] > 0
    assert report_json["metadata"]["repository_name"] == "sample-project"

    md_report_resp = client.get(f"/reports/{analysis_id}/markdown", headers=headers)
    assert md_report_resp.status_code == status.HTTP_200_OK
    assert "Nexus Documentation Truth Report" in md_report_resp.text

    # 7. Authorization checks: Unauthorized user cannot access analysis
    other_status = client.get(f"/analyses/{analysis_id}/status", headers=other_user_headers)
    assert other_status.status_code == status.HTTP_404_NOT_FOUND

    other_detail = client.get(f"/analyses/{analysis_id}", headers=other_user_headers)
    assert other_detail.status_code == status.HTTP_404_NOT_FOUND

    other_list = client.get(f"/repositories/{repo_id}/analyses", headers=other_user_headers)
    assert other_list.status_code == status.HTTP_404_NOT_FOUND

    other_report = client.get(f"/reports/{analysis_id}/json", headers=other_user_headers)
    assert other_report.status_code == status.HTTP_404_NOT_FOUND


def test_failed_analysis_lifecycle(client, auth_client_and_user, sample_repo, db_session):
    _, headers = auth_client_and_user
    repo_data, _ = sample_repo
    repo_id = repo_data["id"]

    # Point repo to nonexistent path
    repo = db_session.query(Repository).filter(Repository.id == uuid.UUID(repo_id)).first()
    repo.clone_url = "/nonexistent/invalid/path/that/fails"
    db_session.commit()

    create_resp = client.post(
        "/analyses",
        json={"repository_id": repo_id},
        headers=headers,
    )
    assert create_resp.status_code == status.HTTP_201_CREATED
    analysis_id = create_resp.json()["id"]

    # Run pipeline
    run_pipeline(uuid.UUID(analysis_id), db=db_session)

    # Check that analysis transitioned to FAILED and has error message
    status_resp = client.get(f"/analyses/{analysis_id}/status", headers=headers)
    assert status_resp.status_code == status.HTTP_200_OK
    status_data = status_resp.json()
    assert status_data["status"] == "FAILED"
    assert status_data["error_message"] is not None
