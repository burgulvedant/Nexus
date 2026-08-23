// API Client for Nexus Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  github_id?: string | null;
  github_username?: string | null;
  github_avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface RepositorySummary {
  id: string;
  name: string;
  clone_url: string;
  default_branch: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  html_url: string;
  clone_url: string;
  default_branch: string;
  private: boolean;
  description?: string | null;
  updated_at?: string | null;
}

export interface AnalysisDetail {
  id: string;
  repository_id: string;
  repository?: RepositorySummary;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  current_stage?: string | null;
  commit_sha?: string | null;
  error_message?: string | null;
  total_claims: number;
  verified_count: number;
  uncertain_count: number;
  contradicted_count: number;
  truth_score: number;
  created_at: string;
  completed_at?: string | null;
}

export interface AnalysisStatus {
  analysis_id: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  current_stage?: string | null;
  progress?: {
    total_claims: number;
    verified: number;
    uncertain: number;
    contradicted: number;
    truth_score: number;
  } | null;
  error_message?: string | null;
  created_at: string;
  completed_at?: string | null;
}

export interface FindingEvidence {
  id: string;
  relationship: 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXTUAL';
  source_type: string;
  file_path: string;
  line_number?: number | null;
  content?: string | null;
  explanation: string;
  discovery_method: string;
  confidence: number;
}

export interface Finding {
  claim_id: string;
  title: string;
  description?: string;
  category: string;
  source_file: string;
  line_number?: number | null;
  original_text: string;
  verdict: 'VERIFIED' | 'UNCERTAIN' | 'CONTRADICTED';
  truth_confidence: number;
  explanation: string;
  evidence: FindingEvidence[];
  missing_evidence_types?: string[];
}

export interface EvidenceSummaryRow {
  source_type: string;
  discovery_method: string;
  supporting: number;
  contradicting: number;
  contextual: number;
}

export interface NexusReportData {
  metadata: {
    report_id: string;
    repository_name: string;
    repository_url: string;
    commit_sha?: string | null;
    analysis_id: string;
    analysis_timestamp: string;
    total_files: number;
    documentation_files: number;
    analysis_status: string;
  };
  summary: {
    truth_score: number;
    total_claims: number;
    verified_count: number;
    uncertain_count: number;
    contradicted_count: number;
  };
  findings: {
    verified: Finding[];
    uncertain: Finding[];
    contradicted: Finding[];
  };
  evidence_summary: EvidenceSummaryRow[];
}

class ApiService {
  private token: string | null = localStorage.getItem('nexus_token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('nexus_token', token);
    } else {
      localStorage.removeItem('nexus_token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('nexus_token');
  }

  getGitHubAuthUrl(): string {
    return `${API_BASE_URL}/auth/github`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = `API Request failed with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.detail) {
          errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
        }
      } catch {
        // use default errorDetail
      }
      throw new Error(errorDetail);
    }

    return response.json();
  }

  // Auth & Session
  async getOrCreateDevSession(): Promise<string> {
    const defaultEmail = 'demo@nexus.ai';
    const defaultPassword = 'nexuspassword123';

    try {
      // Try to login with demo credentials
      const formBody = new URLSearchParams();
      formBody.append('username', defaultEmail);
      formBody.append('password', defaultPassword);

      const resp = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
      });

      if (resp.ok) {
        const data = await resp.json();
        this.setToken(data.access_token);
        return data.access_token;
      }
    } catch {
      // Ignore login error, try registering
    }

    // Register demo user
    try {
      await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: defaultEmail, password: defaultPassword }),
      });
    } catch {
      // If already registered, ignore
    }

    // Login after registration
    const formBody = new URLSearchParams();
    formBody.append('username', defaultEmail);
    formBody.append('password', defaultPassword);

    const loginResp = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    if (!loginResp.ok) {
      throw new Error('Could not establish demo session with backend.');
    }

    const data = await loginResp.json();
    this.setToken(data.access_token);
    return data.access_token;
  }

  logout() {
    this.setToken(null);
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async deleteCurrentUser(): Promise<void> {
    const headers: Record<string, string> = {};
    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok && response.status !== 204) {
      let err = `Failed to delete user account (HTTP ${response.status})`;
      try {
        const errJson = await response.json();
        if (errJson.detail) err = errJson.detail;
      } catch {
        // use default error message
      }
      throw new Error(err);
    }
    this.logout();
  }

  // Analyses
  async createAnalysis(repositoryId: string, commitSha?: string): Promise<AnalysisDetail> {
    return this.request<AnalysisDetail>('/analyses', {
      method: 'POST',
      body: JSON.stringify({ repository_id: repositoryId, commit_sha: commitSha }),
    });
  }

  async getAnalysisStatus(analysisId: string): Promise<AnalysisStatus> {
    return this.request<AnalysisStatus>(`/analyses/${analysisId}/status`);
  }

  async getAnalysis(analysisId: string): Promise<AnalysisDetail> {
    return this.request<AnalysisDetail>(`/analyses/${analysisId}`);
  }

  async listRepositoryAnalyses(repositoryId: string): Promise<AnalysisDetail[]> {
    return this.request<AnalysisDetail[]>(`/repositories/${repositoryId}/analyses`);
  }

  // Repositories
  async listRepositories(): Promise<RepositorySummary[]> {
    return this.request<RepositorySummary[]>('/repositories');
  }

  async listGitHubRepositories(): Promise<GitHubRepository[]> {
    return this.request<GitHubRepository[]>('/repositories/github');
  }

  async resolveGitHubRepository(name: string, cloneUrl: string, defaultBranch = 'main'): Promise<RepositorySummary> {
    return this.request<RepositorySummary>('/repositories/resolve-github', {
      method: 'POST',
      body: JSON.stringify({ name, clone_url: cloneUrl, default_branch: defaultBranch }),
    });
  }

  async createRepository(name: string, cloneUrl: string, defaultBranch = 'main'): Promise<RepositorySummary> {
    return this.request<RepositorySummary>('/repositories', {
      method: 'POST',
      body: JSON.stringify({ name, clone_url: cloneUrl, default_branch: defaultBranch }),
    });
  }

  async deleteRepository(repositoryId: string): Promise<void> {
    const headers: Record<string, string> = {};
    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    const response = await fetch(`${API_BASE_URL}/repositories/${repositoryId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`Failed to delete repository (HTTP ${response.status})`);
    }
  }

  // Reports
  async getJsonReport(analysisId: string): Promise<NexusReportData> {
    if (!analysisId || typeof analysisId !== 'string' || analysisId.startsWith('[object')) {
      throw new Error(`Invalid analysis ID provided to getJsonReport: ${String(analysisId)}`);
    }
    try {
      return await this.request<NexusReportData>(`/reports/${analysisId}/json`);
    } catch (err: any) {
      console.error('[Nexus API] Error fetching JSON report:', {
        endpoint: `${API_BASE_URL}/reports/${analysisId}/json`,
        analysisId,
        error: err.message,
      });
      throw err;
    }
  }

  async getMarkdownReport(analysisId: string): Promise<string> {
    if (!analysisId || typeof analysisId !== 'string' || analysisId.startsWith('[object')) {
      throw new Error(`Invalid analysis ID provided to getMarkdownReport: ${String(analysisId)}`);
    }
    const headers: Record<string, string> = {};
    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    const endpointUrl = `${API_BASE_URL}/reports/${analysisId}/markdown`;
    const response = await fetch(endpointUrl, {
      headers,
    });
    if (!response.ok) {
      let rawBody = '';
      try {
        rawBody = await response.text();
      } catch {
        // ignore
      }
      console.error('[Nexus API] Error fetching markdown report:', {
        endpoint: endpointUrl,
        status: response.status,
        responseBody: rawBody,
        analysisId,
      });
      throw new Error(`Failed to fetch markdown report: ${response.status}${rawBody ? ` (${rawBody})` : ''}`);
    }
    return response.text();
  }
}

export const api = new ApiService();

export function formatReportDataToMarkdown(reportData: NexusReportData): string {
  if (!reportData) {
    return "# Nexus Documentation Truth Report\n\nNo report data available.";
  }

  const meta = reportData.metadata;
  const sumry = reportData.summary;
  const finds = reportData.findings;
  const evSumry = reportData.evidence_summary || [];

  const lines: string[] = [];
  lines.push("# Nexus Documentation Truth Report");
  lines.push("");
  lines.push("## Report Metadata");
  lines.push(`- **Repository Name**: ${meta.repository_name}`);
  lines.push(`- **Repository URL**: ${meta.repository_url}`);
  lines.push(`- **Commit SHA**: ${meta.commit_sha || 'N/A'}`);
  lines.push(`- **Analysis Run ID**: \`${meta.analysis_id}\``);
  lines.push(`- **Analysis Timestamp**: ${meta.analysis_timestamp}`);
  lines.push(`- **Total Files Scanned**: ${meta.total_files}`);
  lines.push(`- **Documentation Files Scanned**: ${meta.documentation_files}`);
  lines.push(`- **Analysis Status**: ${meta.analysis_status}`);
  lines.push("");

  lines.push("## Verification Summary");
  lines.push(`- **Nexus Truth Score**: **${sumry.truth_score} / 100**`);
  lines.push(`- **Total Claims Extracted**: ${sumry.total_claims}`);
  lines.push(`- **Verified Claims**: ${sumry.verified_count}`);
  lines.push(`- **Uncertain Claims**: ${sumry.uncertain_count}`);
  lines.push(`- **Contradicted Claims**: ${sumry.contradicted_count}`);
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push("## Verdict Details");
  lines.push("");

  // 1. Contradicted Findings
  lines.push("### Contradicted Findings");
  if (!finds.contradicted || finds.contradicted.length === 0) {
    lines.push("\n*No contradictions were detected in this analysis.*\n");
  } else {
    finds.contradicted.forEach((f, idx) => {
      lines.push(`#### ${idx + 1}. ${f.title}`);
      lines.push(`- **Category**: ${f.category}`);
      lines.push(`- **Documentation Path**: \`${f.source_file}:${f.line_number || 'N/A'}\``);
      lines.push(`- **Original Text**: *"${(f.original_text || '').trim()}"*`);
      lines.push(`- **Verdict Confidence**: ${f.truth_confidence.toFixed(2)}`);
      lines.push(`- **Explanation**: ${f.explanation}`);
      if (f.evidence && f.evidence.length > 0) {
        lines.push("- **Discovered Code Evidence**:");
        f.evidence.forEach((e) => {
          lines.push(`  - **[${e.relationship}]** \`[${e.source_type}]\` \`${e.file_path}:${e.line_number || 'N/A'}\``);
          lines.push(`    *Discovery*: ${e.discovery_method} (Confidence: ${e.confidence.toFixed(2)})`);
          if (e.content) {
            const preview = e.content.replace(/\n/g, " ");
            lines.push(`    *Preview*: \`${preview}\``);
          }
        });
      }
      lines.push("");
    });
  }

  // 2. Uncertain Findings
  lines.push("### Uncertain Findings");
  if (!finds.uncertain || finds.uncertain.length === 0) {
    lines.push("\n*No uncertain claims found.*\n");
  } else {
    finds.uncertain.forEach((f, idx) => {
      lines.push(`#### ${idx + 1}. ${f.title}`);
      lines.push(`- **Category**: ${f.category}`);
      lines.push(`- **Documentation Path**: \`${f.source_file}:${f.line_number || 'N/A'}\``);
      lines.push(`- **Original Text**: *"${(f.original_text || '').trim()}"*`);
      lines.push(`- **Verdict Confidence**: ${f.truth_confidence.toFixed(2)}`);
      lines.push(`- **Explanation**: ${f.explanation}`);
      if (f.missing_evidence_types && f.missing_evidence_types.length > 0) {
        lines.push(`- **Missing Evidence Indicators**: Expected \`${f.missing_evidence_types.join(', ')}\` but was absent.`);
      }
      if (f.evidence && f.evidence.length > 0) {
        lines.push("- **Retrieved Contextual Evidence**:");
        f.evidence.forEach((e) => {
          lines.push(`  - **[${e.relationship}]** \`[${e.source_type}]\` \`${e.file_path}:${e.line_number || 'N/A'}\``);
          lines.push(`    *Discovery*: ${e.discovery_method} (Confidence: ${e.confidence.toFixed(2)})`);
          if (e.content) {
            const preview = e.content.replace(/\n/g, " ");
            lines.push(`    *Preview*: \`${preview}\``);
          }
        });
      }
      lines.push("");
    });
  }

  // 3. Verified Findings
  lines.push("### Verified Findings");
  if (!finds.verified || finds.verified.length === 0) {
    lines.push("\n*No verified claims found.*\n");
  } else {
    finds.verified.forEach((f, idx) => {
      lines.push(`#### ${idx + 1}. ${f.title}`);
      lines.push(`- **Category**: ${f.category}`);
      lines.push(`- **Documentation Path**: \`${f.source_file}:${f.line_number || 'N/A'}\``);
      lines.push(`- **Original Text**: *"${(f.original_text || '').trim()}"*`);
      lines.push(`- **Verdict Confidence**: ${f.truth_confidence.toFixed(2)}`);
      lines.push(`- **Explanation**: ${f.explanation}`);
      if (f.evidence && f.evidence.length > 0) {
        lines.push("- **Retrieved Code Evidence**:");
        f.evidence.forEach((e) => {
          lines.push(`  - **[${e.relationship}]** \`[${e.source_type}]\` \`${e.file_path}:${e.line_number || 'N/A'}\``);
          lines.push(`    *Discovery*: ${e.discovery_method} (Confidence: ${e.confidence.toFixed(2)})`);
          if (e.content) {
            const preview = e.content.replace(/\n/g, " ");
            lines.push(`    *Preview*: \`${preview}\``);
          }
        });
      }
      lines.push("");
    });
  }

  lines.push("---");
  lines.push("");
  lines.push("## Evidence Summary Matrix");
  lines.push("");
  lines.push("| Source Type | Discovery Method | Supporting | Contradicting | Contextual |");
  lines.push("| --- | --- | :---: | :---: | :---: |");
  if (evSumry.length === 0) {
    lines.push("| [None] | [None] | 0 | 0 | 0 |");
  } else {
    evSumry.forEach((es) => {
      lines.push(`| ${es.source_type} | ${es.discovery_method} | ${es.supporting} | ${es.contradicting} | ${es.contextual} |`);
    });
  }
  lines.push("");

  return lines.join("\n");
}
