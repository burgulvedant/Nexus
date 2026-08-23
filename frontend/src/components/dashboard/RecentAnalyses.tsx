import type { AnalysisDetail } from '../../api/nexusApi';

interface RecentAnalysesProps {
  analyses: AnalysisDetail[];
  currentAnalysisId?: string;
  onSelectAnalysis: (analysisId: string) => void;
  onViewReport: (analysisId: string) => void;
}

export default function RecentAnalyses({
  analyses,
  currentAnalysisId,
  onSelectAnalysis,
  onViewReport,
}: RecentAnalysesProps) {
  return (
    <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 h-full">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-text-primary">Recent Analyses</h3>
        <p className="text-xs text-text-muted mt-0.5">Historical verification runs and truth scores</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-0">
          <thead>
            <tr className="text-xs font-bold text-text-muted uppercase border-b border-border/60 pb-2 tracking-wider">
              <th className="py-2 font-bold"># REPOSITORY</th>
              <th className="py-2 text-center font-bold">TRUTH SCORE</th>
              <th className="py-2 text-center font-bold">CLAIMS</th>
              <th className="py-2 font-bold">DATE</th>
              <th className="py-2 font-bold">STATUS</th>
              <th className="py-2 text-right font-bold w-20">REPORT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-[13.5px]">
            {analyses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-5 text-center text-text-muted text-sm">
                  No historical analyses found.
                </td>
              </tr>
            ) : (
              analyses.slice(0, 4).map((a, idx) => {
                const isSelected = a.id === currentAnalysisId;
                const repoName = a.repository?.name || 'GradScope';
                const shortIndex = analyses.length - idx;
                const dateStr = a.completed_at
                  ? new Date(a.completed_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Just now';

                return (
                  <tr
                    key={a.id}
                    className={`hover:bg-slate-50/80 transition cursor-pointer ${
                      isSelected ? 'bg-nexus-50/50 font-semibold' : ''
                    }`}
                    onClick={() => onSelectAnalysis(a.id)}
                  >
                    <td className="py-2.5 pr-2">
                      <span className="text-text-muted font-bold mr-2">#{shortIndex}</span>
                      <strong className="text-text-primary text-[14px]">{repoName}</strong>
                      <span className="text-xs text-text-muted ml-2 font-mono">main</span>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-nexus-600 text-sm whitespace-nowrap">
                      {a.truth_score}/100
                    </td>
                    <td className="py-2.5 px-2 text-center text-text-secondary text-xs sm:text-sm">
                      {a.total_claims}
                    </td>
                    <td className="py-2.5 px-2 text-text-muted text-xs sm:text-sm whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 whitespace-nowrap">
                        {a.status === 'COMPLETED' ? 'Completed' : a.status}
                      </span>
                    </td>
                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewReport(a.id);
                        }}
                        className="text-xs sm:text-sm font-semibold text-nexus-600 hover:text-nexus-700 hover:underline transition cursor-pointer"
                      >
                        View &nearr;
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
