import { useState, useEffect } from 'react';
import { api, type GitHubRepository } from '../../api/nexusApi';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndAnalyze: (name: string, cloneUrl: string, defaultBranch?: string) => Promise<void>;
}

export default function NewAnalysisModal({
  isOpen,
  onClose,
  onSelectAndAnalyze,
}: NewAnalysisModalProps) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGitHubConnected, setIsGitHubConnected] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setSelectedRepo(null);
      setSearchQuery('');
      setError(null);
      return;
    }

    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const ghRepos = await api.listGitHubRepositories();
        setRepositories(ghRepos);
        setIsGitHubConnected(true);
      } catch (err: any) {
        console.error('Error fetching GitHub repositories:', err);
        if (err.message && err.message.includes('expired') || err.message.includes('connect with GitHub')) {
          setIsGitHubConnected(false);
        }
        setError(err.message || 'Failed to fetch repositories from GitHub.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredRepos = repositories.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = async () => {
    if (!selectedRepo) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSelectAndAnalyze(
        selectedRepo.name,
        selectedRepo.clone_url || selectedRepo.html_url,
        selectedRepo.default_branch || 'main'
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to trigger repository analysis.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReconnect = () => {
    window.location.href = api.getGitHubAuthUrl();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-border rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <svg className="h-5 w-5 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
            <h3 className="text-base font-bold text-text-primary">Analyze a Repository</h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary text-sm font-bold p-1 rounded-md transition"
          >
            &times;
          </button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Select a repository from your connected GitHub account to verify documentation assertions against repository source code.
        </p>

        {/* Error / Disconnected Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            {!isGitHubConnected && (
              <button
                onClick={handleReconnect}
                className="px-2.5 py-1 bg-red-600 text-white rounded text-[11px] font-bold hover:bg-red-700 transition shrink-0 ml-2"
              >
                Reconnect
              </button>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <svg className="w-4 h-4 text-text-muted absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-nexus-500 bg-slate-50/50"
          />
        </div>

        {/* Repository List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[220px] max-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted space-y-2">
              <svg className="animate-spin h-5 w-5 text-nexus-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs font-medium">Fetching your GitHub repositories...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-muted">
              {repositories.length === 0 ? 'No repositories found in your GitHub account.' : 'No matching repositories found.'}
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <div
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'border-nexus-600 bg-nexus-50/30 shadow-2xs'
                      : 'border-border/80 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{repo.name}</h4>
                      <span className="text-[11px] text-text-muted font-mono">{repo.full_name}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md transition ${
                        isSelected ? 'bg-nexus-600 text-white' : 'text-nexus-600 bg-slate-50'
                      }`}
                    >
                      {isSelected ? 'Selected ✓' : 'Select →'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-[10px] text-text-muted">
                    <span className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>{repo.private ? 'Private' : 'Public'}</span>
                    </span>
                    <span>Branch: <strong className="text-text-secondary">{repo.default_branch || 'main'}</strong></span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/80">
          <div className="text-[11px] text-text-muted">
            {selectedRepo ? (
              <span>Selected: <strong className="text-text-primary">{selectedRepo.name}</strong></span>
            ) : (
              <span>Select 1 repository to analyze</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-border rounded-lg text-xs font-semibold text-text-secondary transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!selectedRepo || submitting}
              className="px-4 py-2 bg-nexus-600 hover:bg-nexus-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Starting...</span>
                </>
              ) : (
                <span>Analyze Repository &rarr;</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
