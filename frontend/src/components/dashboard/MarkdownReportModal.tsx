interface MarkdownReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
  repoName: string;
}

export default function MarkdownReportModal({
  isOpen,
  onClose,
  markdownContent,
  repoName,
}: MarkdownReportModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-truth-report-${repoName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6">
      <div className="bg-white border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
            <h3 className="text-sm font-bold text-text-primary">
              Nexus Truth Report &mdash; {repoName}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-nexus-50 hover:bg-nexus-100 text-nexus-700 border border-nexus-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Markdown</span>
            </button>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary text-base font-bold p-1 rounded-md"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-text-primary bg-slate-50/50 leading-relaxed whitespace-pre-wrap select-text">
          {markdownContent || 'Loading report data...'}
        </div>
      </div>
    </div>
  );
}
