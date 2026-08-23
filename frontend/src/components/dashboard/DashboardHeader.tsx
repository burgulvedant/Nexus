import { useState, useRef, useEffect } from 'react';
import type { AnalysisDetail, RepositorySummary } from '../../api/nexusApi';

interface DashboardHeaderProps {
  analysis?: AnalysisDetail | null;
  repositories: RepositorySummary[];
  onSelectRepository: (repoId: string) => void;
  onDeleteRepository: (repoId: string) => Promise<void>;
  onNewAnalysis: () => void;
  onBackToLanding: () => void;
}

export default function DashboardHeader({
  analysis,
  repositories,
  onSelectRepository,
  onDeleteRepository,
  onNewAnalysis,
  onBackToLanding,
}: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<RepositorySummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasRepositories = repositories.length > 0;
  const currentRepoId = analysis?.repository_id;
  const repoName = analysis?.repository?.name || (hasRepositories ? 'Select Repository' : 'No Repositories');
  const branch = analysis?.repository?.default_branch || 'main';
  const commit = analysis?.commit_sha ? analysis.commit_sha.substring(0, 7) : '—';
  const status = analysis?.status;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Format completed date
  const completedDate = analysis?.completed_at
    ? new Date(analysis.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : analysis?.created_at
    ? 'In Progress'
    : '—';

  const confirmDelete = async () => {
    if (!repoToDelete) return;
    try {
      setIsDeleting(true);
      await onDeleteRepository(repoToDelete.id);
      setRepoToDelete(null);
    } catch (err: any) {
      alert(`Could not delete repository: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-border/80 px-6 sm:px-8 py-3.5 sm:py-4">
        {/* Top Breadcrumb & User info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted mb-2.5">
          <div className="flex items-center space-x-2 font-medium">
            <button onClick={onBackToLanding} className="hover:text-nexus-600 transition cursor-pointer">
              Home
            </button>
            <span>&rsaquo;</span>
            <span>Repositories</span>
            {hasRepositories && (
              <>
                <span>&rsaquo;</span>
                <span className="text-text-primary font-semibold">{repoName}</span>
                {analysis?.id && (
                  <>
                    <span>&rsaquo;</span>
                    <span className="text-text-secondary font-mono">Analysis #{analysis.id.substring(0, 6)}</span>
                  </>
                )}
              </>
            )}
          </div>

          {/* User profile avatar (Theme toggle and Notification bell removed) */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-nexus-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              VB
            </div>
          </div>
        </div>

        {/* Main Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3.5">
              {/* Clickable Repository Switcher Dropdown */}
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="group inline-flex items-center space-x-2 text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight hover:text-nexus-600 transition cursor-pointer rounded-lg px-1.5 py-0.5 -ml-1.5 hover:bg-slate-100/70"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>{repoName}</span>
                  <svg
                    className={`w-5 h-5 text-text-muted group-hover:text-nexus-600 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-nexus-600' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu Popover */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 origin-top-left rounded-2xl bg-white border border-border/90 shadow-xl shadow-slate-900/10 ring-1 ring-nexus-200/50 z-50 overflow-hidden divide-y divide-border/60 animate-in fade-in zoom-in-95 duration-150">
                    {/* Connected Repositories List with Aligned Actions */}
                    <div className="p-1.5 max-h-64 overflow-y-auto space-y-1">
                      {repositories.length === 0 ? (
                        <div className="p-3 text-center text-xs text-text-muted">
                          No repositories connected yet.
                        </div>
                      ) : (
                        repositories.map((r) => {
                          const isSelected = r.id === currentRepoId;
                          return (
                            <div
                              key={r.id}
                              className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition cursor-pointer ${
                                isSelected
                                  ? 'bg-nexus-50/80 text-nexus-900 font-semibold'
                                  : 'text-text-primary hover:bg-slate-50'
                              }`}
                              onClick={() => {
                                onSelectRepository(r.id);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {/* Column 1: Repo Icon + Truncated Name (Flexible Area) */}
                              <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                                <svg className={`w-4 h-4 shrink-0 ${isSelected ? 'text-nexus-600' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span className="truncate text-[13.5px]" title={r.name}>{r.name}</span>
                              </div>

                              {/* Column 2: Selected Checkmark (Fixed Width Area) */}
                              <div className="w-5 shrink-0 flex items-center justify-center">
                                {isSelected ? (
                                  <span className="text-nexus-600 text-xs font-black">✓</span>
                                ) : null}
                              </div>

                              {/* Column 3: Delete Action (Fixed Width Aligned Column) */}
                              <div className="w-7 shrink-0 flex items-center justify-end pl-1">
                                <button
                                  type="button"
                                  title="Delete repository"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(false);
                                    setRepoToDelete(r);
                                  }}
                                  className="p-1 rounded-md text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* + New Analysis Action (Bottom) */}
                    <div className="p-1.5 bg-slate-50/50">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onNewAnalysis();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-nexus-600 hover:bg-nexus-50 hover:text-nexus-700 transition cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-nexus-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Analysis</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    status === 'COMPLETED'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : status === 'RUNNING'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {status === 'COMPLETED' ? 'Completed' : status}
                </span>
              )}
            </div>

            {hasRepositories && analysis && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-text-muted">
                {analysis.repository?.clone_url && (
                  <span className="flex items-center space-x-1.5 font-medium text-text-secondary">
                    <svg className="w-4 h-4 text-text-muted shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>{analysis.repository.clone_url.replace('https://github.com/', '')}</span>
                  </span>
                )}
                <span>Branch: <strong className="font-semibold text-text-secondary">{branch}</strong></span>
                <span>Commit: <strong className="font-mono text-text-secondary">{commit}</strong></span>
                <span>Analysis ID: <strong className="font-mono text-text-secondary">{`NEXUS-${analysis.id.substring(0, 8)}`}</strong></span>
                <span>Completed: <strong className="font-semibold text-text-secondary">{completedDate}</strong></span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      {repoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">Delete repository?</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This will remove <strong>{repoToDelete.name}</strong> and its associated Nexus analysis data. This does not delete the actual GitHub repository.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setRepoToDelete(null)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-text-secondary border border-border rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
