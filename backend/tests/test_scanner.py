import os
import shutil
import subprocess
import tempfile
import pytest

from backend.app.repositories.scanner import (
    validate_repository_url,
    classify_file,
    count_lines,
    perform_scan,
    scan_directory
)

def test_url_validation():
    # Valid GitHub URLs
    assert validate_repository_url("https://github.com/google/guava") is True
    assert validate_repository_url("http://github.com/google/guava.git") is True
    assert validate_repository_url("https://www.github.com/google/guava/") is True
    assert validate_repository_url("https://github.com/burgulvedant/gradscope") is True

    # Invalid URLs
    assert validate_repository_url("https://github.com/google") is False  # Missing repository name
    assert validate_repository_url("https://gitlab.com/google/guava") is False  # Non-GitHub
    assert validate_repository_url("google/guava") is False  # Malformed
    assert validate_repository_url("") is False

    # Valid local path (absolute path to current directory)
    current_dir = os.path.abspath(os.path.dirname(__file__))
    assert validate_repository_url(current_dir) is True
    assert validate_repository_url("/nonexistent/directory/path") is False


def test_file_classification():
    # 1. Documentation
    assert classify_file("README.md", 100) == "DOCUMENTATION"
    assert classify_file("docs/index.rst", 500) == "DOCUMENTATION"
    assert classify_file("doc/setup.txt", 200) == "DOCUMENTATION"
    
    # 2. Source Code
    assert classify_file("app/main.py", 1000) == "SOURCE_CODE"
    assert classify_file("src/components/button.tsx", 3000) == "SOURCE_CODE"
    assert classify_file("scripts/run.sh", 400) == "SOURCE_CODE"

    # 3. Tests
    assert classify_file("tests/test_auth.py", 2000) == "TEST"
    assert classify_file("src/utils.test.js", 800) == "TEST"
    assert classify_file("spec/helpers/mock.ts", 1500) == "TEST"

    # 4. Configuration
    assert classify_file("requirements.txt", 150) == "CONFIGURATION"
    assert classify_file("pyproject.toml", 800) == "CONFIGURATION"
    assert classify_file("Dockerfile", 400) == "CONFIGURATION"
    assert classify_file("docker-compose.yml", 600) == "CONFIGURATION"
    assert classify_file(".env.example", 100) == "CONFIGURATION"

    # 5. API Specification
    assert classify_file("openapi.yaml", 2500) == "API_SPECIFICATION"
    assert classify_file("swagger.json", 9000) == "API_SPECIFICATION"
    assert classify_file("docs/api-spec.openapi.json", 15000) == "API_SPECIFICATION"

    # 6. Ignored
    assert classify_file("app/icon.png", 5000) == "IGNORED"
    assert classify_file("archive.zip", 99999) == "IGNORED"
    assert classify_file("src/large_model.bin", 20 * 1024 * 1024) == "IGNORED"  # > 10MB limit


def test_line_counting():
    with tempfile.NamedTemporaryFile(mode="w+", delete=False, suffix=".txt") as temp:
        temp.write("line 1\nline 2\n\nline 4\n")
        temp_path = temp.name

    try:
        assert count_lines(temp_path) == 4
    finally:
        os.unlink(temp_path)

    # Test binary file detection
    with tempfile.NamedTemporaryFile(mode="wb+", delete=False, suffix=".bin") as temp:
        temp.write(b"line 1\x00binary_stuff\nline 2")
        temp_path = temp.name

    try:
        assert count_lines(temp_path) == 0
    finally:
        os.unlink(temp_path)


def test_local_directory_scan_and_ignores():
    # Setup a mock folder structure
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create some files in root
        with open(os.path.join(temp_dir, "README.md"), "w") as f:
            f.write("# Sample Repo\n")
        with open(os.path.join(temp_dir, "requirements.txt"), "w") as f:
            f.write("fastapi\n")
            
        # Create source
        os.makedirs(os.path.join(temp_dir, "src"))
        with open(os.path.join(temp_dir, "src", "main.py"), "w") as f:
            f.write("print('Hello')\n")
            
        # Create tests
        os.makedirs(os.path.join(temp_dir, "tests"))
        with open(os.path.join(temp_dir, "tests", "test_main.py"), "w") as f:
            f.write("def test_hello(): pass\n")

        # Create ignored folder
        os.makedirs(os.path.join(temp_dir, "node_modules"))
        with open(os.path.join(temp_dir, "node_modules", "package.json"), "w") as f:
            f.write("{}\n")
            
        # Run scan
        data = scan_directory(temp_dir)
        
        # Verify totals and classifications (ignoring node_modules recursively)
        assert data["total_files"] == 4  # README.md, requirements.txt, src/main.py, tests/test_main.py
        assert len(data["documentation_files"]) == 1
        assert data["documentation_files"][0].path == "README.md"
        assert len(data["configuration_files"]) == 1
        assert data["configuration_files"][0].path == "requirements.txt"
        assert len(data["source_files"]) == 1
        assert data["source_files"][0].path == "src/main.py"
        assert len(data["test_files"]) == 1
        assert data["test_files"][0].path == "tests/test_main.py"


def test_git_repository_clone_and_metadata():
    # Setup a temporary git repository locally
    with tempfile.TemporaryDirectory() as repo_dir:
        # Initialize Git
        subprocess.run(["git", "init"], cwd=repo_dir, check=True, capture_output=True)
        
        # Configure dummy Git user
        subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=repo_dir, check=True)
        subprocess.run(["git", "config", "user.name", "Test User"], cwd=repo_dir, check=True)
        
        # Create initial commit
        with open(os.path.join(repo_dir, "README.md"), "w") as f:
            f.write("# Dummy Git Repo\n")
        subprocess.run(["git", "add", "README.md"], cwd=repo_dir, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "initial commit"], cwd=repo_dir, check=True, capture_output=True)
        
        # Capture commit SHA
        sha_res = subprocess.run(["git", "rev-parse", "HEAD"], cwd=repo_dir, check=True, capture_output=True, text=True)
        expected_sha = sha_res.stdout.strip()
        
        # Perform scan using perform_scan
        result = perform_scan(repo_dir)
        
        assert result.repository_name == os.path.basename(repo_dir)
        assert result.commit_sha == expected_sha
        assert len(result.documentation_files) == 1
        assert result.documentation_files[0].path == "README.md"
        assert result.total_files == 1
