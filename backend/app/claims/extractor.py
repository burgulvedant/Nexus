import os
import re
from typing import Optional
from pydantic import BaseModel

# Supported categories as specified by Phase 2
VALID_CATEGORIES = {
    "ARCHITECTURE", "DATABASE", "AUTHENTICATION", "API", "CONFIGURATION",
    "INSTALLATION", "COMMAND", "FEATURE", "DEPENDENCY", "DEPLOYMENT",
    "BEHAVIOR", "LIMIT", "OTHER"
}

# Technical keywords for boundary checks
TECH_KEYWORDS = {
    "api", "database", "postgres", "postgresql", "sqlite", "mysql", "fastapi",
    "react", "typescript", "python", "npm", "server", "port", "jwt", "auth"
}


class ExtractedClaim(BaseModel):
    title: str
    description: str
    category: str
    source_file: str
    line_number: int
    original_text: str
    extraction_method: str = "rule"
    confidence: float


def clean_markdown_line(line: str) -> str:
    """
    Cleans markdown styling chars like bolding, lists, and links to simplify keyword parsing.
    """
    cleaned = line.strip()
    # Remove headers indicator
    cleaned = re.sub(r"^#+\s+", "", cleaned)
    # Remove lists symbols
    cleaned = re.sub(r"^[\*\-\+]\s+", "", cleaned)
    cleaned = re.sub(r"^\d+\.\s+", "", cleaned)
    # Remove bold/italics markers
    cleaned = cleaned.replace("**", "").replace("__", "").replace("*", "").replace("_", "")
    # Remove markdown link styling [anchor](url) -> anchor
    cleaned = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", cleaned)
    return cleaned.strip()


def check_word_boundaries(text_lower: str, keywords: set[str]) -> bool:
    """
    Checks if any keyword is present as a standalone word (respecting word boundaries).
    Prevents false matches like 'port' inside 'support' or 'import'.
    """
    for kw in keywords:
        if re.search(r"\b" + re.escape(kw) + r"\b", text_lower):
            return True
    return False


def extract_claims_from_text(file_content: str, source_file_path: str) -> list[ExtractedClaim]:
    """
    Parses a documentation text file line-by-line and extracts technical claims.
    Ensures correct line number tracing and does not fabricate text.
    """
    claims = []
    lines = file_content.splitlines()

    in_code_block = False
    current_header = ""

    for idx, raw_line in enumerate(lines):
        line_num = idx + 1
        stripped = raw_line.strip()

        # Handle code blocks
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue

        if in_code_block:
            # Under code blocks, parse command lines (e.g. starting with npm, pip, python, uvicorn, cd)
            if stripped and not stripped.startswith("#"):
                # Clean prompt markers (e.g. $ npm install -> npm install)
                cmd_line = re.sub(r"^\$\s*", "", stripped).strip()
                tokens = cmd_line.lower().split()
                if tokens and tokens[0] in {"npm", "pip", "python", "python3", "uvicorn", "cd", "export", "source", "git", "docker", "docker-compose"}:
                    claims.append(
                        ExtractedClaim(
                            title="Command line utility execution",
                            description=f"Documentation outlines running command: `{cmd_line}`",
                            category="COMMAND",
                            source_file=source_file_path,
                            line_number=line_num,
                            original_text=raw_line,
                            extraction_method="rule",
                            confidence=0.95
                        )
                    )
            continue

        # Skip headers but record their text
        if stripped.startswith("#"):
            current_header = clean_markdown_line(stripped)
            continue

        # Filter out empty or trivial lines
        cleaned = clean_markdown_line(raw_line)
        if len(cleaned) < 15:
            continue

        # Filter opinionated / marketing fluff (unless containing core tech keywords)
        lower_cleaned = cleaned.lower()
        has_tech_keyword = check_word_boundaries(lower_cleaned, TECH_KEYWORDS)
        
        # Also check for explicit API path structures which might not match simple words
        if not has_tech_keyword:
            has_tech_keyword = "/api/" in lower_cleaned or "get /api" in lower_cleaned or "post /api" in lower_cleaned
            
        if not has_tech_keyword:
            # Filter generic marketing/opinion prose
            if any(fluff in lower_cleaned for fluff in {"awesome", "amazing", "beautiful", "helps students", "prospective", "simplifies"}):
                continue

        # Classification heuristics
        # 1. API Specifications / Endpoints
        if "get /api/" in lower_cleaned or "post /api/" in lower_cleaned or "/api/" in lower_cleaned or "rest endpoint" in lower_cleaned:
            # Extract API path
            path_match = re.search(r"(/api/[\w\-\/]+)", cleaned)
            path = path_match.group(1) if path_match else "endpoint"
            claims.append(
                ExtractedClaim(
                    title=f"API Endpoint {path} Exposure",
                    description=cleaned,
                    category="API",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.95
                )
            )
            continue

        # 2. Database Claims
        if any(re.search(r"\b" + db + r"\b", lower_cleaned) for db in {"postgresql", "postgres", "sqlite", "mysql", "database", "db_name", "psycopg"}):
            claims.append(
                ExtractedClaim(
                    title="Database management system specification",
                    description=cleaned,
                    category="DATABASE",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.90
                )
            )
            continue

        # 3. Authentication Claims
        if any(re.search(r"\b" + auth + r"\b", lower_cleaned) for auth in {"jwt", "auth", "login", "session", "password", "token"}):
            claims.append(
                ExtractedClaim(
                    title="User authentication mechanism",
                    description=cleaned,
                    category="AUTHENTICATION",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.90
                )
            )
            continue

        # 4. Configurations & Data Sources
        if any(cfg in lower_cleaned for cfg in {".env", "requirements.txt", "package.json", "pyproject.toml", ".gitignore", ".csv", "dataset"}):
            # Check if it cites a specific CSV or config file
            file_match = re.search(r"([\w\-\/]+\.(?:csv|txt|json|toml|yml|yaml|ini))", cleaned)
            title = f"Data file reference: {file_match.group(1)}" if file_match else "Configuration metadata specification"
            claims.append(
                ExtractedClaim(
                    title=title,
                    description=cleaned,
                    category="CONFIGURATION",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.90
                )
            )
            continue

        # 5. Limitations
        if "limit" in lower_cleaned or "limited" in lower_cleaned or "horizon" in lower_cleaned or "reset to" in lower_cleaned:
            claims.append(
                ExtractedClaim(
                    title="Application capability limit",
                    description=cleaned,
                    category="LIMIT",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.90
                )
            )
            continue

        # 6. Deployment Specs
        if any(dep in lower_cleaned for dep in {"netlify", "render", "deployed on", "ci/cd", "onrender.com", "netlify.app"}):
            claims.append(
                ExtractedClaim(
                    title="Hosting deployment environment",
                    description=cleaned,
                    category="DEPLOYMENT",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.90
                )
            )
            continue

        # 7. Architecture Claims
        if any(arch in lower_cleaned for arch in {"full-stack", "frontend:", "backend:", "architecture", "monolith", "rest api", "built with fastapi"}):
            claims.append(
                ExtractedClaim(
                    title="System architectural style",
                    description=cleaned,
                    category="ARCHITECTURE",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.85
                )
            )
            continue

        # 8. Prerequisites & Dependencies
        if "prerequisites" in lower_cleaned or "node.js" in lower_cleaned or "python (v" in lower_cleaned:
            claims.append(
                ExtractedClaim(
                    title="Environment prerequisite installation",
                    description=cleaned,
                    category="INSTALLATION",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.85
                )
            )
            continue

        if any(dep in cleaned for dep in {"React", "FastAPI", "Vite", "TypeScript", "Tailwind CSS", "SQLAlchemy", "Pydantic", "Uvicorn", "Pandas"}):
            claims.append(
                ExtractedClaim(
                    title="Software engineering dependency",
                    description=cleaned,
                    category="DEPENDENCY",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.90
                )
            )
            continue

        # 9. Application Features
        if any(feat in lower_cleaned for feat in {"stepper", "wizard", "viewport", "visualiz", "chart", "table", "accordions", "calculator"}):
            claims.append(
                ExtractedClaim(
                    title="Application feature component",
                    description=cleaned,
                    category="FEATURE",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.80
                )
            )
            continue

        # 10. Core logical Behaviors
        if any(beh in lower_cleaned for beh in {"calculates", "estimates", "combining", "duration", "tuition"}):
            claims.append(
                ExtractedClaim(
                    title="Mathematical model behavior",
                    description=cleaned,
                    category="BEHAVIOR",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.80
                )
            )
            continue

        # 11. Fallback / Generic Technical sentences
        if has_tech_keyword:
            claims.append(
                ExtractedClaim(
                    title="Technical prose assertion",
                    description=cleaned,
                    category="OTHER",
                    source_file=source_file_path,
                    line_number=line_num,
                    original_text=raw_line,
                    confidence=0.70
                )
            )

    return claims


def extract_claims_from_file(file_path: str, relative_path: str) -> list[ExtractedClaim]:
    """
    Safely reads file and extracts claims.
    """
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        return extract_claims_from_text(content, relative_path)
    except Exception:
        return []
