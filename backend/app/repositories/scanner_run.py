import sys
from backend.app.repositories.scanner import perform_scan

def main():
    target_path = "/Users/vedantburgul/Desktop/LifeCost Project"
    print(f"Scanning target repository path: {target_path} ...\n")
    try:
        result = perform_scan(target_path)
        print("==================================================")
        print("REPOSITORY SCAN SUMMARY")
        print("==================================================")
        print(f"Repository:               {result.repository_name}")
        print(f"Commit SHA:               {result.commit_sha}")
        print(f"Default Branch:           {result.default_branch}")
        print(f"Total Files:              {result.total_files}")
        print(f"Documentation:            {len(result.documentation_files)}")
        print(f"Source Code:              {len(result.source_files)}")
        print(f"Tests:                    {len(result.test_files)}")
        print(f"Configuration:            {len(result.configuration_files)}")
        print(f"API Specifications:       {len(result.api_specification_files)}")
        print(f"Ignored:                  {len(result.ignored_files)}")
        print(f"Other:                    {len(result.other_files)}")
        print("==================================================\n")

        def print_examples(title, files):
            print(f"--- {title} (showing up to 5 examples) ---")
            if not files:
                print("  No files detected.")
            for f in files[:5]:
                line_info = f" ({f.line_count} lines)" if f.line_count is not None else ""
                print(f"  - {f.path} [{f.size} bytes]{line_info}")
            print()

        print_examples("Documentation", result.documentation_files)
        print_examples("Source", result.source_files)
        print_examples("Tests", result.test_files)
        print_examples("Configuration", result.configuration_files)
        print_examples("API Specifications", result.api_specification_files)

    except Exception as e:
        print(f"Error during scan: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
