export const GRADSCOPE_EXAMPLE_REPORT_MD = `# Nexus Documentation Truth Report

## Report Metadata
- **Repository Name**: gradscope
- **Repository URL**: https://github.com/burgulvedant/gradscope.git
- **Commit SHA**: 1a3471e
- **Analysis Run ID**: \`NEXUS-af264abc\`
- **Analysis Timestamp**: 2026-08-23T14:04:00Z
- **Total Files Scanned**: 64
- **Documentation Files Scanned**: 3
- **Analysis Status**: COMPLETED

## Verification Summary
- **Nexus Truth Score**: **75 / 100**
- **Total Claims Extracted**: 73
- **Verified Claims**: 36 (49.3%)
- **Uncertain Claims**: 37 (50.7%)
- **Contradicted Claims**: 0 (0.0%)

---

## Verdict Details

### Contradicted Findings
*No contradictions were detected in this analysis.*

### Verified Findings
#### 1. PostgreSQL 15+ Database Engine with pgvector Extension
- **Category**: DATABASE
- **Documentation Path**: \`docs/setup.md:14\`
- **Original Text**: *"Requires PostgreSQL 15+ with pgvector extension for dense embedding storage."*
- **Verdict Confidence**: 0.96
- **Explanation**: Found explicit PostgreSQL 15 schema migration scripts and vector extension activation commands matching documentation.
- **Discovered Code Evidence**:
  - **[SUPPORTS]** \`[CONFIGURATION]\` \`docker-compose.yml:18\`
    *Discovery*: regex_heuristic (Confidence: 0.98)
    *Preview*: \`image: pgvector/pgvector:pg15\`
  - **[SUPPORTS]** \`[SOURCE_CODE]\` \`backend/app/core/database.py:32\`
    *Discovery*: ast_parsing (Confidence: 0.95)
    *Preview*: \`CREATE EXTENSION IF NOT EXISTS vector;\`

#### 2. JWT Access Token Expiration
- **Category**: SECURITY
- **Documentation Path**: \`docs/security.md:28\`
- **Original Text**: *"User sessions expire after 86,400 seconds unless refreshed."*
- **Verdict Confidence**: 0.92
- **Explanation**: Found ACCESS_TOKEN_EXPIRE_MINUTES configuration set to 1440 minutes (86,400 seconds).
- **Discovered Code Evidence**:
  - **[SUPPORTS]** \`[CONFIGURATION]\` \`backend/app/core/config.py:45\`
    *Discovery*: ast_parsing (Confidence: 0.92)
    *Preview*: \`ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24\`

### Uncertain Findings
#### 1. Background Synchronization Interval
- **Category**: ARCHITECTURE
- **Documentation Path**: \`docs/architecture.md:42\`
- **Original Text**: *"Sync engine polls every 300 seconds for changed workspace files."*
- **Verdict Confidence**: 0.64
- **Explanation**: Polling scheduler definition discovered, but interval parameter is dynamically configurable via environment variables without a hardcoded 300s default.
- **Discovered Code Evidence**:
  - **[CONTEXTUAL]** \`[SOURCE_CODE]\` \`backend/app/tasks/sync.py:112\`
    *Discovery*: ast_parsing (Confidence: 0.64)
    *Preview*: \`poll_interval = settings.SYNC_INTERVAL_SECONDS\`

---

## Evidence Summary
| Source Type | Supporting | Contradicting | Contextual | Total |
| :--- | :---: | :---: | :---: | :---: |
| Source Code | 24 | 0 | 8 | 32 |
| Configuration | 12 | 0 | 3 | 15 |
| Dependencies | 8 | 0 | 1 | 9 |
| **Total** | **44** | **0** | **12** | **56** |

---
*Generated automatically by Nexus Documentation Truth Engine.*
`;
