interface QuickActionsProps {
  onNewAnalysis: () => void;
  onViewAllReports: () => void;
}

export default function QuickActions({ onNewAnalysis, onViewAllReports }: QuickActionsProps) {
  return (
    <div className="bg-white border border-border/80 rounded-2xl p-5 sm:p-5.5 shadow-2xs space-y-3 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center space-x-2">
          <svg className="w-5 h-5 text-nexus-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Quick Actions</span>
        </h3>
      </div>

      <div className="space-y-2.5">
        <button
          onClick={onNewAnalysis}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-nexus-50/50 border border-border/60 hover:border-nexus-200 rounded-xl text-sm font-semibold text-text-primary transition group cursor-pointer"
        >
          <span className="flex items-center space-x-3">
            <svg className="w-4 h-4 text-text-muted group-hover:text-nexus-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Analyze New Repository</span>
          </span>
          <span className="text-text-muted group-hover:text-nexus-600 group-hover:translate-x-0.5 transition font-bold">&rarr;</span>
        </button>

        <button
          onClick={onViewAllReports}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-nexus-50/50 border border-border/60 hover:border-nexus-200 rounded-xl text-sm font-semibold text-text-primary transition group cursor-pointer"
        >
          <span className="flex items-center space-x-3">
            <svg className="w-4 h-4 text-text-muted group-hover:text-nexus-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View All Reports</span>
          </span>
          <span className="text-text-muted group-hover:text-nexus-600 group-hover:translate-x-0.5 transition font-bold">&rarr;</span>
        </button>
      </div>

      <p className="text-xs text-text-muted leading-relaxed">
        Analyzing codebases locally or via public GitHub links takes less than 2 minutes.
      </p>
    </div>
  );
}
