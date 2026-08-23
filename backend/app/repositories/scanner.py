import os
import re
import shutil
import subprocess
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict

# Regular expression to match public GitHub URLs (with optional .git and trailing slashes)
GITHUB_URL_REGEX = re.compile(
    r"^https?://(www\.)?github\.com/[\w\-\.]+/(?P<name>[\w\-\.]+?)(?:\.git)?(/?)$",
    re.IGNORECASE
)

# Directory names that should be excluded from scanning
IGNORED_DIR_NAMES = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    "dist",
    "build",
    "coverage",
    ".pytest_cache",
    ".mypy_cache",
    ".idea",
    ".vscode",
    "vendor"
}

# Binary and generated file extensions that should be classified as ignored
IGNORED_EXTENSIONS = {
    # Compiled / Bytecode / Database
    ".pyc", ".pyo", ".pyd", ".db", ".sqlite", ".class", ".o", ".obj", ".so", ".dll", ".exe",
    # Images & Media
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".mp4", ".mp3", ".wav", ".avi",
    # Archives
    ".zip", ".tar.gz", ".tar", ".gz", ".rar", ".7z",
    # Documents (binary formats)
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    # Fonts
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    # System / Lock files
    ".lock", ".ds_store", "thumbs.db"
}

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # Skip files larger than 10MB (likely data or binary)


class FileRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    path: str
    category: str
    extension: str
    size: int
    line_count: Optional[int] = None


class RepositoryScanResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    repository_url: str
    repository_name: str
    commit_sha: str
    default_branch: str
    total_files: int
    scan_timestamp: datetime
    documentation_files: list[FileRecord]
    source_files: list[FileRecord]
    test_files: list[FileRecord]
    configuration_files: list[FileRecord]
    api_specification_files: list[FileRecord]
    other_files: list[FileRecord]
    ignored_files: list[FileRecord]


def validate_repository_url(url: str) -> bool:
    """
    Validates if the provided string is a valid GitHub URL or a valid local directory path.
    """
    if not url:
        return False
    if os.path.isabs(url) and os.path.isdir(url):
        return True
    return bool(GITHUB_URL_REGEX.match(url))


def acquire_repository(url: str, temp_dir: str, github_token: str | None = None) -> dict:
    """
    Acquires the target repository. Clones from GitHub (with optional auth for private repos), or copies local directories (for offline/test support).
    Returns basic metadata dictionary: {name, commit_sha, default_branch}
    """
    name = "unknown"
    commit_sha = "unknown"
    default_branch = "main"

    # Identify repository name
    match = GITHUB_URL_REGEX.match(url)
    if match:
        name = match.group("name")
        if name.endswith(".git"):
            name = name[:-4]
    elif os.path.isabs(url):
        name = os.path.basename(url.rstrip("/"))

    try:
        # Check if local path copy is required
        if os.path.isabs(url):
            if not os.path.isdir(url):
                raise ValueError(f"Local directory does not exist: {url}")
            
            # If it's a Git repository, we can clone it locally for accuracy
            if os.path.isdir(os.path.join(url, ".git")):
                subprocess.run(
                    ["git", "clone", "--depth", "1", url, temp_dir],
                    check=True,
                    capture_output=True,
                    text=True
                )
            else:
                # Copy folder directly
                shutil.copytree(url, temp_dir, dirs_exist_ok=True)
        else:
            # Clone from remote Github
            clone_target = url
            if github_token and "github.com" in url:
                # Format: https://x-access-token:<token>@github.com/org/repo.git
                cleaned_url = url.replace("https://", "").replace("http://", "")
                clone_target = f"https://x-access-token:{github_token}@{cleaned_url}"

            subprocess.run(
                ["git", "clone", "--depth", "1", clone_target, temp_dir],
                check=True,
                capture_output=True,
                text=True
            )

        # Retrieve Git metadata if temp_dir contains a Git repository
        if os.path.isdir(os.path.join(temp_dir, ".git")):
            # Get current commit SHA
            sha_res = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                check=True
            )
            commit_sha = sha_res.stdout.strip()

            # Get default branch name
            branch_res = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                check=True
            )
            default_branch = branch_res.stdout.strip()

    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Git operation failed: {e.stderr or e}")
    except Exception as e:
        raise RuntimeError(f"Failed to acquire repository from {url}: {e}")

    return {
        "name": name,
        "commit_sha": commit_sha,
        "default_branch": default_branch
    }


def count_lines(file_path: str) -> int:
    """
    Safe utility to count lines of text files. Returns 0 if binary or if errors occur.
    """
    try:
        # Check for null bytes to avoid parsing binary files
        with open(file_path, "rb") as f:
            chunk = f.read(1024)
            if b"\x00" in chunk:
                return 0
        
        count = 0
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            for _ in f:
                count += 1
        return count
    except Exception:
        return 0


def classify_file(relative_path: str, file_size: int) -> str:
    """
    Classifies a file path into one of the designated categories:
    DOCUMENTATION, SOURCE_CODE, TEST, CONFIGURATION, API_SPECIFICATION, IGNORED, OTHER
    """
    filename = os.path.basename(relative_path).lower()
    ext = os.path.splitext(filename)[1]

    # 1. Ignored files/sizes
    if ext in IGNORED_EXTENSIONS or file_size > MAX_FILE_SIZE_BYTES:
        return "IGNORED"

    # Split parts to evaluate folder components
    parts = [p.lower() for p in relative_path.replace("\\", "/").split("/")]

    # 2. API Specifications
    if filename in {"openapi.json", "openapi.yaml", "openapi.yml", "swagger.json", "swagger.yaml", "swagger.yml"}:
        return "API_SPECIFICATION"
    if "openapi" in filename or "swagger" in filename:
        if ext in {".json", ".yaml", ".yml"}:
            return "API_SPECIFICATION"

    # 3. Tests
    is_test_dir = any(p in {"tests", "test", "spec", "__tests__"} for p in parts)
    is_test_file = (
        filename.startswith("test_") or 
        filename.endswith("_test.py") or 
        ".test." in filename or 
        ".spec." in filename
    )
    if is_test_dir or is_test_file:
        return "TEST"

    # 4. Configuration
    if filename in {
        "requirements.txt", "package.json", "pyproject.toml", "setup.py",
        "poetry.lock", "package-lock.json", "pipfile", "tsconfig.json",
        "webpack.config.js", "makefile", "gemfile", "cargo.toml", ".gitignore"
    } or filename.startswith("dockerfile") or filename.startswith("docker-compose") or filename.startswith(".env."):
        return "CONFIGURATION"

    # 5. Documentation
    is_doc_ext = ext in {".md", ".rst", ".markdown", ".adoc"}
    is_doc_dir = any(p in {"docs", "doc", "documentation", "wiki"} for p in parts)
    if is_doc_ext or (is_doc_dir and ext in {".txt", ".html", ".xml"}):
        return "DOCUMENTATION"

    # 6. Source Code
    if ext in {
        ".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".rs", ".java", ".c", ".cpp",
        ".h", ".rb", ".php", ".sh", ".scala", ".cs", ".kt", ".swift", ".m", ".pl"
    }:
        return "SOURCE_CODE"

    return "OTHER"


def scan_directory(dir_path: str) -> dict:
    """
    Recursively scans the directory and builds lists of classified FileRecord details.
    """
    documentation_files = []
    source_files = []
    test_files = []
    configuration_files = []
    api_specification_files = []
    other_files = []
    ignored_files = []

    for root, dirs, files in os.walk(dir_path):
        # Prune ignored directory structures in-place to avoid wasting traversals
        dirs[:] = [d for d in dirs if d not in IGNORED_DIR_NAMES]

        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, dir_path)
            
            try:
                stat = os.stat(full_path)
                size = stat.st_size
            except Exception:
                # If cannot access file metadata, default size to 0
                size = 0

            category = classify_file(rel_path, size)
            ext = os.path.splitext(file)[1].lstrip(".").lower()

            line_count = None
            if category != "IGNORED":
                line_count = count_lines(full_path)

            record = FileRecord(
                path=rel_path,
                category=category,
                extension=ext,
                size=size,
                line_count=line_count
            )

            if category == "DOCUMENTATION":
                documentation_files.append(record)
            elif category == "SOURCE_CODE":
                source_files.append(record)
            elif category == "TEST":
                test_files.append(record)
            elif category == "CONFIGURATION":
                configuration_files.append(record)
            elif category == "API_SPECIFICATION":
                api_specification_files.append(record)
            elif category == "IGNORED":
                ignored_files.append(record)
            else:
                other_files.append(record)

    total_files = (
        len(documentation_files) +
        len(source_files) +
        len(test_files) +
        len(configuration_files) +
        len(api_specification_files) +
        len(other_files) +
        len(ignored_files)
    )

    return {
        "total_files": total_files,
        "documentation_files": documentation_files,
        "source_files": source_files,
        "test_files": test_files,
        "configuration_files": configuration_files,
        "api_specification_files": api_specification_files,
        "other_files": other_files,
        "ignored_files": ignored_files
    }


def perform_scan(repository_url: str) -> RepositoryScanResult:
    """
    Orchestrates the entire scan process: creates temp directory, acquires repo,
    scans contents, classifies files, cleans up, and returns structured result.
    """
    if not validate_repository_url(repository_url):
        raise ValueError(f"Invalid repository URL or path: {repository_url}")

    # Generate a unique temp directory in project-local environment (keeps it contained)
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    temp_root = os.path.join(project_root, "data", "temp_scans")
    os.makedirs(temp_root, exist_ok=True)
    
    scan_id = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
    temp_dir = os.path.join(temp_root, f"scan_{scan_id}")

    try:
        # 1. Acquire repo
        meta = acquire_repository(repository_url, temp_dir)
        
        # 2. Run Scan
        scan_data = scan_directory(temp_dir)
        
        # 3. Build Result
        result = RepositoryScanResult(
            repository_url=repository_url,
            repository_name=meta["name"],
            commit_sha=meta["commit_sha"],
            default_branch=meta["default_branch"],
            scan_timestamp=datetime.now(timezone.utc),
            **scan_data
        )
        return result
    finally:
        # Ensure cleanup is executed
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
