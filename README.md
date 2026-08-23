# Documentation Truth Engine

Documentation Truth Engine is an evidence-based software documentation verification platform. 

Its purpose is **not** to generate or automatically rewrite documentation, nor is it a basic documentation drift detector. Instead, it answers the core question:

> **"Are the claims made by this software's documentation actually supported by the current software?"**

The system analyzes a repository's documentation, extracts meaningful technical claims, gathers supporting/contradicting evidence from source code, tests, and configuration, and computes a truth verdict.

---

## Core Product Journey

1. **User Account Management**: Secure sign up, login, and dashboard.
2. **Repository Analysis**: Add a repository URL, select branch, and trigger a scan.
3. **Claim Extraction**: Identify statements in documentation representing technical assertions.
4. **Evidence Retrieval**: Search code, configurations, specifications, and git history for proof.
5. **Truth Verification**: Correlate evidence, evaluate truthfulness, and assign a verdict:
   - 🟢 **VERIFIED**
   - 🟡 **UNCERTAIN** (defaulting to "I don't know" when evidence is insufficient)
   - 🔴 **CONTRADICTED**
6. **Documentation Truth Report**: Save, view, and compare verification runs over time.

---

## Technical Stack & Architecture

- **Backend**: Python 3.14+, FastAPI, SQLAlchemy 2.0 (with PostgreSQL support, falling back to SQLite for local development and testing).
- **Security**: JWT-based authentication, password hashing with bcrypt.
- **Testing**: Pytest, HTTPX AsyncClient.
- **Design Principle**: Modular, traceable, and evidence-first.

---

## Directory Structure

```
.
├── backend/
│   ├── app/                # Application source code
│   │   ├── main.py         # FastAPI entrypoint
│   │   ├── core/           # Core configs, DB sessions, security
│   │   ├── auth/           # Login and token registration routers
│   │   ├── users/          # User management
│   │   ├── repositories/   # Target repositories metadata
│   │   ├── analyses/       # Historical and active verification runs
│   │   ├── claims/         # Extracted doc claims and verdicts
│   │   ├── evidence/       # Codebase and runtime evidence logs
│   │   ├── verification/   # Claim validation engines
│   │   └── reports/        # Truth report generators
│   └── tests/              # Pytest automated test suite
├── docs/                   # Product and project documentation
├── data/                   # Local database storage (SQLite)
├── README.md               # Quickstart guide (this file)
├── ARCHITECTURE.md         # Database schema & architectural overview
├── DEVELOPMENT_PLAN.md     # Multi-phase roadmap
└── PROJECT_RULES.md        # Technical guidelines & linting rules
```

---

## Getting Started

### 1. Requirements
- Python 3.14+
- `pip`

### 2. Setup Environment
Clone the repository and copy the example environment file:
```bash
cp .env.example .env
```

### 3. Install Dependencies
Create a virtual environment and install the required Python packages:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 4. Running the Database Migrations / Creating Tables
For development (using SQLite by default if no `DATABASE_URL` is set in `.env`), tables are automatically initialized upon startup. For production environments, SQLAlchemy creates tables using the configured database driver.

### 5. Running the Application
Start the FastAPI server via Uvicorn:
```bash
uvicorn backend.app.main:app --reload
```
Access the interactive OpenAPI Swagger documentation at: `http://127.0.0.1:8000/docs`

### 6. Running Tests
Run the test suite with verbose output:
```bash
pytest backend/tests -v
```
