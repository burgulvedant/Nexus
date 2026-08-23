import { useEffect, useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import MetricCards from './MetricCards';
import RecentFindings from './RecentFindings';
import EvidenceSummary from './EvidenceSummary';
import AnalysisInformation from './AnalysisInformation';
import RecentAnalyses from './RecentAnalyses';
import QuickActions from './QuickActions';
import Repositories from './Repositories';
import Reports from './Reports';
import EvidenceExplorer from './EvidenceExplorer';
import History from './History';
import Settings from './Settings';
import NewAnalysisModal from './NewAnalysisModal';
import MarkdownReportModal from './MarkdownReportModal';

import {
  api,
  formatReportDataToMarkdown,
  type AnalysisDetail,
  type NexusReportData,
  type RepositorySummary,
} from '../../api/nexusApi';

interface DashboardProps {
  onBackToLanding: () => void;
}

export default function Dashboard({ onBackToLanding }: DashboardProps) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [repositories, setRepositories] = useState<RepositorySummary[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisDetail | null>(null);
  const [reportData, setReportData] = useState<NexusReportData | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isNewAnalysisOpen, setIsNewAnalysisOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [reportModalRepoName, setReportModalRepoName] = useState<string>('GradScope');

  // Poll and synchronize analysis status, live stages, and report data
  const pollAndSyncAnalysis = useCallback(async (analysisId: string): Promise<AnalysisDetail | null> => {
    let attempts = 0;
    while (attempts < 180) { // Up to 3 minutes of polling
      try {
        const statusRes = await api.getAnalysisStatus(analysisId);

        // Update live progress and stage in currentAnalysis
        setCurrentAnalysis((prev) => {
          if (prev && prev.id === analysisId) {
            return {
              ...prev,
              status: statusRes.status,
              current_stage: statusRes.current_stage,
              error_message: statusRes.error_message,
              ...(statusRes.progress
                ? {
                    total_claims: statusRes.progress.total_claims,
                    verified_count: statusRes.progress.verified,
                    uncertain_count: statusRes.progress.uncertain,
                    contradicted_count: statusRes.progress.contradicted,
                    truth_score: statusRes.progress.truth_score,
                  }
                : {}),
            };
          }
          return prev;
        });

        if (statusRes.status === 'COMPLETED') {
          const [completedDetail, rep] = await Promise.all([
            api.getAnalysis(analysisId),
            api.getJsonReport(analysisId),
          ]);
          setCurrentAnalysis(completedDetail);
          setReportData(rep);
          setRecentAnalyses((prev) =>
            prev.map((a) => (a.id === completedDetail.id ? completedDetail : a))
          );
          if (completedDetail.repository_id) {
            api.listRepositoryAnalyses(completedDetail.repository_id).then(setRecentAnalyses).catch(() => {});
          }
          return completedDetail;
        }

        if (statusRes.status === 'FAILED') {
          const failedDetail = await api.getAnalysis(analysisId);
          setCurrentAnalysis(failedDetail);
          setReportData(null);
          setRecentAnalyses((prev) =>
            prev.map((a) => (a.id === failedDetail.id ? failedDetail : a))
          );
          return failedDetail;
        }
      } catch (err) {
        console.error('[Nexus Dashboard] Error during analysis polling:', err);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    try {
      const finalDetail = await api.getAnalysis(analysisId);
      setCurrentAnalysis(finalDetail);
      if (finalDetail.status === 'COMPLETED') {
        const rep = await api.getJsonReport(analysisId);
        setReportData(rep);
      }
      return finalDetail;
    } catch {
      return null;
    }
  }, []);

  // 1. Initial Load: Auth and fetch latest repository & analyses
  const initializeDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure session exists (uses stored token if present)
      if (!api.getToken()) {
        await api.getOrCreateDevSession();
      }

      // Fetch existing repositories for the active user session
      let repos = await api.listRepositories();
      setRepositories(repos);

      if (repos.length > 0) {
        let activeRepo = repos[0];

        // Fetch analyses for active repository
        let analyses = await api.listRepositoryAnalyses(activeRepo.id);
        let latestAnalysis = analyses[0];

        // If no analyses exist yet, trigger the first analysis
        if (!latestAnalysis) {
          const created = await api.createAnalysis(activeRepo.id);
          analyses = [created];
          setRecentAnalyses(analyses);
          setCurrentAnalysis(created);
          pollAndSyncAnalysis(created.id);
        } else {
          setRecentAnalyses(analyses);
          setCurrentAnalysis(latestAnalysis);

          // Fetch structured report if completed, or resume polling if running
          if (latestAnalysis.status === 'COMPLETED') {
            const rep = await api.getJsonReport(latestAnalysis.id);
            setReportData(rep);
          } else if (latestAnalysis.status === 'RUNNING' || latestAnalysis.status === 'QUEUED') {
            setReportData(null);
            pollAndSyncAnalysis(latestAnalysis.id);
          } else {
            setReportData(null);
          }
        }
      } else {
        // Explicitly clear all state when zero repositories exist
        setCurrentAnalysis(null);
        setRecentAnalyses([]);
        setReportData(null);
      }
    } catch (err: any) {
      console.error('Error initializing dashboard:', err);
      setError(err.message || 'Failed to connect to Nexus Truth Engine backend.');
    } finally {
      setLoading(false);
    }
  }, [pollAndSyncAnalysis]);

  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Handle switching active repository from header switcher
  const handleSelectRepository = async (repoId: string) => {
    try {
      setLoading(true);
      setError(null);

      const analyses = await api.listRepositoryAnalyses(repoId);
      setRecentAnalyses(analyses);

      let activeAnalysis = analyses && analyses.length > 0 ? analyses[0] : null;

      if (!activeAnalysis) {
        // If repo has no analyses yet, trigger new analysis
        const created = await api.createAnalysis(repoId);
        setRecentAnalyses([created]);
        setCurrentAnalysis(created);
        setReportData(null);
        pollAndSyncAnalysis(created.id);
      } else {
        setCurrentAnalysis(activeAnalysis);

        if (activeAnalysis.status === 'COMPLETED') {
          const rep = await api.getJsonReport(activeAnalysis.id);
          setReportData(rep);
        } else if (activeAnalysis.status === 'RUNNING' || activeAnalysis.status === 'QUEUED') {
          setReportData(null);
          pollAndSyncAnalysis(activeAnalysis.id);
        } else {
          setReportData(null);
        }
      }

      setCurrentTab('dashboard');
    } catch (err: any) {
      console.error('Error switching repository:', err);
      setError(err.message || 'Failed to switch repository.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a repository
  const handleDeleteRepository = async (repoId: string) => {
    try {
      setLoading(true);
      setError(null);

      await api.deleteRepository(repoId);

      // Fetch fresh list of repositories
      const updatedRepos = await api.listRepositories();
      setRepositories(updatedRepos);

      if (updatedRepos.length > 0) {
        // Select the first available remaining repository
        const nextRepo = updatedRepos[0];
        const analyses = await api.listRepositoryAnalyses(nextRepo.id);
        setRecentAnalyses(analyses);

        let activeAnalysis = analyses && analyses.length > 0 ? analyses[0] : null;
        if (!activeAnalysis) {
          const created = await api.createAnalysis(nextRepo.id);
          setRecentAnalyses([created]);
          setCurrentAnalysis(created);
          setReportData(null);
          pollAndSyncAnalysis(created.id);
        } else {
          setCurrentAnalysis(activeAnalysis);
          if (activeAnalysis.status === 'COMPLETED') {
            const rep = await api.getJsonReport(activeAnalysis.id);
            setReportData(rep);
          } else if (activeAnalysis.status === 'RUNNING' || activeAnalysis.status === 'QUEUED') {
            setReportData(null);
            pollAndSyncAnalysis(activeAnalysis.id);
          } else {
            setReportData(null);
          }
        }
      } else {
        // No repositories remain
        setCurrentAnalysis(null);
        setRecentAnalyses([]);
        setReportData(null);
      }
    } catch (err: any) {
      console.error('Error deleting repository:', err);
      setError(err.message || 'Failed to delete repository.');
    } finally {
      setLoading(false);
    }
  };

  // Handle switching selected analysis from the recent table
  const handleSelectAnalysis = async (analysisId: string) => {
    try {
      setLoading(true);
      const detail = await api.getAnalysis(analysisId);
      setCurrentAnalysis(detail);
      if (detail.status === 'COMPLETED') {
        const rep = await api.getJsonReport(analysisId);
        setReportData(rep);
      } else {
        setReportData(null);
        if (detail.status === 'RUNNING' || detail.status === 'QUEUED') {
          pollAndSyncAnalysis(detail.id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Could not load analysis details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle triggering a new analysis run for a selected GitHub repository
  const handleSelectAndAnalyze = async (repoName: string, repoUrl: string, defaultBranch = 'main') => {
    const resolvedRepo = await api.resolveGitHubRepository(repoName, repoUrl, defaultBranch);
    const newAnalysis = await api.createAnalysis(resolvedRepo.id);

    // Refresh repositories list to include the newly resolved repo
    const updatedRepos = await api.listRepositories();
    setRepositories(updatedRepos);

    // Refresh list & select the newly created analysis immediately
    setCurrentAnalysis(newAnalysis);
    setReportData(null);
    setRecentAnalyses((prev) => [newAnalysis, ...prev.filter((a) => a.id !== newAnalysis.id)]);
    setCurrentTab('dashboard');

    // Start background poll and sync
    pollAndSyncAnalysis(newAnalysis.id);
  };

  // Handle View / Export Full Report
  const handleOpenMarkdownReport = async (analysisId?: string | unknown, repoName?: string) => {
    const targetAnalysisId =
      typeof analysisId === 'string' && analysisId.trim().length > 0 && !analysisId.startsWith('[object')
        ? analysisId.trim()
        : currentAnalysis?.id;

    if (!targetAnalysisId) {
      alert('No completed analysis available to view report.');
      return;
    }

    const modalRepoName = repoName || currentAnalysis?.repository?.name || 'Nexus Analysis';
    setReportModalRepoName(modalRepoName);

    // Fast path: If reportData is already loaded in React state for this analysis, render instantly
    if (reportData && (reportData.metadata?.analysis_id === targetAnalysisId || currentAnalysis?.id === targetAnalysisId)) {
      const clientMd = formatReportDataToMarkdown(reportData);
      setMarkdownContent(clientMd);
      setIsReportModalOpen(true);
      return;
    }

    // Fallback: Fetch from backend endpoint (which now runs in <150ms with batch queries)
    try {
      const md = await api.getMarkdownReport(targetAnalysisId);
      setMarkdownContent(md);
      setIsReportModalOpen(true);
    } catch (err: any) {
      console.error('[Nexus Dashboard] Failed to open markdown report:', err);
      alert(`Could not fetch report: ${err.message}`);
    }
  };

  // Handle direct navigation to a specific repository & analysis
  const handleSelectRepoAndAnalysis = async (analysisId: string, repositoryId: string) => {
    try {
      setLoading(true);
      const detail = await api.getAnalysis(analysisId);
      setCurrentAnalysis(detail);
      setCurrentTab('dashboard');

      const analyses = await api.listRepositoryAnalyses(repositoryId);
      setRecentAnalyses(analyses);

      if (detail.status === 'COMPLETED') {
        const rep = await api.getJsonReport(analysisId);
        setReportData(rep);
      } else {
        setReportData(null);
        if (detail.status === 'RUNNING' || detail.status === 'QUEUED') {
          pollAndSyncAnalysis(detail.id);
        }
      }
    } catch (err: any) {
      console.error('Error switching to analysis:', err);
      setError(err.message || 'Failed to load analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-text-primary antialiased font-sans overflow-hidden">
      {/* 1. Left Sidebar (Stationary full height) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNewAnalysis={() => setIsNewAnalysisOpen(true)}
        onHome={onBackToLanding}
      />

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {currentTab !== 'settings' && (
          <DashboardHeader
            analysis={currentAnalysis}
            repositories={repositories}
            onSelectRepository={handleSelectRepository}
            onDeleteRepository={handleDeleteRepository}
            onNewAnalysis={() => setIsNewAnalysisOpen(true)}
            onBackToLanding={onBackToLanding}
          />
        )}

        {/* Dashboard Main Workspace Area: Conditional per Tab */}
        {currentTab === 'repositories' ? (
          <Repositories
            onNewAnalysis={() => setIsNewAnalysisOpen(true)}
            onSelectAnalysis={(analysisId) => {
              handleSelectAnalysis(analysisId);
              setCurrentTab('dashboard');
            }}
            onViewReport={(analysisId) => {
              handleOpenMarkdownReport(analysisId);
            }}
          />
        ) : currentTab === 'reports' ? (
          <Reports
            onNewAnalysis={() => setIsNewAnalysisOpen(true)}
            onViewReport={(analysisId, repoName) => {
              handleOpenMarkdownReport(analysisId, repoName);
            }}
          />
        ) : currentTab === 'evidence' ? (
          <EvidenceExplorer
            repositories={repositories}
            currentAnalysis={currentAnalysis}
            onSelectAnalysis={(analysisId, repoId) => {
              handleSelectRepoAndAnalysis(analysisId, repoId);
            }}
            onNewAnalysis={() => setIsNewAnalysisOpen(true)}
          />
        ) : currentTab === 'history' ? (
          <History
            onSelectAnalysis={(analysisId, repoId) => {
              handleSelectRepoAndAnalysis(analysisId, repoId);
            }}
            onNewAnalysis={() => setIsNewAnalysisOpen(true)}
          />
        ) : currentTab === 'settings' ? (
          <Settings onSignOut={onBackToLanding} />
        ) : repositories.length === 0 && !loading ? (
          /* Empty State when all repositories have been deleted */
          <div className="p-8 sm:p-14 max-w-2xl mx-auto text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-nexus-50 text-nexus-600 flex items-center justify-center mx-auto shadow-2xs">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">No repositories connected yet</h3>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed max-w-md mx-auto">
                Connect a repository to start verifying what your documentation claims against what your software actually does.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setIsNewAnalysisOpen(true)}
                className="inline-flex items-center space-x-2 bg-nexus-600 hover:bg-nexus-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Analysis</span>
              </button>
            </div>
          </div>
        ) : (
          <main className="p-4 sm:p-5 md:p-6 w-full max-w-none space-y-4">
            {/* Loading Indicator */}
            {loading && !currentAnalysis && (
              <div className="flex items-center justify-center py-12 text-text-muted space-x-3">
                <svg className="animate-spin h-6 w-6 text-nexus-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-semibold text-text-secondary">Loading analysis data from Nexus engine...</span>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <strong>Backend Connection Error:</strong> {error}
                </div>
                <button
                  onClick={initializeDashboard}
                  className="px-3 py-1 bg-white border border-red-200 rounded text-red-700 font-semibold hover:bg-red-50"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Analysis Running Progress Bar */}
            {currentAnalysis && currentAnalysis.status === 'RUNNING' && (
              <div className="bg-nexus-50 border border-nexus-200 p-3.5 rounded-xl text-xs space-y-1.5 animate-pulse">
                <div className="flex items-center justify-between font-bold text-nexus-800">
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-nexus-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verification in progress: {currentAnalysis.current_stage || 'RUNNING'}</span>
                  </span>
                  <span>Stage: {currentAnalysis.current_stage || 'Processing...'}</span>
                </div>
              </div>
            )}

            {/* Analysis Failed Banner */}
            {currentAnalysis && currentAnalysis.status === 'FAILED' && (
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-xs space-y-1">
                <div className="font-bold text-red-700">Analysis Failed</div>
                <p className="text-red-600">{currentAnalysis.error_message || 'An unexpected error occurred during execution.'}</p>
              </div>
            )}

            {/* 1. TOP METRIC CARDS */}
            <MetricCards analysis={currentAnalysis} />

            {/* 2. ROW 1: PRIMARY ANALYSIS (7:5 proportion) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              {/* Left Column: Recent Findings (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <RecentFindings
                  findingsVerified={reportData?.findings?.verified || []}
                  findingsUncertain={reportData?.findings?.uncertain || []}
                  findingsContradicted={reportData?.findings?.contradicted || []}
                  loading={loading || (!reportData && currentAnalysis?.status === 'COMPLETED')}
                  onViewAll={() => handleOpenMarkdownReport(currentAnalysis?.id, currentAnalysis?.repository?.name)}
                />
              </div>

              {/* Right Column: Evidence Summary & Analysis Information (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <EvidenceSummary 
                  evidenceSummary={reportData?.evidence_summary || []} 
                  loading={loading || (!reportData && currentAnalysis?.status === 'COMPLETED')}
                />

                <AnalysisInformation report={reportData} analysis={currentAnalysis} />
              </div>
            </div>

            {/* 3. ROW 2: HISTORY & ACTIONS (7:5 proportion, exactly ~16px below Row 1) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              {/* Left Column: Recent Analyses (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <RecentAnalyses
                  analyses={recentAnalyses}
                  currentAnalysisId={currentAnalysis?.id}
                  onSelectAnalysis={handleSelectAnalysis}
                  onViewReport={(analysisId) => handleOpenMarkdownReport(analysisId)}
                />
              </div>

              {/* Right Column: Quick Actions (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <QuickActions
                  onNewAnalysis={() => setIsNewAnalysisOpen(true)}
                  onViewAllReports={() => handleOpenMarkdownReport(currentAnalysis?.id, currentAnalysis?.repository?.name)}
                />
              </div>
            </div>
          </main>
        )}
      </div>

      {/* MODALS */}
      <NewAnalysisModal
        isOpen={isNewAnalysisOpen}
        onClose={() => setIsNewAnalysisOpen(false)}
        onSelectAndAnalyze={handleSelectAndAnalyze}
      />

      <MarkdownReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        markdownContent={markdownContent}
        repoName={reportModalRepoName}
      />
    </div>
  );
}
