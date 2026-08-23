import sys
import os
from collections import defaultdict
from backend.app.repositories.scanner import perform_scan
from backend.app.claims.extractor import extract_claims_from_file

def main():
    target_path = "/Users/vedantburgul/Desktop/LifeCost Project"
    print(f"Acquiring repository documentation files from: {target_path} ...\n")
    try:
        # Run scan first to find documentation files
        scan_result = perform_scan(target_path)
        doc_files = scan_result.documentation_files
        print(f"Repository:               {scan_result.repository_name}")
        print(f"Commit SHA:               {scan_result.commit_sha}")
        print(f"Documentation files:      {len(doc_files)}")
        for doc in doc_files:
            print(f"  - {doc.path} ({doc.line_count} lines)")
        print()

        # Extract claims from all doc files
        all_claims = []
        for doc in doc_files:
            full_path = os.path.join(target_path, doc.path)
            claims = extract_claims_from_file(full_path, doc.path)
            all_claims.extend(claims)

        print("==================================================")
        print("DOCUMENTATION CLAIM EXTRACTION SUMMARY")
        print("==================================================")
        print(f"Total claims extracted:   {len(all_claims)}")
        
        # Category breakdown
        breakdown = defaultdict(int)
        for c in all_claims:
            breakdown[c.category] += 1
            
        print("\nBreakdown by category:")
        for cat, count in sorted(breakdown.items()):
            print(f"  {cat:<20} {count}")
        print("==================================================\n")

        print("--- Representative Sample of Extracted Claims ---")
        # Group claims to print representative examples
        sample_cats = defaultdict(list)
        for c in all_claims:
            if len(sample_cats[c.category]) < 2:
                sample_cats[c.category].append(c)

        for cat, items in sorted(sample_cats.items()):
            print(f"\nCategory: {cat}")
            for idx, c in enumerate(items):
                print(f"  {idx+1}. [{c.source_file}:{c.line_number}] (Conf: {c.confidence:.2f})")
                print(f"     Claim:    \"{c.description}\"")
                print(f"     Original: \"{c.original_text.strip()}\"")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
