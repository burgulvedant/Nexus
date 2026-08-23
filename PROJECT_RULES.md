# Project Rules & Coding Standards

This document establishes the development rules for the **Documentation Truth Engine**. All contributions must adhere to these policies.

---

## 1. General Principles

1. **Modular Codebase**: Every feature area (e.g., users, claims, repositories) must remain self-contained in its folder. Do not create deep circular imports between domains.
2. **Repository-Agnostic Core**: Do not hard-code GradScope-specific or other codebase-specific logic into the backend modules. GradScope is a benchmark target repository, not part of the core engine.
3. **No Hardcoded Secrets**: Secrets (e.g., secret keys, DB credentials) must be loaded through `backend/app/core/config.py` using `pydantic-settings`. Never commit sensitive data or `.env` files.
4. **Prefer Clarity Over Cleverness**: Code must be readable and maintainable. Avoid overly complex dynamic constructs unless explicitly needed.

---

## 2. Python & FastAPI Code Standards

- **Python Version**: Python 3.14+.
- **Pydantic**: Use Pydantic v2 features for schema definition and configuration loading.
- **FastAPI Routes**: 
  - Use routers for each domain and include them in `backend/app/main.py`.
  - Use dependency injection (`Depends`) for retrieving the database session and the authenticated user.
  - Return descriptive HTTP status codes (e.g., `201 Created` for creations, `401 Unauthorized` for auth failures, `404 Not Found`).

---

## 3. Database Rules (SQLAlchemy 2.0)

- Use **SQLAlchemy 2.0 Declarative style** with type annotations:
  ```python
  from sqlalchemy.orm import Mapped, mapped_column, relationship
  ```
- **Primary Keys**: Always use UUIDs (`uuid.uuid4`) for all model keys to ensure robust, unique indexing across potential horizontal scaling.
- **Foreign Keys**: Define explicit relationship mappings with appropriate cascade delete parameters where logical (e.g., deleting a User cascades to their Repositories, which cascades to Analyses).
- **Session Lifecycle**: Database sessions should be retrieved using the `get_db` dependency to ensure they are properly opened and closed per request.

---

## 4. Testing Requirements

- **Framework**: `pytest` for unit and integration testing.
- **Coverage**:
  - All DB models must have basic CRUD integrity tests.
  - Authentication middleware and endpoints must be fully tested.
  - Mock external network requests (like cloning git repos) when building future scanners.
- **Isolation**: Tests must run against a distinct in-memory SQLite database setup via pytest fixtures to prevent pollution of development or production databases.
- Run tests before any pull request is submitted: `pytest backend/tests`.
