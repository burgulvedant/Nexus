import type { EvidenceSummaryRow } from '../../api/nexusApi';

interface EvidenceSummaryProps {
  evidenceSummary: EvidenceSummaryRow[];
}

export default function EvidenceSummary({ evidenceSummary }: EvidenceSummaryProps) {
  // Aggregate by source_type (Source Code, Configuration, Documentation, Tests, Dependencies, Scripts)
  const categoryMap: Record<string, { supporting: number; contradicting: number; contextual: number; total: number }> = {};

  // Formatter for category names
  const formatSourceType = (type: string) => {
    switch (type) {
      case 'SOURCE_CODE':
        return 'Source Code';
      case 'CONFIGURATION':
        return 'Configuration';
      case 'DOCUMENTATION':
        return 'Documentation';
      case 'TEST':
        return 'Tests';
      case 'DEPENDENCY':
        return 'Dependencies';
      case 'SCRIPTS':
      case 'COMMAND':
        return 'Scripts';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ');
    }
  };

  let totalSupporting = 0;
  let totalContradicting = 0;
  let totalContextual = 0;

  evidenceSummary.forEach((row) => {
    const formatted = formatSourceType(row.source_type);
    if (!categoryMap[formatted]) {
      categoryMap[formatted] = { supporting: 0, contradicting: 0, contextual: 0, total: 0 };
    }
    categoryMap[formatted].supporting += row.supporting;
    categoryMap[formatted].contradicting += row.contradicting;
    categoryMap[formatted].contextual += row.contextual;
    categoryMap[formatted].total += row.supporting + row.contradicting + row.contextual;

    totalSupporting += row.supporting;
    totalContradicting += row.contradicting;
    totalContextual += row.contextual;
  });

  const grandTotal = totalSupporting + totalContradicting + totalContextual;
  const rows = Object.entries(categoryMap);

  return (
    <div className="bg-white border border-border/80 rounded-2xl p-5 sm:p-5.5 shadow-2xs">
      <div className="mb-3">
        <h3 className="text-base sm:text-lg font-bold text-text-primary">Evidence Summary</h3>
        <p className="text-xs text-text-muted mt-0.5">Evidence observed across the entire codebase</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-bold text-text-muted uppercase border-b border-border/60 pb-2 tracking-wider">
              <th className="py-2 font-bold">SOURCE TYPE</th>
              <th className="py-2 text-right font-bold">SUPPORTING</th>
              <th className="py-2 text-right font-bold">CONTRADICTING</th>
              <th className="py-2 text-right font-bold">CONTEXTUAL</th>
              <th className="py-2 text-right font-bold">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-[13.5px]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-5 text-center text-text-muted text-sm">
                  No evidence aggregated yet.
                </td>
              </tr>
            ) : (
              rows.map(([category, counts]) => (
                <tr key={category} className="hover:bg-slate-50/60 transition">
                  <td className="py-2 text-text-secondary font-medium">{category}</td>
                  <td className="py-2 text-right font-semibold text-green-600">{counts.supporting}</td>
                  <td className="py-2 text-right font-semibold text-red-600">{counts.contradicting}</td>
                  <td className="py-2 text-right font-medium text-text-secondary">{counts.contextual}</td>
                  <td className="py-2 text-right font-bold text-text-primary">{counts.total}</td>
                </tr>
              ))
            )}
            {/* Summary Total Row */}
            <tr className="font-bold border-t border-border/80 bg-slate-50/60 text-sm">
              <td className="py-2.5 text-text-primary">Total</td>
              <td className="py-2.5 text-right text-green-600">{totalSupporting}</td>
              <td className="py-2.5 text-right text-red-600">{totalContradicting}</td>
              <td className="py-2.5 text-right text-text-secondary">{totalContextual}</td>
              <td className="py-2.5 text-right text-text-primary font-extrabold">{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
