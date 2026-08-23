import { useEffect, useState } from 'react';
import {
  api,
  type RepositorySummary,
  type AnalysisDetail,
  type NexusReportData,
  type Finding,
} from '../../api/nexusApi';

interface EvidenceExplorerProps {
  repositories: RepositorySummary[];
  currentAnalysis: AnalysisDetail | null;
  onSelectAnalysis: (analysisId: string, repositoryId: string) => void;
  onNewAnalysis: () => void;
}

export default function EvidenceExplorer({
  repositories,
  currentAnalysis,
  onSelectAnalysis,
  onNewAnalysis,
}: EvidenceExplorerProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    currentAnalysis?.repository_id || (repositories.length > 0 ? repositories[0].id : '')
  );
  const [analyses, setAnalyses] = useState<AnalysisDetail[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(
    currentAnalysis?.id || ''
  );
  const [reportData, setReportData] = useState<NexusReportData | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Finding | null>(null);
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'VERIFIED' | 'UNCERTAIN' | 'CONTRADICTED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync with prop changes if repository/analysis updates from header
  useEffect(() => {
    if (currentAnalysis?.repository_id) {
      setSelectedRepoId(currentAnalysis.repository_id);
    }
    if (currentAnalysis?.id) {
      setSelectedAnalysisId(currentAnalysis.id);
    }
  }, [currentAnalysis]);

  // Load analyses whenever selectedRepoId changes
  useEffect(() => {
    if (!selectedRepoId) return;

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const repoAnalyses = await api.listRepositoryAnalyses(selectedRepoId);
        if (isMounted) {
          setAnalyses(repoAnalyses);
          if (repoAnalyses.length > 0) {
            // Select current analysis if it belongs to this repo, else pick newest
            const active = repoAnalyses.find((a) => a.id === selectedAnalysisId) || repoAnalyses[0];
            setSelectedAnalysisId(active.id);
          } else {
            setSelectedAnalysisId('');
            setReportData(null);
            setSelectedClaim(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching repository analyses:', err);
          setError(err.message || 'Failed to load analyses for repository.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedRepoId]);

  // Load JSON report whenever selectedAnalysisId changes
  useEffect(() => {
    if (!selectedAnalysisId) {
      setReportData(null);
      setSelectedClaim(null);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const rep = await api.getJsonReport(selectedAnalysisId);
        if (isMounted) {
          setReportData(rep);
          // Pick first claim by default
          const allClaims = [
            ...(rep.findings?.verified || []),
            ...(rep.findings?.uncertain || []),
            ...(rep.findings?.contradicted || []),
          ];
          setSelectedClaim(allClaims.length > 0 ? allClaims[0] : null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error loading report for evidence explorer:', err);
          setError(err.message || 'Failed to fetch report data.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedAnalysisId]);

  // Handle repository selection change from dropdown
  const handleRepoChange = (newRepoId: string) => {
    setSelectedRepoId(newRepoId);
  };

  // Handle analysis selection change from dropdown
  const handleAnalysisChange = (newAnalysisId: string) => {
    setSelectedAnalysisId(newAnalysisId);
    onSelectAnalysis(newAnalysisId, selectedRepoId);
  };

  // Compile and filter claims
  const verifiedClaims = reportData?.findings?.verified || [];
  const uncertainClaims = reportData?.findings?.uncertain || [];
  const contradictedClaims = reportData?.findings?.contradicted || [];
  const allClaims = [...verifiedClaims, ...uncertainClaims, ...contradictedClaims];

  const filteredClaims = allClaims.filter((c) => {
    if (filterVerdict === 'ALL') return true;
    return c.verdict === filterVerdict;
  });

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full max-w-none space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4 sm:pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Evidence Explorer
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Inspect the evidence behind Nexus verification findings.
          </p>
        </div>

        {/* Repository & Analysis Selector */}
        {repositories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Repository Select */}
            <div className="relative">
              <select
                value={selectedRepoId}
                onChange={(e) => handleRepoChange(e.target.value)}
                aria-label="Select Repository"
                className="bg-white border border-border/80 text-text-primary rounded-xl px-3 py-2 text-xs font-bold shadow-2xs focus:outline-none focus:ring-1 focus:ring-nexus-500 cursor-pointer pr-8 appearance-none"
              >
                {repositories.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-text-muted">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Analysis Select */}
            {analyses.length > 0 && (
              <div className="relative">
                <select
                  value={selectedAnalysisId}
                  onChange={(e) => handleAnalysisChange(e.target.value)}
                  aria-label="Select Analysis Run"
                  className="bg-white border border-border/80 text-text-primary rounded-xl px-3 py-2 text-xs font-bold shadow-2xs focus:outline-none focus:ring-1 focus:ring-nexus-500 cursor-pointer pr-8 appearance-none font-mono"
                >
                  {analyses.map((a) => (
                    <option key={a.id} value={a.id}>
                      #{a.id.substring(0, 6)} ({a.truth_score}/100) - {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-text-muted">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zero Repository State */}
      {repositories.length === 0 && !loading && (
        <div className="bg-white border border-border/80 rounded-2xl p-10 sm:p-14 text-center shadow-2xs space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-nexus-50 text-nexus-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">No repositories connected yet</h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed max-w-md mx-auto">
              Connect a repository and run verification to explore code evidence supporting or contradicting documentation.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onNewAnalysis}
              className="inline-flex items-center space-x-2 bg-nexus-600 hover:bg-nexus-700 text-white rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Analysis</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-pulse">
          <div className="lg:col-span-5 bg-white border border-border/80 rounded-2xl p-5 h-96 space-y-3">
            <div className="h-5 bg-slate-100 rounded w-1/3"></div>
            <div className="h-20 bg-slate-50 rounded-xl"></div>
            <div className="h-20 bg-slate-50 rounded-xl"></div>
          </div>
          <div className="lg:col-span-7 bg-white border border-border/80 rounded-2xl p-5 h-96 space-y-3">
            <div className="h-5 bg-slate-100 rounded w-1/4"></div>
            <div className="h-32 bg-slate-50 rounded-xl"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
          <h3 className="text-base font-bold text-red-800">Unable to load evidence data</h3>
          <p className="text-xs sm:text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Main Evidence Exploration Split View */}
      {!loading && !error && repositories.length > 0 && (
        <>
          {allClaims.length === 0 ? (
            /* Zero Claim State */
            <div className="bg-white border border-border/80 rounded-2xl p-10 text-center shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-text-muted flex items-center justify-center mx-auto">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-text-primary">No claims found for this analysis</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                This repository has no documentation files or technical claims extracted during scanning.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Claims List with Filter Tabs (5 Cols) */}
              <div className="lg:col-span-5 bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                {/* Filter Tabs */}
                <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-bold">
                  {(['ALL', 'VERIFIED', 'UNCERTAIN', 'CONTRADICTED'] as const).map((v) => {
                    const active = filterVerdict === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setFilterVerdict(v)}
                        className={`flex-1 py-1.5 px-2 rounded-lg transition cursor-pointer text-center truncate ${
                          active
                            ? 'bg-white text-text-primary shadow-2xs'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {v === 'ALL' ? 'All' : v.charAt(0) + v.slice(1).toLowerCase()}
                      </button>
                    );
                  })}
                </div>

                {/* Claims Scroll List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {filteredClaims.map((c) => {
                    const isSelected = selectedClaim?.claim_id === c.claim_id;
                    const verdictClass =
                      c.verdict === 'VERIFIED'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : c.verdict === 'CONTRADICTED'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <div
                        key={c.claim_id}
                        onClick={() => setSelectedClaim(c)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                          isSelected
                            ? 'bg-nexus-50/70 border-nexus-300 shadow-2xs'
                            : 'bg-white border-border/70 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-text-primary line-clamp-1">
                            {c.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold uppercase border ${verdictClass} shrink-0`}>
                            {c.verdict}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-mono">
                          "{c.original_text}"
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/40 font-mono">
                          <span className="truncate max-w-[200px]">{c.source_file}:{c.line_number || 1}</span>
                          <span>{c.evidence?.length || 0} evidence</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Evidence Inspector (7 Cols) */}
              <div className="lg:col-span-7 bg-white border border-border/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
                {selectedClaim ? (
                  <>
                    {/* Selected Claim Overview */}
                    <div className="space-y-3 border-b border-border/60 pb-5">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${
                          selectedClaim.verdict === 'VERIFIED'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : selectedClaim.verdict === 'CONTRADICTED'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {selectedClaim.verdict} &bull; {(selectedClaim.truth_confidence * 100).toFixed(0)}% Confidence
                        </span>
                        <span className="text-xs font-mono text-text-muted bg-slate-100 px-2 py-0.5 rounded">
                          {selectedClaim.category}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-text-primary">
                        {selectedClaim.title}
                      </h3>

                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1">
                        <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">DOCUMENTATION ASSERTION</span>
                        <p className="text-xs font-mono text-text-primary leading-relaxed">
                          "{selectedClaim.original_text}"
                        </p>
                        <span className="text-[11px] text-text-muted block pt-1">
                          Source: <strong className="font-mono text-text-secondary">{selectedClaim.source_file}:{selectedClaim.line_number || 1}</strong>
                        </span>
                      </div>

                      {/* Explanation */}
                      <div className="text-xs text-text-secondary leading-relaxed bg-nexus-50/50 border border-nexus-100 rounded-xl p-3">
                        <strong className="text-nexus-900 block mb-1">Nexus Verdict Rationale:</strong>
                        {selectedClaim.explanation}
                      </div>
                    </div>

                    {/* Evidence List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                          Collected Evidence ({selectedClaim.evidence?.length || 0})
                        </h4>
                      </div>

                      {(!selectedClaim.evidence || selectedClaim.evidence.length === 0) ? (
                        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-6 text-center space-y-1">
                          <p className="text-xs text-text-muted font-medium">No evidence records available for this claim.</p>
                          {selectedClaim.missing_evidence_types && selectedClaim.missing_evidence_types.length > 0 && (
                            <p className="text-[11px] text-amber-700">
                              Missing expected evidence: {selectedClaim.missing_evidence_types.join(', ')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedClaim.evidence.map((ev, idx) => {
                            const isSupporting = ev.relationship === 'SUPPORTS';
                            const isContradicting = ev.relationship === 'CONTRADICTS';

                            const borderBadge = isSupporting
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : isContradicting
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-slate-200 bg-slate-50 text-slate-700';

                            return (
                              <div
                                key={ev.id || idx}
                                className="border border-border/80 rounded-xl p-4 space-y-2.5 bg-slate-50/30"
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${borderBadge}`}>
                                    {ev.relationship}
                                  </span>
                                  <span className="text-[11px] font-mono text-text-muted">
                                    {ev.source_type} &bull; {ev.discovery_method}
                                  </span>
                                </div>

                                <p className="text-xs text-text-primary leading-relaxed">
                                  {ev.explanation}
                                </p>

                                {ev.content && (
                                  <pre className="p-2.5 bg-slate-900 text-slate-100 rounded-lg text-[11.5px] font-mono overflow-x-auto">
                                    <code>{ev.content}</code>
                                  </pre>
                                )}

                                <div className="text-[11px] text-text-muted font-mono flex items-center justify-between pt-1 border-t border-border/40">
                                  <span>{ev.file_path}{ev.line_number ? `:${ev.line_number}` : ''}</span>
                                  <span>Confidence: {(ev.confidence * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-text-muted text-xs">
                    Select a claim on the left to inspect its evidence.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
