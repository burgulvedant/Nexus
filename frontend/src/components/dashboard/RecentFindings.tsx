import { useState } from 'react';
import type { Finding } from '../../api/nexusApi';

interface RecentFindingsProps {
  findingsVerified: Finding[];
  findingsUncertain: Finding[];
  findingsContradicted: Finding[];
  loading?: boolean;
  onViewAll?: () => void;
}

export default function RecentFindings({
  findingsVerified,
  findingsUncertain,
  findingsContradicted,
  loading = false,
  onViewAll,
}: RecentFindingsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'uncertain' | 'contradicted'>('all');

  const allFindings = [...findingsVerified, ...findingsUncertain, ...findingsContradicted];

  let displayFindings: Finding[] = [];
  if (activeTab === 'all') {
    displayFindings = allFindings;
  } else if (activeTab === 'verified') {
    displayFindings = findingsVerified;
  } else if (activeTab === 'uncertain') {
    displayFindings = findingsUncertain;
  } else {
    displayFindings = findingsContradicted;
  }

  // Display top 3 in recent dashboard preview for clean visual fit
  const topFindings = displayFindings.slice(0, 3);

  return (
    <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-text-primary">Recent Findings</h3>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-2 border-b border-border/60 pb-2 mb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-nexus-50 text-nexus-700 shadow-3xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All Findings ({loading ? '...' : allFindings.length})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'verified'
                ? 'bg-green-50 text-green-700 shadow-3xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Verified ({loading ? '...' : findingsVerified.length})
          </button>
          <button
            onClick={() => setActiveTab('uncertain')}
            className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'uncertain'
                ? 'bg-amber-50 text-amber-700 shadow-3xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Uncertain ({loading ? '...' : findingsUncertain.length})
          </button>
          <button
            onClick={() => setActiveTab('contradicted')}
            className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'contradicted'
                ? 'bg-red-50 text-red-700 shadow-3xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Contradicted ({loading ? '...' : findingsContradicted.length})
          </button>
        </div>

        {/* Findings List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="space-y-3 py-2 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="h-4 bg-slate-200/70 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200/50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : topFindings.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted">
              No findings in this category.
            </div>
          ) : (
            topFindings.map((f, idx) => {
              const dotColor =
                f.verdict === 'VERIFIED'
                  ? 'text-green-500'
                  : f.verdict === 'CONTRADICTED'
                  ? 'text-red-500'
                  : 'text-amber-500';

              const firstEvidenceLocation =
                f.evidence && f.evidence.length > 0
                  ? `${f.evidence[0].file_path}${f.evidence[0].line_number ? `:${f.evidence[0].line_number}` : ''}`
                  : `${f.source_file}${f.line_number ? `:${f.line_number}` : ''}`;

              return (
                <div
                  key={f.claim_id || idx}
                  className="p-3 sm:p-3.5 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-200/60 transition w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 w-full">
                    {/* Left block: Status dot + Claim text (full width on mobile) */}
                    <div className="flex items-start space-x-2.5 sm:space-x-3 flex-1 min-w-0">
                      <span className={`${dotColor} text-xl leading-none font-black shrink-0 mt-0.5`}>&bull;</span>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm sm:text-[15px] font-semibold text-text-primary leading-snug break-words">
                          &ldquo;{f.description || f.original_text}&rdquo;
                        </p>
                        
                        {/* Mobile Metadata (Visible on < sm screens) */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 sm:hidden text-xs text-text-muted">
                          <span>
                            Confidence <strong className="text-text-secondary font-bold">{f.truth_confidence.toFixed(2)}</strong>
                          </span>
                          <span>
                            Evidence <strong className="text-text-secondary font-bold">{f.evidence?.length || 0}</strong>
                          </span>
                        </div>

                        {/* Source Location */}
                        <span className="text-xs sm:text-[13px] font-mono text-text-muted block break-all">
                          {firstEvidenceLocation}
                        </span>
                      </div>
                    </div>

                    {/* Right block: Desktop Metadata (Visible on sm: and above) */}
                    <div className="hidden sm:flex items-center space-x-3.5 shrink-0 text-right pt-0.5">
                      <div className="text-[13px] text-text-muted font-medium">
                        Confidence <strong className="text-text-secondary font-bold">{f.truth_confidence.toFixed(2)}</strong>
                      </div>
                      <div className="text-[13px] text-text-muted font-medium">
                        Evidence <strong className="text-text-secondary font-bold">{f.evidence?.length || 0}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="border-t border-border/60 pt-3 mt-3 text-center">
        <button
          onClick={onViewAll}
          disabled={allFindings.length === 0}
          className="text-sm font-semibold text-nexus-600 hover:text-nexus-700 disabled:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          View All {allFindings.length} Findings &rarr;
        </button>
      </div>
    </div>
  );
}
