import sys
import os
from collections import defaultdict
from backend.app.repositories.scanner import perform_scan
from backend.app.claims.extractor import extract_claims_from_file
from backend.app.evidence.engine import EvidenceEngine

def main():
    target_path = "/Users/vedantburgul/Desktop/LifeCost Project"
    print(f"Loading repository from: {target_path} ...\n")
    try:
        # 1. Scan repo to find documentation files
        scan_result = perform_scan(target_path)
        doc_files = scan_result.documentation_files
        
        # 2. Extract claims
        all_claims = []
        for doc in doc_files:
            full_path = os.path.join(target_path, doc.path)
            claims = extract_claims_from_file(full_path, doc.path)
            all_claims.extend(claims)

        # 3. Instantiate Evidence Engine
        engine = EvidenceEngine(target_path)
        
        # 4. Gather evidence for each claim
        claim_evidence_map = {}
        total_evidence_records = 0
        claims_with_evidence = 0
        claims_with_no_evidence = 0
        
        source_counts = defaultdict(int)

        for idx, c in enumerate(all_claims):
            ev_list = engine.gather_evidence_for_claim(c.category, c.description, c.original_text)
            claim_evidence_map[idx] = (c, ev_list)
            
            if ev_list:
                claims_with_evidence += 1
                total_evidence_records += len(ev_list)
                for ev in ev_list:
                    source_counts[ev.source_type] += 1
            else:
                claims_with_no_evidence += 1

        print("==================================================")
        print("EVIDENCE GATHERING SUMMARY: GRADSCOPE BENCHMARK")
        print("==================================================")
        print(f"Total claims:             {len(all_claims)}")
        print(f"Claims with evidence:     {claims_with_evidence}")
        print(f"Claims with no evidence:  {claims_with_no_evidence}")
        print(f"Total evidence records:   {total_evidence_records}")
        print()
        print("Evidence by source:")
        print(f"  SOURCE_CODE:            {source_counts['SOURCE_CODE']}")
        print(f"  CONFIGURATION:          {source_counts['CONFIGURATION']}")
        print(f"  DEPENDENCY:             {source_counts['DEPENDENCY']}")
        print(f"  API_SPECIFICATION:      {source_counts['API_SPECIFICATION']}")
        print(f"  TEST:                   {source_counts['TEST']}")
        print(f"  DOCUMENTATION:          {source_counts['DOCUMENTATION']}")
        print("==================================================\n")

        print("--- Representative Sample of 10 Claims and Gathered Evidence ---")
        
        # Select 10 representative claims spanning different categories
        sample_indices = []
        # Group indices by category to ensure good distribution
        indices_by_cat = defaultdict(list)
        for idx, c in enumerate(all_claims):
            indices_by_cat[c.category].append(idx)
            
        for cat in sorted(indices_by_cat.keys()):
            for idx in indices_by_cat[cat]:
                if len(sample_indices) < 10:
                    sample_indices.append(idx)
                else:
                    break

        for list_idx, idx in enumerate(sample_indices):
            c, evs = claim_evidence_map[idx]
            print(f"\n[{list_idx+1}] CLAIM:")
            print(f"    Category:      {c.category}")
            print(f"    Description:   \"{c.description}\"")
            print(f"    Source Location: {c.source_file}:{c.line_number}")
            
            if not evs:
                print("    EVIDENCE FOUND: [None]")
            else:
                print(f"    EVIDENCE FOUND ({len(evs)} records):")
                for e_idx, e in enumerate(evs):
                    print(f"      ({e_idx+1}) Source Type:      {e.source_type}")
                    print(f"          File & Line:      {e.file_path}:{e.line_number or 'N/A'}")
                    print(f"          Discovery Method: {e.discovery_method}")
                    print(f"          Evidence Conf:    {e.confidence:.2f}")
                    content_indented = "\n          ".join(e.content.splitlines()) if e.content else "[No content preview]"
                    print(f"          Content Preview:\n          {content_indented}")
                    print(f"          Explanation:      {e.explanation}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
