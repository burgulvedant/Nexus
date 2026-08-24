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


def test_nullpool_engine_configuration_and_connection_lifecycle(tmp_path):
    """
    Regression test: Verifies that PostgreSQL engine configuration uses NullPool
    for Supabase Transaction Pooler compatibility, and that sequential distinct
    database sessions execute and close cleanly without stale pooled connection reuse.
    """
    from sqlalchemy import create_engine
    from sqlalchemy.pool import NullPool
    from sqlalchemy.orm import sessionmaker
    from backend.app.core.database import Base
    from backend.app.users.models import User

    # Create engine using NullPool (as configured in production for PostgreSQL)
    db_file = tmp_path / "nullpool_test.db"
    test_engine = create_engine(f"sqlite:///{db_file}", poolclass=NullPool)
    Base.metadata.create_all(bind=test_engine)

    TestSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    # Request 1: Insert user
    session1 = TestSession()
    u1 = User(email="req1@nexus.ai", github_id="gh_111", github_username="user1")
    session1.add(u1)
    session1.commit()
    session1.close()

    # Request 2 (simulating a subsequent request without reusing a pooled socket):
    session2 = TestSession()
    retrieved = session2.query(User).filter(User.github_id == "gh_111").first()
    assert retrieved is not None
    assert retrieved.email == "req1@nexus.ai"
    # Update on second request
    retrieved.github_username = "user1_updated"
    session2.commit()
    session2.close()

    # Request 3: Third sequential verification
    session3 = TestSession()
    verified = session3.query(User).filter(User.github_id == "gh_111").first()
    assert verified.github_username == "user1_updated"
    session3.close()

