from fastapi import status

def test_user_registration(client):
    # Register user
    payload = {"email": "test@example.com", "password": "securepassword"}
    response = client.post("/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "hashed_password" not in data

    # Attempt duplicate registration
    response2 = client.post("/auth/register", json=payload)
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response2.json()["detail"]

def test_login_and_access_protected_route(client):
    # Register user
    reg_payload = {"email": "user@example.com", "password": "mypassword"}
    client.post("/auth/register", json=reg_payload)

    # Login to receive token
    login_data = {"username": "user@example.com", "password": "mypassword"}
    response = client.post("/auth/token", data=login_data)
    assert response.status_code == status.HTTP_200_OK
    token_info = response.json()
    assert "access_token" in token_info
    assert token_info["token_type"] == "bearer"

    token = token_info["access_token"]

    # Access /users/me with valid token
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/users/me", headers=headers)
    assert me_resp.status_code == status.HTTP_200_OK
    assert me_resp.json()["email"] == "user@example.com"

    # Access /users/me with invalid token
    bad_headers = {"Authorization": "Bearer badtoken123"}
    bad_me_resp = client.get("/users/me", headers=bad_headers)
    assert bad_me_resp.status_code == status.HTTP_401_UNAUTHORIZED

def test_login_with_incorrect_password(client):
    # Register user
    reg_payload = {"email": "wrongpass@example.com", "password": "mypassword"}
    client.post("/auth/register", json=reg_payload)

    # Login with wrong password
    login_data = {"username": "wrongpass@example.com", "password": "incorrectpassword"}
    response = client.post("/auth/token", data=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_github_login_redirect_url(client, monkeypatch):
    from backend.app.core.config import settings
    from backend.app.core.security import verify_oauth_state_token
    import urllib.parse

    monkeypatch.setattr(settings, "GITHUB_CLIENT_ID", "test_client_id_123")
    monkeypatch.setattr(settings, "GITHUB_REDIRECT_URI", "http://localhost:8000/auth/github/callback")

    response = client.get("/auth/github", follow_redirects=False)
    assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    redirect_url = response.headers["location"]
    assert "https://github.com/login/oauth/authorize" in redirect_url
    assert "client_id=test_client_id_123" in redirect_url
    assert "redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fgithub%2Fcallback" in redirect_url
    assert "state=" in redirect_url

    # Verify generated state is cryptographically valid and signed
    parsed = urllib.parse.urlparse(redirect_url)
    qs = urllib.parse.parse_qs(parsed.query)
    state_token = qs["state"][0]
    assert verify_oauth_state_token(state_token) is True


def test_oauth_state_cryptographic_verification():
    from backend.app.core.security import (
        create_oauth_state_token,
        verify_oauth_state_token,
        create_access_token,
    )

    # A. Valid state token -> accepted
    valid_state = create_oauth_state_token(expires_minutes=15)
    assert verify_oauth_state_token(valid_state) is True

    # B. Expired state token -> rejected
    expired_state = create_oauth_state_token(expires_minutes=-5)
    assert verify_oauth_state_token(expired_state) is False

    # C. Tampered state token -> rejected
    tampered_state = valid_state[:-4] + "abcd"
    assert verify_oauth_state_token(tampered_state) is False

    # D. Malformed / arbitrary string -> rejected
    assert verify_oauth_state_token("not-a-token") is False
    assert verify_oauth_state_token("") is False
    assert verify_oauth_state_token(None) is False

    # E. Wrong-purpose token (e.g. user access JWT) -> rejected
    user_access_token = create_access_token(subject="user-12345")
    assert verify_oauth_state_token(user_access_token) is False


def test_github_oauth_callback_new_user_success(client, monkeypatch, db_session):
    from backend.app.core.config import settings
    from backend.app.core.security import create_oauth_state_token
    from backend.app.users.models import User

    monkeypatch.setattr(settings, "GITHUB_CLIENT_ID", "test_client_id_123")
    monkeypatch.setattr(settings, "GITHUB_CLIENT_SECRET", "test_client_secret_456")
    monkeypatch.setattr(settings, "FRONTEND_URL", "http://localhost:5174")

    # Generate stateless cryptographically signed CSRF state token
    test_state = create_oauth_state_token(expires_minutes=15)

    # Mock external GitHub HTTP calls
    class MockResponse:
        def __init__(self, json_data, status_code=200):
            self._json = json_data
            self.status_code = status_code

        def json(self):
            return self._json

        async def mock_post(self, url, **kwargs):
            if "github.com/login/oauth/access_token" in str(url):
                return MockResponse({"access_token": "gho_mock_access_token_789"})
            return MockResponse({}, 404)

        async def mock_get(self, url, **kwargs):
            url_str = str(url)
            if "api.github.com/user/emails" in url_str:
                return MockResponse([{"email": "octocat@github.com", "primary": True, "verified": True}])
            elif "api.github.com/user" in url_str:
                return MockResponse({
                    "id": 998877,
                    "login": "octocat",
                    "avatar_url": "https://avatars.githubusercontent.com/u/998877",
                    "email": None,
                })
            return MockResponse({}, 404)

    import httpx
    monkeypatch.setattr(httpx.AsyncClient, "post", MockResponse.mock_post)
    monkeypatch.setattr(httpx.AsyncClient, "get", MockResponse.mock_get)

    # Call callback with signed state
    callback_resp = client.get(
        f"/auth/github/callback?code=mock_github_code_123&state={test_state}",
        follow_redirects=False,
    )
    assert callback_resp.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    redirect_loc = callback_resp.headers["location"]
    assert "http://localhost:5174/#token=" in redirect_loc

    # Extract JWT token and check user in DB
    jwt_token = redirect_loc.split("#token=")[1]
    me_resp = client.get("/users/me", headers={"Authorization": f"Bearer {jwt_token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "octocat@github.com"
    assert me_resp.json()["github_username"] == "octocat"


def test_github_oauth_callback_existing_user_link(client, monkeypatch, db_session):
    from backend.app.core.config import settings
    from backend.app.core.security import create_oauth_state_token
    from backend.app.users.models import User

    monkeypatch.setattr(settings, "GITHUB_CLIENT_ID", "test_client_id_123")
    monkeypatch.setattr(settings, "GITHUB_CLIENT_SECRET", "test_client_secret_456")

    # Create existing user with email
    client.post("/auth/register", json={"email": "existing@nexus.ai", "password": "password123"})

    test_state = create_oauth_state_token(expires_minutes=15)

    class MockResponse:
        def __init__(self, json_data, status_code=200):
            self._json = json_data
            self.status_code = status_code

        def json(self):
            return self._json

    async def mock_post(self, url, **kwargs):
        return MockResponse({"access_token": "gho_mock_access_token_existing"})

    async def mock_get(self, url, **kwargs):
        url_str = str(url)
        if "api.github.com/user" in url_str and "emails" not in url_str:
            return MockResponse({
                "id": 1234567,
                "login": "existinguser",
                "avatar_url": "https://avatars.githubusercontent.com/u/1234567",
                "email": "existing@nexus.ai",
            })
        return MockResponse([], 200)

    import httpx
    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)
    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get)

    callback_resp = client.get(
        f"/auth/github/callback?code=mock_code&state={test_state}",
        follow_redirects=False,
    )
    assert callback_resp.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    redirect_loc = callback_resp.headers["location"]
    assert "#token=" in redirect_loc

    jwt_token = redirect_loc.split("#token=")[1]
    me_resp = client.get("/users/me", headers={"Authorization": f"Bearer {jwt_token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "existing@nexus.ai"
    assert me_resp.json()["github_username"] == "existinguser"


def test_github_oauth_callback_invalid_state(client):
    response = client.get(
        "/auth/github/callback?code=some_code&state=invalid_csrf_state",
        follow_redirects=False,
    )
    assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    assert "#auth_error=" in response.headers["location"]


def test_github_oauth_callback_user_denial(client):
    response = client.get(
        "/auth/github/callback?error=access_denied&error_description=The+user+has+denied+your+application+access.",
        follow_redirects=False,
    )
    assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    assert "#auth_error=" in response.headers["location"]


def test_github_oauth_callback_database_error_resilience(client, monkeypatch, db_session):
    """
    Verifies that when a database connection or query failure occurs during user upsert,
    the callback handles it gracefully, rolls back, and returns a safe error redirect
    instead of throwing an unhandled HTTP 500.
    """
    from backend.app.core.config import settings
    from backend.app.core.security import create_oauth_state_token
    from sqlalchemy.exc import OperationalError

    monkeypatch.setattr(settings, "GITHUB_CLIENT_ID", "test_client_id_123")
    monkeypatch.setattr(settings, "GITHUB_CLIENT_SECRET", "test_client_secret_456")
    monkeypatch.setattr(settings, "FRONTEND_URL", "https://nexus-vedant.netlify.app")

    test_state = create_oauth_state_token(expires_minutes=15)

    # Mock external GitHub HTTP calls
    class MockResponse:
        def __init__(self, json_data, status_code=200):
            self._json = json_data
            self.status_code = status_code

        def json(self):
            return self._json

    async def mock_post(self, url, **kwargs):
        return MockResponse({"access_token": "gho_mock_token"})

    async def mock_get(self, url, **kwargs):
        return MockResponse({
            "id": 999999,
            "login": "db_fail_user",
            "avatar_url": "https://example.com/avatar.jpg",
            "email": "db_fail@nexus.ai",
        })

    import httpx
    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)
    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get)

    # Mock database query to simulate database/pooler failure
    def mock_query_fail(*args, **kwargs):
        raise OperationalError("Simulated database failure", {}, None)

    monkeypatch.setattr(db_session, "query", mock_query_fail)

    callback_resp = client.get(
        f"/auth/github/callback?code=mock_code&state={test_state}",
        follow_redirects=False,
    )
    assert callback_resp.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    redirect_loc = callback_resp.headers["location"]
    assert "https://nexus-vedant.netlify.app/#auth_error=" in redirect_loc
    import urllib.parse
    assert "Database temporarily unavailable" in urllib.parse.unquote(redirect_loc)



