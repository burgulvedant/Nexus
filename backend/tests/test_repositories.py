from fastapi import status

def test_repository_crud_lifecycle_and_ownership(client):
    # 1. Register two different users
    reg_u1 = {"email": "user1@example.com", "password": "password1"}
    reg_u2 = {"email": "user2@example.com", "password": "password1"}
    
    client.post("/auth/register", json=reg_u1)
    client.post("/auth/register", json=reg_u2)

    # Get tokens for both
    t1 = client.post("/auth/token", data={"username": "user1@example.com", "password": "password1"}).json()["access_token"]
    t2 = client.post("/auth/token", data={"username": "user2@example.com", "password": "password1"}).json()["access_token"]

    headers_u1 = {"Authorization": f"Bearer {t1}"}
    headers_u2 = {"Authorization": f"Bearer {t2}"}

    # 2. User 1 creates repository
    repo_payload = {
        "name": "GradScope",
        "clone_url": "https://github.com/benchmark/gradscope.git",
        "default_branch": "main"
    }
    
    create_resp = client.post("/repositories", json=repo_payload, headers=headers_u1)
    assert create_resp.status_code == status.HTTP_201_CREATED
    repo_data = create_resp.json()
    assert repo_data["name"] == "GradScope"
    repo_id = repo_data["id"]

    # 3. User 1 lists repositories (should see it)
    list_resp = client.get("/repositories", headers=headers_u1)
    assert list_resp.status_code == status.HTTP_200_OK
    assert len(list_resp.json()) == 1
    assert list_resp.json()[0]["id"] == repo_id

    # 4. User 2 lists repositories (should NOT see it)
    list_resp_u2 = client.get("/repositories", headers=headers_u2)
    assert list_resp_u2.status_code == status.HTTP_200_OK
    assert len(list_resp_u2.json()) == 0

    # 5. User 2 tries to access User 1's repository (should get 404/403)
    get_resp_u2 = client.get(f"/repositories/{repo_id}", headers=headers_u2)
    assert get_resp_u2.status_code == status.HTTP_404_NOT_FOUND

    # 6. User 1 deletes repository
    del_resp = client.delete(f"/repositories/{repo_id}", headers=headers_u1)
    assert del_resp.status_code == status.HTTP_204_NO_CONTENT

    # 7. User 1 lists repositories again (should be empty)
    list_resp_after = client.get("/repositories", headers=headers_u1)
    assert len(list_resp_after.json()) == 0


def test_github_repositories_endpoint(client, monkeypatch, db_session):
    from backend.app.users.models import User
    from backend.app.core.security import create_access_token

    # 1. Unauthenticated request fails
    unauth_resp = client.get("/repositories/github")
    assert unauth_resp.status_code == status.HTTP_401_UNAUTHORIZED

    # 2. User without GitHub access token returns 400
    user_no_gh = User(email="nogh@nexus.ai", hashed_password="pw", is_active=True)
    db_session.add(user_no_gh)
    db_session.commit()
    t_no_gh = create_access_token(subject=user_no_gh.id)
    headers_no_gh = {"Authorization": f"Bearer {t_no_gh}"}

    resp_no_token = client.get("/repositories/github", headers=headers_no_gh)
    assert resp_no_token.status_code == status.HTTP_400_BAD_REQUEST

    # 3. User with GitHub access token fetches repositories successfully
    user_with_gh = User(
        email="ghuser@nexus.ai",
        hashed_password="pw",
        github_id="123456",
        github_username="ghuser",
        github_access_token="gho_test_mock_token_abc",
        is_active=True,
    )
    db_session.add(user_with_gh)
    db_session.commit()
    t_with_gh = create_access_token(subject=user_with_gh.id)
    headers_with_gh = {"Authorization": f"Bearer {t_with_gh}"}

    class MockResponse:
        def __init__(self, json_data, status_code=200):
            self._json = json_data
            self.status_code = status_code

        def json(self):
            return self._json

    async def mock_get(self, url, **kwargs):
        return MockResponse([
            {
                "id": 101,
                "name": "GradScope",
                "full_name": "ghuser/GradScope",
                "owner": {"login": "ghuser"},
                "html_url": "https://github.com/ghuser/GradScope",
                "clone_url": "https://github.com/ghuser/GradScope.git",
                "default_branch": "main",
                "private": False,
                "description": "GradScope documentation truth test repository",
                "updated_at": "2026-05-12T10:00:00Z",
            },
            {
                "id": 102,
                "name": "FinanceIQ",
                "full_name": "ghuser/FinanceIQ",
                "owner": {"login": "ghuser"},
                "html_url": "https://github.com/ghuser/FinanceIQ",
                "clone_url": "https://github.com/ghuser/FinanceIQ.git",
                "default_branch": "main",
                "private": True,
                "description": "Private financial analytics platform",
                "updated_at": "2026-05-11T12:00:00Z",
            }
        ])

    import httpx
    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get)

    gh_resp = client.get("/repositories/github", headers=headers_with_gh)
    assert gh_resp.status_code == status.HTTP_200_OK
    gh_repos = gh_resp.json()
    assert len(gh_repos) == 2
    assert gh_repos[0]["name"] == "GradScope"
    assert gh_repos[1]["name"] == "FinanceIQ"
    assert gh_repos[1]["private"] is True
    # Ensure tokens are never exposed in response
    assert "github_access_token" not in str(gh_repos)
    assert "gho_" not in str(gh_repos)


def test_resolve_github_repository(client, db_session):
    from backend.app.users.models import User
    from backend.app.core.security import create_access_token

    user = User(email="resolve_tester@nexus.ai", hashed_password="pw", is_active=True)
    db_session.add(user)
    db_session.commit()
    token = create_access_token(subject=user.id)
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "name": "GradScope",
        "clone_url": "https://github.com/benchmark/gradscope.git",
        "default_branch": "main",
    }

    # First resolve creates repository
    resp1 = client.post("/repositories/resolve-github", json=payload, headers=headers)
    assert resp1.status_code == status.HTTP_200_OK
    repo1 = resp1.json()
    assert repo1["name"] == "GradScope"

    # Second resolve with same clone_url returns existing record (no duplicate)
    resp2 = client.post("/repositories/resolve-github", json=payload, headers=headers)
    assert resp2.status_code == status.HTTP_200_OK
    repo2 = resp2.json()
    assert repo2["id"] == repo1["id"]

    # Verify only 1 repo exists for user
    list_resp = client.get("/repositories", headers=headers)
    assert len(list_resp.json()) == 1

