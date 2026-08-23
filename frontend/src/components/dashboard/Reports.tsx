import { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/nexusApi';

interface ReportsProps {
  onViewReport: (analysisId: string, repoName: string) => void;
  onNewAnalysis: () => void;
}

interface ReportListItem {
  analysisId: string;
  repositoryId: string;
  repositoryName: string;
  defaultBranch: string;
  cloneUrl: string;
  truthScore: number;
  totalClaims: number;
  verifiedCount: number;
  uncertainCount: number;
  contradictedCount: number;
  status: string;
  completedAt?: string | null;
  createdAt: string;
}

export default function Reports({ onViewReport, onNewAnalysis }: ReportsProps) {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const repos = await api.listRepositories();
      const allReports: ReportListItem[] = [];

      await Promise.all(
        repos.map(async (repo) => {
          try {
            const analyses = await api.listRepositoryAnalyses(repo.id);
            for (const a of analyses) {
              allReports.push({
                analysisId: a.id,
                repositoryId: repo.id,
                repositoryName: repo.name,
                defaultBranch: repo.default_branch || 'main',
                cloneUrl: repo.clone_url,
                truthScore: a.truth_score,
                totalClaims: a.total_claims,
                verifiedCount: a.verified_count,
                uncertainCount: a.uncertain_count,
                contradictedCount: a.contradicted_count,
                status: a.status,
                completedAt: a.completed_at,
                createdAt: a.created_at,
              });
            }
          } catch (err) {
            console.error(`Error loading analyses for ${repo.name}:`, err);
          }
        })
      );

      // Sort by creation date descending
      allReports.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setReports(allReports);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to load analysis reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full max-w-none space-y-6">
      {/* Header Area */}
      <div className="border-b border-border/60 pb-4 sm:pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Reports
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Truth reports generated from your repository analyses.
        </p>
      </div>

      {/* Loading Skeleton */}
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

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-red-800">Unable to load reports</h3>
            <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchReports}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-700 border border-red-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reports.length === 0 && (
        <div className="bg-white border border-border/80 rounded-2xl p-10 sm:p-14 text-center shadow-2xs space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-nexus-50 text-nexus-600 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">No reports available yet</h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed max-w-md mx-auto">
              Run an analysis on any connected repository to generate a full Markdown and JSON Truth Report.
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

      {/* Reports Table */}
      {!loading && !error && reports.length > 0 && (
        <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[640px]">
              <thead>
                <tr className="text-xs font-bold text-text-muted uppercase border-b border-border/60 pb-2.5 tracking-wider">
                  <th className="py-2.5 font-bold">REPOSITORY</th>
                  <th className="py-2.5 text-center font-bold">TRUTH SCORE</th>
                  <th className="py-2.5 text-center font-bold">CLAIMS</th>
                  <th className="py-2.5 font-bold">DATE</th>
                  <th className="py-2.5 font-bold">STATUS</th>
                  <th className="py-2.5 text-right font-bold">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-[13.5px]">
                {reports.map((rep) => {
                  const dateStr = rep.completedAt
                    ? new Date(rep.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : new Date(rep.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });

                  const badgeClass =
                    rep.status === 'COMPLETED'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : rep.status === 'RUNNING' || rep.status === 'QUEUED'
                      ? 'bg-nexus-50 text-nexus-700 border-nexus-200'
                      : rep.status === 'FAILED'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-slate-50 text-text-muted border-slate-200';

                  return (
                    <tr
                      key={rep.analysisId}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => onViewReport(rep.analysisId, rep.repositoryName)}
                    >
                      <td className="py-3.5 pr-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[14.5px] font-bold text-text-primary hover:text-nexus-600 transition truncate">
                              {rep.repositoryName}
                            </h4>
                            <div className="flex items-center space-x-2 mt-0.5 text-xs text-text-muted">
                              <span className="font-mono bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                                {rep.defaultBranch}
                              </span>
                              <span className="font-mono text-text-secondary">
                                #{rep.analysisId.substring(0, 6)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        <span className="font-bold text-nexus-600 text-sm sm:text-base">
                          {rep.truthScore}/100
                        </span>
                      </td>

                      <td className="py-3.5 px-2 text-center text-text-secondary text-xs sm:text-sm">
                        {rep.totalClaims}
                      </td>

                      <td className="py-3.5 px-2 text-text-muted text-xs sm:text-sm whitespace-nowrap">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass} whitespace-nowrap`}>
                          {rep.status === 'COMPLETED'
                            ? 'Completed'
                            : rep.status === 'RUNNING'
                            ? 'Analyzing...'
                            : rep.status === 'QUEUED'
                            ? 'Queued'
                            : rep.status === 'FAILED'
                            ? 'Failed'
                            : 'Pending'}
                        </span>
                      </td>

                      <td className="py-3.5 pl-2 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewReport(rep.analysisId, rep.repositoryName);
                          }}
                          className="text-xs sm:text-sm font-semibold text-nexus-600 hover:text-nexus-700 hover:underline transition cursor-pointer"
                        >
                          View Report &rarr;
                        </button>
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
