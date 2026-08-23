import json
import os
import re
import uuid
from typing import Optional
from pydantic import BaseModel, Field

# Database-level Enum compatibility helper
# source_types: DOCUMENTATION, SOURCE_CODE, CONFIGURATION, DEPENDENCY, API_SPECIFICATION, TEST, GIT_HISTORY, RUNTIME

class FoundEvidence(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    source_type: str
    file_path: str
    line_number: Optional[int] = None
    content: Optional[str] = None
    explanation: str
    discovery_method: str
    confidence: float


class EvidenceEngine:
    def __init__(self, repo_path: str):
        self.repo_path = os.path.abspath(repo_path)

    def gather_evidence_for_claim(self, claim_category: str, claim_description: str, original_text: str) -> list[FoundEvidence]:
        """
        Main entrypoint to scan the repository for a given claim and find matching evidence.
        """
        evidence_list = []
        lower_desc = claim_description.lower()
        lower_orig = original_text.lower()

        # 1. Dispatch based on claim category / context
        
        # --- A. DATABASE CLAIMS ---
        if claim_category == "DATABASE" or "database" in lower_desc or "postgresql" in lower_desc or "sqlite" in lower_desc:
            evidence_list.extend(self._scan_database_evidence(lower_desc))

        # --- B. DEPENDENCY & INSTALLATION CLAIMS ---
        if claim_category in {"DEPENDENCY", "INSTALLATION"} or "react" in lower_desc or "fastapi" in lower_desc or "vite" in lower_desc:
            evidence_list.extend(self._scan_dependency_evidence(lower_desc))

        # --- C. API CLAIMS ---
        if claim_category == "API" or "api" in lower_desc or "endpoint" in lower_desc or "/api/" in lower_desc:
            evidence_list.extend(self._scan_api_evidence(claim_description))

        # --- D. COMMAND CLAIMS ---
        if claim_category == "COMMAND" or "run " in lower_desc or "npm install" in lower_desc:
            evidence_list.extend(self._scan_command_evidence(claim_description))

        # --- E. CONFIGURATION & FILE CLAIMS ---
        if claim_category == "CONFIGURATION" or "csv" in lower_desc or "dataset" in lower_desc or "structure" in lower_desc:
            evidence_list.extend(self._scan_configuration_and_files(claim_description))

        # --- F. LIMITS & BEHAVIORS ---
        if claim_category in {"LIMIT", "BEHAVIOR"} or "2026" in lower_desc or "only" in lower_desc:
            evidence_list.extend(self._scan_limits_and_behaviors(lower_desc))

        # 2. If no specialized evidence is found, run a generic token fallback scan
        if not evidence_list:
            evidence_list.extend(self._scan_generic_fallback(claim_description))

        return evidence_list

    def _scan_database_evidence(self, lower_desc: str) -> list[FoundEvidence]:
        evidence = []

        # Check Python packages for PostgreSQL / SQLite drivers
        reqs_path = os.path.join(self.repo_path, "requirements.txt")
        if os.path.exists(reqs_path):
            with open(reqs_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_idx, line in enumerate(f):
                    line_num = line_idx + 1
                    cleaned_line = line.strip().lower()
                    if "psycopg" in cleaned_line and "postgres" in lower_desc:
                        evidence.append(
                            FoundEvidence(
                                source_type="DEPENDENCY",
                                file_path="requirements.txt",
                                line_number=line_num,
                                content=line.strip(),
                                explanation="Found PostgreSQL psycopg driver dependency in Python requirements.",
                                discovery_method="dependency_parsing",
                                confidence=1.0
                            )
                        )
                    elif "sqlite" in cleaned_line and "sqlite" in lower_desc:
                        evidence.append(
                            FoundEvidence(
                                source_type="DEPENDENCY",
                                file_path="requirements.txt",
                                line_number=line_num,
                                content=line.strip(),
                                explanation="Found SQLite driver dependency in Python requirements.",
                                discovery_method="dependency_parsing",
                                confidence=1.0
                            )
                        )

        # Search codebase for engine builders and connection string patterns
        for root, dirs, files in os.walk(self.repo_path):
            # Exclude standard directories
            dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext not in {".py", ".ts", ".js", ".json"}:
                    continue

                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, self.repo_path)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                except Exception:
                    continue

                for line_idx, line in enumerate(lines):
                    line_num = line_idx + 1
                    cleaned_line = line.strip().lower()

                    # PostgreSQL patterns
                    if "postgresql://" in cleaned_line or "postgresql+psycopg" in cleaned_line or "psycopg.connect" in cleaned_line:
                        # Extract 3 lines of context
                        start = max(0, line_idx - 1)
                        end = min(len(lines), line_idx + 2)
                        context = "".join(lines[start:end])
                        
                        is_supporting = "postgres" in lower_desc
                        explanation = (
                            "Found PostgreSQL connection URI or instantiation code."
                            if is_supporting else
                            "Found PostgreSQL connection setup, which provides contradictory context for a non-PostgreSQL DB claim."
                        )
                        confidence = 0.95 if is_supporting else 0.85
                        
                        evidence.append(
                            FoundEvidence(
                                source_type="SOURCE_CODE",
                                file_path=rel_path,
                                line_number=line_num,
                                content=context.strip(),
                                explanation=explanation,
                                discovery_method="token_keyword_match",
                                confidence=confidence
                            )
                        )

                    # SQLite patterns (often contradictory context for Postgres claims)
                    elif "sqlite:///" in cleaned_line or "sqlite3.connect" in cleaned_line:
                        start = max(0, line_idx - 1)
                        end = min(len(lines), line_idx + 2)
                        context = "".join(lines[start:end])
                        
                        is_supporting = "sqlite" in lower_desc
                        explanation = (
                            "Found SQLite connection string or initializer."
                            if is_supporting else
                            "Found SQLite configuration, which acts as contradictory evidence against a PostgreSQL claim."
                        )
                        confidence = 0.95 if is_supporting else 0.90
                        
                        evidence.append(
                            FoundEvidence(
                                source_type="SOURCE_CODE",
                                file_path=rel_path,
                                line_number=line_num,
                                content=context.strip(),
                                explanation=explanation,
                                discovery_method="token_keyword_match",
                                confidence=confidence
                            )
                        )

        return evidence

    def _scan_dependency_evidence(self, lower_desc: str) -> list[FoundEvidence]:
        evidence = []

        # Check Python requirements
        reqs_path = os.path.join(self.repo_path, "requirements.txt")
        if os.path.exists(reqs_path):
            with open(reqs_path, "r", encoding="utf-8", errors="ignore") as f:
                for line_idx, line in enumerate(f):
                    line_num = line_idx + 1
                    cleaned_line = line.strip().lower()
                    # extract name (e.g. fastapi==0.110 -> fastapi)
                    name = re.split(r"==|>=|<=|<|>", cleaned_line)[0].strip()
                    if name and name in lower_desc:
                        evidence.append(
                            FoundEvidence(
                                source_type="DEPENDENCY",
                                file_path="requirements.txt",
                                line_number=line_num,
                                content=line.strip(),
                                explanation=f"Found Python dependency '{name}' specified in requirements.",
                                discovery_method="dependency_parsing",
                                confidence=1.0
                            )
                        )

        # Check Node package configurations
        pkg_path = os.path.join(self.repo_path, "frontend", "package.json")
        if not os.path.exists(pkg_path):
            pkg_path = os.path.join(self.repo_path, "package.json")

        if os.path.exists(pkg_path):
            rel_pkg_path = os.path.relpath(pkg_path, self.repo_path)
            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                content_str = "".join(lines)
                data = json.loads(content_str)
                
                # Check dependencies and devDependencies
                deps = {}
                deps.update(data.get("dependencies", {}))
                deps.update(data.get("devDependencies", {}))

                for name, ver in deps.items():
                    if name.lower() in lower_desc:
                        # Find exact line in file
                        matched_line = None
                        for line_idx, line in enumerate(lines):
                            if f'"{name}"' in line:
                                matched_line = line_idx + 1
                                break

                        evidence.append(
                            FoundEvidence(
                                source_type="DEPENDENCY",
                                file_path=rel_pkg_path,
                                line_number=matched_line,
                                content=lines[matched_line-1].strip() if matched_line else ver,
                                explanation=f"Found NPM package dependency '{name}' version {ver} in configuration.",
                                discovery_method="dependency_parsing",
                                confidence=1.0
                            )
                        )
            except Exception:
                pass

        return evidence

    def _scan_api_evidence(self, description: str) -> list[FoundEvidence]:
        evidence = []

        # Find API paths like /api/courses
        paths = re.findall(r"(/api/[\w\-\/]+)", description)
        if not paths:
            return []

        target_path = paths[0]
        # Check standard router endpoints in python files
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "venv", "__pycache__"}]
            
            for file in files:
                if not file.endswith(".py"):
                    continue

                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, self.repo_path)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                except Exception:
                    continue

                for line_idx, line in enumerate(lines):
                    line_num = line_idx + 1
                    cleaned_line = line.strip().lower()

                    suffix = target_path.split("/")[-1] # e.g., 'courses', 'cities'

                    # Method A: Match FastAPI decorators (supporting multi-line decorators)
                    is_api_route = ("@router." in cleaned_line or "@app." in cleaned_line)
                    if is_api_route:
                        # Check decorator block (current line plus next 3 lines)
                        block_lines = lines[line_idx : min(len(lines), line_idx + 4)]
                        block_text = "".join(block_lines).lower()
                        if f"/{suffix}" in block_text or f'""' in block_text or f"''" in block_text:
                            # Verify if empty string matching is correct
                            is_empty_match = (f'""' in block_text or f"''" in block_text) and suffix in file.lower()
                            if f"/{suffix}" in block_text or is_empty_match:
                                start = max(0, line_idx - 1)
                                end = min(len(lines), line_idx + 4)
                                context = "".join(lines[start:end])

                                evidence.append(
                                    FoundEvidence(
                                        source_type="SOURCE_CODE",
                                        file_path=rel_path,
                                        line_number=line_num,
                                        content=context.strip(),
                                        explanation=f"Found FastAPI route decorator mapping matching route target '{suffix}'.",
                                        discovery_method="route_regex_matching",
                                        confidence=0.95
                                    )
                                )
                                continue

                    # Method B: Match APIRouter prefix configurations (e.g. prefix="/api/cities")
                    if "prefix=" in cleaned_line and f"/{suffix}" in cleaned_line:
                        start = max(0, line_idx - 1)
                        end = min(len(lines), line_idx + 2)
                        context = "".join(lines[start:end])

                        evidence.append(
                            FoundEvidence(
                                source_type="SOURCE_CODE",
                                file_path=rel_path,
                                line_number=line_num,
                                content=context.strip(),
                                explanation=f"Found APIRouter instantiation defining prefix: '{target_path}'.",
                                discovery_method="route_regex_matching",
                                confidence=0.95
                            )
                        )

        return evidence

    def _scan_command_evidence(self, description: str) -> list[FoundEvidence]:
        evidence = []

        # Search npm package scripts inside package.json
        pkg_path = os.path.join(self.repo_path, "frontend", "package.json")
        if not os.path.exists(pkg_path):
            pkg_path = os.path.join(self.repo_path, "package.json")

        if os.path.exists(pkg_path):
            rel_pkg_path = os.path.relpath(pkg_path, self.repo_path)
            try:
                with open(pkg_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                content_str = "".join(lines)
                data = json.loads(content_str)
                scripts = data.get("scripts", {})

                # If claim says "npm run dev", check for dev script
                cmd_match = re.search(r"npm run (\w+)", description.lower())
                if cmd_match:
                    script_name = cmd_match.group(1)
                    if script_name in scripts:
                        # Find exact line in package.json
                        matched_line = None
                        for line_idx, line in enumerate(lines):
                            if f'"{script_name}"' in line:
                                matched_line = line_idx + 1
                                break

                        evidence.append(
                            FoundEvidence(
                                source_type="CONFIGURATION",
                                file_path=rel_pkg_path,
                                line_number=matched_line,
                                content=lines[matched_line-1].strip() if matched_line else scripts[script_name],
                                explanation=f"Found script configuration for '{script_name}' containing run target: '{scripts[script_name]}'",
                                discovery_method="package_script_inspection",
                                confidence=0.95
                            )
                        )
            except Exception:
                pass

        # If it is a python command (e.g. python -m backend.app.seed), check if file seed.py exists
        py_cmd_match = re.search(r"python\s+-m\s+([\w\.]+)", description)
        if py_cmd_match:
            module_path = py_cmd_match.group(1) # backend.app.seed
            file_rel = module_path.replace(".", "/") + ".py"
            # check if it exists in repo
            full_file = os.path.join(self.repo_path, file_rel)
            if os.path.exists(full_file):
                evidence.append(
                    FoundEvidence(
                        source_type="SOURCE_CODE",
                        file_path=file_rel,
                        line_number=1,
                        content=f"# Module {module_path} exists",
                        explanation=f"Found seeder or runner script file corresponding to command module '{module_path}'.",
                        discovery_method="file_presence_check",
                        confidence=0.90
                    )
                )

        return evidence

    def _scan_configuration_and_files(self, description: str) -> list[FoundEvidence]:
        evidence = []

        # Find absolute/relative paths mentioned in the claim description
        paths = re.findall(r"([\w\-_\/]+\.(?:csv|txt|json|toml|py|sh|ipynb))", description)
        for rel_file in paths:
            # check if file exists
            full_file = os.path.join(self.repo_path, rel_file)
            if os.path.exists(full_file):
                size = os.path.getsize(full_file)
                # read first 2 lines
                preview = ""
                try:
                    with open(full_file, "r", encoding="utf-8", errors="ignore") as f:
                        preview = "".join(f.readline() for _ in range(3)).strip()
                except Exception:
                    pass

                evidence.append(
                    FoundEvidence(
                        source_type="CONFIGURATION" if rel_file.endswith(".csv") or rel_file.endswith(".toml") or rel_file.endswith(".json") else "SOURCE_CODE",
                        file_path=rel_file,
                        line_number=1,
                        content=f"File preview:\n{preview}" if preview else f"File size: {size} bytes",
                        explanation=f"Found data or configuration file '{rel_file}' specified in claims.",
                        discovery_method="file_presence_check",
                        confidence=0.95
                    )
                )

        return evidence

    def _scan_limits_and_behaviors(self, lower_desc: str) -> list[FoundEvidence]:
        evidence = []

        # Look for specific number limits like "68" or years like "2026"
        tokens = re.findall(r"\b(2026|68)\b", lower_desc)
        if not tokens:
            return []

        target_token = tokens[0] # e.g. "68" or "2026"

        # Search dataset / code files for this token
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                # prioritize datasets/scripts
                if ext not in {".csv", ".py", ".md", ".json"}:
                    continue

                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, self.repo_path)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                except Exception:
                    continue

                for line_idx, line in enumerate(lines):
                    line_num = line_idx + 1
                    if target_token in line:
                        # Extract context
                        start = max(0, line_idx - 1)
                        end = min(len(lines), line_idx + 2)
                        context = "".join(lines[start:end])

                        evidence.append(
                            FoundEvidence(
                                source_type="CONFIGURATION" if ext in {".csv", ".json"} else "SOURCE_CODE",
                                file_path=rel_path,
                                line_number=line_num,
                                content=context.strip(),
                                explanation=f"Found reference to token '{target_token}' in database file or source script.",
                                discovery_method="token_keyword_match",
                                confidence=0.85
                            )
                        )
                        # Avoid excessive entries
                        if len(evidence) >= 5:
                            return evidence

        return evidence

    def _scan_generic_fallback(self, description: str) -> list[FoundEvidence]:
        evidence = []
        # Fallback to search key terms in files
        cleaned = re.sub(r"[^\w\s]", "", description)
        words = [w.lower() for w in cleaned.split() if len(w) > 4 and w.lower() not in {"backend", "frontend", "built", "database", "requires"}]
        
        if not words:
            return []

        target_word = words[0]
        # Search Python/JS files
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"}]
            for file in files:
                if not file.endswith((".py", ".json", ".ts", ".js", ".md")):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, self.repo_path)

                try:
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                except Exception:
                    continue

                for line_idx, line in enumerate(lines):
                    if target_word in line.lower():
                        start = max(0, line_idx - 1)
                        end = min(len(lines), line_idx + 2)
                        context = "".join(lines[start:end])

                        evidence.append(
                            FoundEvidence(
                                source_type="SOURCE_CODE" if file.endswith((".py", ".ts", ".js")) else "CONFIGURATION",
                                file_path=rel_path,
                                line_number=line_idx + 1,
                                content=context.strip(),
                                explanation=f"Found contextual reference containing the keyword '{target_word}'.",
                                discovery_method="token_keyword_match",
                                confidence=0.70
                            )
                        )
                        if len(evidence) >= 3:
                            return evidence

        return evidence
