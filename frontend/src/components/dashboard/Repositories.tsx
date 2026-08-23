import { useEffect, useState, useCallback } from 'react';
import { api, type RepositorySummary, type AnalysisDetail } from '../../api/nexusApi';

interface RepositoriesProps {
  onNewAnalysis: () => void;
  onSelectAnalysis: (analysisId: string) => void;
  onViewReport: (analysisId: string) => void;
}

interface RepositoryItemWithAnalysis extends RepositorySummary {
  latestAnalysis?: AnalysisDetail | null;
  loadingAnalysis?: boolean;
}

export default function Repositories({
  onNewAnalysis,
  onSelectAnalysis,
  onViewReport,
}: RepositoriesProps) {
  const [repositories, setRepositories] = useState<RepositoryItemWithAnalysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositoriesAndAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch repositories from backend
      const repoList = await api.listRepositories();

      // 2. Fetch latest analysis for each repository in parallel
      const enrichedRepos: RepositoryItemWithAnalysis[] = await Promise.all(
        repoList.map(async (repo) => {
          try {
            const analyses = await api.listRepositoryAnalyses(repo.id);
            const latest = analyses && analyses.length > 0 ? analyses[0] : null;
            return {
              ...repo,
              latestAnalysis: latest,
            };
          } catch {
            return {
              ...repo,
              latestAnalysis: null,
            };
          }
        })
      );

      setRepositories(enrichedRepos);
    } catch (err: any) {
      console.error('Failed to fetch repositories:', err);
      setError(err.message || 'Something went wrong while fetching your repositories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepositoriesAndAnalyses();
  }, [fetchRepositoriesAndAnalyses]);

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full max-w-none space-y-6">
      {/* Header Area */}
      <div className="border-b border-border/60 pb-4 sm:pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Repositories
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Repositories connected to Nexus and their latest verification status.
        </p>
      </div>

      {/* 1. Loading Skeleton State */}
      {loading && (
        <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-2xs space-y-4 animate-pulse">
          <div className="h-5 bg-slate-100 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-red-800">Unable to load repositories</h3>
            <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchRepositoriesAndAnalyses}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && repositories.length === 0 && (
        <div className="bg-white border border-border/80 rounded-2xl p-10 sm:p-14 text-center shadow-2xs space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-nexus-50 text-nexus-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">No repositories yet</h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed max-w-md mx-auto">
              Connect a repository to start verifying what your documentation says against what your software actually does.
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
              <span>Start New Analysis</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Repository List Table */}
      {!loading && !error && repositories.length > 0 && (
        <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[620px]">
              <thead>
                <tr className="text-xs font-bold text-text-muted uppercase border-b border-border/60 pb-2.5 tracking-wider">
                  <th className="py-2.5 font-bold">REPOSITORY</th>
                  <th className="py-2.5 text-center font-bold">TRUTH SCORE</th>
                  <th className="py-2.5 text-center font-bold">CLAIMS</th>
                  <th className="py-2.5 font-bold">LAST ANALYZED</th>
                  <th className="py-2.5 font-bold">STATUS</th>
                  <th className="py-2.5 text-right font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {repositories.map((repo) => {
                  const analysis = repo.latestAnalysis;
                  const hasAnalysis = !!analysis;

                  const status = analysis?.status || 'PENDING';
                  const truthScore = analysis?.truth_score !== undefined ? `${analysis.truth_score}/100` : '&mdash;';
                  const totalClaims = analysis?.total_claims !== undefined ? analysis.total_claims : '&mdash;';
                  
                  const dateStr = analysis?.completed_at
                    ? new Date(analysis.completed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : analysis?.created_at
                    ? 'In progress'
                    : 'Not analyzed';

                  const badgeClass =
                    status === 'COMPLETED'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : status === 'RUNNING' || status === 'QUEUED'
                      ? 'bg-nexus-50 text-nexus-700 border-nexus-200'
                      : status === 'FAILED'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-50 text-text-muted border-slate-200';

                  return (
                    <tr
                      key={repo.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => {
                        if (analysis) {
                          onSelectAnalysis(analysis.id);
                        }
                      }}
                    >
                      <td className="py-3.5 pr-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[14.5px] font-bold text-text-primary hover:text-nexus-600 transition truncate">
                              {repo.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-0.5 text-xs text-text-muted">
                              <span className="font-mono bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                                {repo.default_branch || 'main'}
                              </span>
                              <span className="truncate max-w-[200px] text-text-secondary">
                                {repo.clone_url}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        {analysis?.truth_score !== undefined ? (
                          <span className="font-bold text-nexus-600 text-sm sm:text-base">
                            {truthScore}
                          </span>
                        ) : (
                          <span className="text-text-muted">&mdash;</span>
                        )}
                      </td>

                      <td className="py-3.5 px-2 text-center text-text-secondary text-xs sm:text-sm">
                        {totalClaims}
                      </td>

                      <td className="py-3.5 px-2 text-text-muted text-xs sm:text-sm whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass} whitespace-nowrap`}>
                          {status === 'COMPLETED'
                            ? 'Completed'
                            : status === 'RUNNING'
                            ? 'Analyzing...'
                            : status === 'QUEUED'
                            ? 'Queued'
                            : status === 'FAILED'
                            ? 'Failed'
                            : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 pl-2 text-right whitespace-nowrap">
                        {hasAnalysis ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewReport(analysis.id);
                            }}
                            className="text-xs sm:text-sm font-semibold text-nexus-600 hover:text-nexus-700 hover:underline transition cursor-pointer"
                          >
                            View Report &rarr;
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNewAnalysis();
                            }}
                            className="text-xs sm:text-sm font-semibold text-nexus-600 hover:text-nexus-700 hover:underline transition cursor-pointer"
                          >
                            Analyze &rarr;
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
