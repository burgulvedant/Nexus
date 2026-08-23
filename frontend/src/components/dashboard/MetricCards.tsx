import type { AnalysisDetail } from '../../api/nexusApi';

interface MetricCardsProps {
  analysis?: AnalysisDetail | null;
}

export default function MetricCards({ analysis }: MetricCardsProps) {
  const truthScore = analysis ? analysis.truth_score : 0;
  const verifiedCount = analysis ? analysis.verified_count : 0;
  const uncertainCount = analysis ? analysis.uncertain_count : 0;
  const contradictedCount = analysis ? analysis.contradicted_count : 0;
  const totalClaims = analysis ? analysis.total_claims : 0;

  // Calculate percentages safely
  const verifiedPct = totalClaims > 0 ? ((verifiedCount / totalClaims) * 100).toFixed(1) : '0.0';
  const uncertainPct = totalClaims > 0 ? ((uncertainCount / totalClaims) * 100).toFixed(1) : '0.0';
  const contradictedPct = totalClaims > 0 ? ((contradictedCount / totalClaims) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
      {/* 1. TRUTH SCORE */}
      <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">TRUTH SCORE</span>
          <span className="w-2.5 h-2.5 rounded-full bg-nexus-500"></span>
        </div>
        <div className="my-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">{truthScore}</span>
            <span className="text-sm font-bold text-text-muted">/ 100</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-nexus-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, truthScore))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-text-muted font-medium">
            <span>VERIFICATION INDEX</span>
            <span className="font-bold text-nexus-600">{truthScore}%</span>
          </div>
        </div>
      </div>

      {/* 2. VERIFIED */}
      <div className="bg-white border border-green-200/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-green-700 uppercase tracking-wider">VERIFIED</span>
          <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
            ✓
          </span>
        </div>
        <div className="my-2">
          <span className="text-4xl sm:text-5xl font-black text-green-600 tracking-tight">{verifiedCount}</span>
        </div>
        <div className="text-xs text-green-700 font-medium">
          <strong>{verifiedPct}%</strong> OF TOTAL CLAIMS
        </div>
      </div>

      {/* 3. UNCERTAIN */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">UNCERTAIN</span>
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
            ?
          </span>
        </div>
        <div className="my-2">
          <span className="text-4xl sm:text-5xl font-black text-amber-600 tracking-tight">{uncertainCount}</span>
        </div>
        <div className="text-xs text-amber-700 font-medium">
          <strong>{uncertainPct}%</strong> OF TOTAL CLAIMS
        </div>
      </div>

      {/* 4. CONTRADICTED */}
      <div className="bg-white border border-red-200/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-700 uppercase tracking-wider">CONTRADICTED</span>
          <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
            &times;
          </span>
        </div>
        <div className="my-2">
          <span className="text-4xl sm:text-5xl font-black text-red-600 tracking-tight">{contradictedCount}</span>
        </div>
        <div className="text-xs text-red-700 font-medium">
          <strong>{contradictedPct}%</strong> OF TOTAL CLAIMS
        </div>
      </div>

      {/* 5. TOTAL CLAIMS */}
      <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">TOTAL CLAIMS</span>
          <span className="w-5 h-5 rounded-full bg-slate-100 text-text-secondary flex items-center justify-center text-xs">
            &#9881;
          </span>
        </div>
        <div className="my-2">
          <span className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">{totalClaims}</span>
        </div>
        <div className="text-xs text-text-muted font-medium">
          EXTRACTED DOCUMENTATION CLAIMS
        </div>
      </div>
    </div>
  );
}
