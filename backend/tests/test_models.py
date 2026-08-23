import uuid
from backend.app.users.models import User
from backend.app.repositories.models import Repository
from backend.app.analyses.models import Analysis
from backend.app.claims.models import Claim, Verdict
from backend.app.evidence.models import Evidence

def test_database_schema_relations_and_cascade(db_session):
    # 1. Create a user
    user = User(email="dbtest@example.com", hashed_password="hashed_pw_placeholder")
    db_session.add(user)
    db_session.commit()

    # 2. Create a Repository owned by User
    repo = Repository(
        owner_id=user.id,
        name="Test Repo",
        clone_url="https://github.com/example/test-repo.git",
        default_branch="main"
    )
    db_session.add(repo)
    db_session.commit()

    # 3. Create an Analysis
    analysis = Analysis(
        repository_id=repo.id,
        status="COMPLETED",
        commit_sha="a1b2c3d4"
    )
    db_session.add(analysis)
    db_session.commit()

    # 4. Create a Claim
    claim = Claim(
        analysis_id=analysis.id,
        title="Requires auth",
        description="All API requests require authentication.",
        file_path="docs/api.md",
        line_number=10,
        category="AUTHENTICATION",
        original_text="All API requests require authentication.",
        extraction_method="rule",
        confidence=0.95
    )
    db_session.add(claim)
    db_session.commit()

    # 5. Create a Verdict for the Claim
    verdict = Verdict(
        claim_id=claim.id,
        status="VERIFIED",
        confidence=0.95,
        explanation="Validated via routing codes"
    )
    db_session.add(verdict)
    db_session.commit()

    # 6. Create Evidence for the Claim
    ev = Evidence(
        claim_id=claim.id,
        source_type="SOURCE_CODE",
        file_path="app/main.py",
        line_number=42,
        content="auth_dependency",
        explanation="Auth decorator added to route"
    )
    db_session.add(ev)
    db_session.commit()

    # Verify everything exists in DB
    assert db_session.query(User).count() == 1
    assert db_session.query(Repository).count() == 1
    assert db_session.query(Analysis).count() == 1
    assert db_session.query(Claim).count() == 1
    assert db_session.query(Verdict).count() == 1
    assert db_session.query(Evidence).count() == 1

    # Cascade delete Repository
    db_session.delete(repo)
    db_session.commit()

    # Verify cascade deleted everything except User
    assert db_session.query(User).count() == 1
    assert db_session.query(Repository).count() == 0
    assert db_session.query(Analysis).count() == 0
    assert db_session.query(Claim).count() == 0
    assert db_session.query(Verdict).count() == 0
    assert db_session.query(Evidence).count() == 0
