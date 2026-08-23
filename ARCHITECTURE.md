# Architectural Design - Documentation Truth Engine

This document provides a detailed breakdown of the technical architecture for the **Documentation Truth Engine**.

---

## 1. Modular Monolith Design

We use a modular folder structure where each domain component contains its database models, schemas, and router endpoints. This allows high decoupling and keeps context grouped logically.

### Directory Mapping
- `core/`: Application settings, database session setup, and encryption/hashing.
- `auth/`: User registration, token exchange (OAuth2 Password flow), and authentication schemas.
- `users/`: User account lifecycle management.
- `repositories/`: Catalog of external repositories to scan.
- `analyses/`: Ingestion runs, status tracking, and history comparison.
- `claims/`: Claims extracted from markdown documents, alongside their associated verdicts.
- `evidence/`: Specific references in source code, tests, configurations, or git logs.
- `verification/`: Business logic validating claims against evidence.
- `reports/`: Presentation engine generating human-readable truth reports.

---

## 2. Database Schema & ERD

We utilize SQLAlchemy 2.0 Declarative mapping with UUID keys for all records to support clean distributed identifier generation.

### Entity Relationship Details

#### User
- Owner of repositories and scan runs.
- Has one-to-many relationship with `Repository`.

#### Repository
- Points to an external code repository (e.g., clone URL, branch).
- Belong to a single `User`.
- Has one-to-many relationship with `Analysis`.

#### Analysis
- Represents a single snapshot run of the Truth Engine.
- Belongs to a single `Repository`.
- Has one-to-many relationship with `Claim`.
- Stores metadata: `status` (PENDING, RUNNING, COMPLETED, FAILED), `commit_sha`.

#### Claim
- An extracted technical assertion from the repository's docs.
- Belongs to an `Analysis`.
- Has one-to-many relationship with `Evidence` (allows multiple files/tests to act as evidence).
- Has one-to-one relationship with `Verdict` (a claim receives exactly one final verdict per analysis).

#### Verdict
- The calculated conclusion for a specific claim.
- Belongs to a single `Claim`.
- Stores: `status` (VERIFIED, UNCERTAIN, CONTRADICTED), `confidence` (0.0 to 1.0), and `explanation`.

#### Evidence
- A granular piece of proof found in the codebase.
- Belongs to a `Claim`.
- Stores: `source_type` (DOCUMENTATION, SOURCE_CODE, CONFIGURATION, API_SPECIFICATION, TEST, GIT_HISTORY, RUNTIME), `file_path`, `line_number`, `content`, and `explanation`.

```
User (1)
 └── Repository (1..*)
      └── Analysis (1..*)
           └── Claim (1..*)
                ├── Verdict (1)
                └── Evidence (1..*)
```

---

## 3. Authentication Architecture

We use token-based state-less authentication:
1. **Password Hashing**: Done via `bcrypt` through `passlib` to ensure secure storage.
2. **Access Token Generation**: OAuth2-compatible JWT containing the user's ID as the subject (`sub`) and token expiration.
3. **Dependency Injection**: 
   - A `get_current_user` dependency parses the authorization header.
   - It decodes the JWT, fetches the user from the database, and injects it into route handlers.
   - Unauthenticated/Expired requests receive a `401 Unauthorized` response immediately.

---

## 4. Ingestion & Analysis Flow (Future Phases)

For future scaling, the verification pipeline operates asynchronously:
1. **Queueing**: A user triggers an analysis. The status is set to `PENDING` -> `RUNNING`.
2. **Cloning & Scanning**: The engine clones the target repository and identifies docs.
3. **Claim Extraction**: LLMs/Regex parse the docs and extract assertions (inserted into the `claims` table).
4. **Evidence Gathering**: The code parser searches files, test suites, and configurations for matching keywords or annotations.
5. **Truth Engine Evaluation**: Logic verifies the claim status against gathered evidence.
6. **Verdict Emission**: The final verdict is stored and the analysis state changes to `COMPLETED`.
