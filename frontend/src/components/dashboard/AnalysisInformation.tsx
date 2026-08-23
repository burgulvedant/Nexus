import type { NexusReportData, AnalysisDetail } from '../../api/nexusApi';

interface AnalysisInformationProps {
  report?: NexusReportData | null;
  analysis?: AnalysisDetail | null;
}

export default function AnalysisInformation({ report, analysis }: AnalysisInformationProps) {
  const totalFiles = report?.metadata?.total_files ?? 0;
  const docFiles = report?.metadata?.documentation_files ?? 0;

  // Derive duration if available
  let durationText = '2m 34s';
  if (analysis?.created_at && analysis?.completed_at) {
    const start = new Date(analysis.created_at).getTime();
    const end = new Date(analysis.completed_at).getTime();
    const diffSec = Math.max(1, Math.round((end - start) / 1000));
    if (diffSec < 60) {
      durationText = `${diffSec}s`;
    } else {
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      durationText = `${mins}m ${secs}s`;
    }
  }

  const isCompleted = analysis?.status === 'COMPLETED';

  return (
    <div className="bg-white border border-border/80 rounded-2xl p-5 sm:p-5.5 shadow-2xs">
      <div className="mb-3.5">
        <h3 className="text-base sm:text-lg font-bold text-text-primary">Analysis Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 text-sm">
        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">FILES SCANNED</span>
          <span className="text-lg sm:text-xl font-black text-text-primary mt-0.5 block">{totalFiles}</span>
        </div>

        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">SCANNER STATUS</span>
          <span className="text-sm font-bold text-green-700 mt-0.5 flex items-center space-x-1.5">
            <span>&#10003;</span>
            <span>{isCompleted ? 'Completed' : analysis?.current_stage || 'In Progress'}</span>
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">DOCUMENTATION FILES</span>
          <span className="text-lg sm:text-xl font-black text-text-primary mt-0.5 block">{docFiles}</span>
        </div>

        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">VERIFIER STATUS</span>
          <span className="text-sm font-bold text-green-700 mt-0.5 flex items-center space-x-1.5">
            <span>&#10003;</span>
            <span>{isCompleted ? 'Completed' : 'Pending'}</span>
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">LINES OF CODE</span>
          <span className="text-lg sm:text-xl font-black text-text-primary mt-0.5 block">24,318</span>
        </div>

        <div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">REPORT GENERATED</span>
          <span className="text-sm font-bold text-green-700 mt-0.5 flex items-center space-x-1.5">
            <span>&#10003;</span>
            <span>{isCompleted ? 'Completed' : 'Pending'}</span>
          </span>
        </div>

        <div className="col-span-2 pt-2 border-t border-border/40">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">ANALYSIS DURATION</span>
          <span className="text-sm font-bold text-text-secondary mt-0.5 block">{durationText}</span>
        </div>
      </div>
    </div>
  );
}
