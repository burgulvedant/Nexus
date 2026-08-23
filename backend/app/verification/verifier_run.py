import sys
import os
import uuid
from collections import defaultdict
from backend.app.repositories.scanner import perform_scan
from backend.app.claims.extractor import extract_claims_from_file
from backend.app.evidence.engine import EvidenceEngine
from backend.app.verification.verifier import verify_claim_against_evidence, calculate_truth_score

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

        # 3. Instantiate Evidence Engine & Verifier
        engine = EvidenceEngine(target_path)
        
        verdicts = []
        claim_verdict_map = {}

        # 4. Gather evidence and verify each claim
        for idx, c in enumerate(all_claims):
            ev_list = engine.gather_evidence_for_claim(c.category, c.description, c.original_text)
            res = verify_claim_against_evidence(c.category, c.description, c.original_text, ev_list)
            verdicts.append(res)
            claim_verdict_map[idx] = (c, ev_list, res)

        # 5. Compute counts and score
        status_counts = defaultdict(int)
        for r in verdicts:
            status_counts[r.status] += 1

        truth_score = calculate_truth_score(verdicts)

        print("==================================================")
        print("DOCUMENTATION TRUTH REPORT")
        print("==================================================")
        print(f"Repository:               LifeCost Project")
        print(f"Commit SHA:               {scan_result.commit_sha}")
        print(f"Claims analyzed:          {len(all_claims)}")
        print(f"Truth Score:              {truth_score} / 100")
        print()
        print("Verdict Distribution:")
        print(f"  VERIFIED:               {status_counts['VERIFIED']}")
        print(f"  UNCERTAIN:              {status_counts['UNCERTAIN']}")
        print(f"  CONTRADICTED:           {status_counts['CONTRADICTED']}")
        print("==================================================\n")

        print("--- Representative Sample of Verification Findings (10 Claims) ---")
        
        # Select 10 representative claims spanning different categories
        sample_indices = []
        indices_by_cat = defaultdict(list)
        for idx, c in enumerate(all_claims):
            indices_by_cat[c.category].append(idx)
            
        # Ensure representation: databases, APIs, commands, limits, etc.
        for cat in sorted(indices_by_cat.keys()):
            for idx in indices_by_cat[cat]:
                if len(sample_indices) < 10:
                    sample_indices.append(idx)
                else:
                    break

        for list_idx, idx in enumerate(sample_indices):
            c, evs, res = claim_verdict_map[idx]
            print(f"\n[{list_idx+1}] CLAIM:")
            print(f"    Category:        {c.category}")
            print(f"    Description:     \"{c.description}\"")
            print(f"    Doc Location:    {c.source_file}:{c.line_number}")
            print(f"    VERDICT:         {res.status}")
            print(f"    Truth Confidence: {res.confidence:.2f}")
            print(f"    Explanation:     {res.explanation}")
            print(f"    Evidence Classified ({len(evs)} items):")
            
            if not evs:
                print("      - [No evidence discovered]")
            
            for e_idx, e in enumerate(evs):
                rel_type = "SUPPORTS"
                if e.id in res.contradicting_evidence_ids:
                    rel_type = "CONTRADICTS"
                elif e.id in res.contextual_evidence_ids:
                    rel_type = "CONTEXTUAL"
                print(f"      ({e_idx+1}) [{e.source_type}] {e.file_path}:{e.line_number or 'N/A'} ({rel_type})")
                if e.content:
                    preview = e.content.replace('\n', ' ')
                    if len(preview) > 100:
                        preview = preview[:97] + "..."
                    print(f"          Preview: \"{preview}\"")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
