# Development Plan - Documentation Truth Engine

This document tracks the incremental roadmap for building the Documentation Truth Engine from Phase 0 to Phase 10.

---

## Roadmap

### Phase 0: Technical Foundation (Completed)
- Set up FastAPI app structure.
- Define database models using SQLAlchemy 2.0.
- Implement JWT authentication and password hashing.
- Build basic tests and verification suite.
- Create developer guidelines and rules.

### Phase 1: Repository Scanner (Completed)
- Clones a remote repository URL.
- Traverses folders and identifies documentation files (e.g., Markdown, RST).
- Classifies files and returns structured scan results.

### Phase 2: Documentation Claim Extraction (Completed)
- Develop a claim extraction system.
- Parse markdown text to identify declarative sentences representing technical assertions.
- Support metadata collection (document name, line numbers).

### Phase 3: Evidence Engine (Completed)
- Build parser plugins searching through code, tests, and configuration files.
- Index symbols, tests, routes, and git author changes.

### Phase 4: Truth Verification Engine (Current Phase)
- Correlate claims against collected evidence.
- Calculate verdict state (`VERIFIED`, `UNCERTAIN`, `CONTRADICTED`) and confidence values.
- Persist verdicts and generate diagnostic explanations.

### Phase 5: GradScope Documentation Truth Report (Completed)
- Generate structured JSON and Markdown truth reports from analysis data.
- Associate reports with user/repository/analysis for future dashboard retrieval.
- Output complete GradScope verification report with all 73 claims.

### Phase 6: Nexus Landing Page + Dashboard UI (Current Phase)
- Build a premium landing page with: Navbar, Hero, Product Preview, Evidence Strip.
- Create the Nexus visual identity and scroll-reveal animations.
- Build the authenticated dashboard displaying repositories, analyses, and truth reports.

### Phase 7: Git History Analysis
- Incorporate repository git commits as evidence.
- Track when claims were introduced vs. when underlying source files were modified.

### Phase 8: Runtime Verification using Isolated Docker Execution
- Build an execution environment wrapper.
- Execute unit tests or send API requests in isolated Docker environments to verify live API runtime behaviors.

### Phase 9: GitHub OAuth & Private Repositories
- Enable GitHub auth.
- Integrate personal access tokens (PAT) or GitHub App credentials to scan private repos.

### Phase 10: GitHub PR Integration
- Attach truth reports as checks or comments on GitHub Pull Requests to catch drift and contradictions before code merges.
