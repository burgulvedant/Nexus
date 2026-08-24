import { useEffect, useRef } from 'react';

export default function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const sampleFindings = [
    {
      id: '1',
      title: 'PostgreSQL 15+ database requirement with pgvector extension',
      quote: 'Requires PostgreSQL 15+ with pgvector extension for dense embedding storage.',
      verdict: 'VERIFIED',
      confidence: 96,
      source: 'docs/setup.md:14',
      evidenceCount: 4,
    },
    {
      id: '2',
      title: 'Automatic background synchronization interval is 5 minutes',
      quote: 'Sync engine polls every 300 seconds for changed workspace files.',
      verdict: 'UNCERTAIN',
      confidence: 64,
      source: 'docs/architecture.md:42',
      evidenceCount: 2,
    },
    {
      id: '3',
      title: 'JWT access token expiry configured for 24 hours',
      quote: 'User sessions expire after 86,400 seconds unless refreshed.',
      verdict: 'VERIFIED',
      confidence: 92,
      source: 'docs/security.md:28',
      evidenceCount: 3,
    },
  ];

  return (
    <section className="pt-2 md:pt-4 pb-8 md:pb-16 px-3 sm:px-4 md:px-6 max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          ref={containerRef}
          className="product-reveal bg-[#f1f5f9] rounded-2xl md:rounded-3xl border border-border shadow-2xl shadow-nexus-600/5 ring-1 ring-nexus-200/50 overflow-hidden flex min-h-[850px] font-sans antialiased text-text-primary pointer-events-none select-none cursor-default max-w-full"
        >
          {/* 1. LEFT SIDEBAR (Matching finalized Sidebar structure exactly) */}
          <aside className="hidden lg:flex flex-col w-[230px] shrink-0 bg-white border-r border-border/80 p-4 sm:p-5">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center space-x-2.5 px-2 py-1">
                <svg className="h-6 w-6 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
                <span className="font-bold tracking-wide text-text-primary text-lg">NEXUS</span>
              </div>

              {/* MAIN */}
              <div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2.5 mb-2 block">
                  MAIN
                </span>
                <nav className="space-y-1">
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-nexus-50 text-nexus-700 font-semibold text-sm shadow-2xs">
                    <svg className="w-4 h-4 text-nexus-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span>Repositories</span>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Analysis</span>
                  </div>
                </nav>
              </div>

              {/* INSIGHTS */}
              <div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2.5 mb-2 block">
                  INSIGHTS
                </span>
                <nav className="space-y-1">
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Reports</span>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Evidence Explorer</span>
                  </div>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>History</span>
                  </div>
                </nav>
              </div>

              {/* SETTINGS */}
              <div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2.5 mb-2 block">
                  SETTINGS
                </span>
                <nav className="space-y-1">
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-semibold text-text-secondary hover:bg-slate-50">
                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </div>
                </nav>
              </div>
            </div>
          </aside>

          {/* 2. MAIN DASHBOARD CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Finalized Dashboard Header */}
            <header className="bg-white border-b border-border/80 px-6 sm:px-8 py-3.5 sm:py-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-text-muted mb-2.5">
                <div className="flex items-center space-x-2 font-medium">
                  <span>Home</span>
                  <span>&rsaquo;</span>
                  <span>Repositories</span>
                  <span>&rsaquo;</span>
                  <span className="text-text-primary font-semibold">gradscope</span>
                  <span>&rsaquo;</span>
                  <span className="text-text-secondary font-mono">Analysis #af264a</span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-nexus-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    VB
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3.5">
                    <div className="inline-flex items-center space-x-2 text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                      <span>gradscope</span>
                      <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-green-50 text-green-700 border border-green-200">
                      Completed
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-text-muted">
                    <span className="flex items-center space-x-1.5 font-medium text-text-secondary">
                      <svg className="w-4 h-4 text-text-muted shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>burgulvedant/gradscope.git</span>
                    </span>
                    <span>Branch: <strong className="font-semibold text-text-secondary">main</strong></span>
                    <span>Commit: <strong className="font-mono text-text-secondary">1a3471e</strong></span>
                    <span>Analysis ID: <strong className="font-mono text-text-secondary">NEXUS-af264abc</strong></span>
                    <span>Completed: <strong className="font-semibold text-text-secondary">Aug 23, 2026, 2:04 PM</strong></span>
                  </div>
                </div>
              </div>
            </header>

            {/* Workspace Area */}
            <main className="p-4 sm:p-5 md:p-6 w-full space-y-4">
              {/* Metric Cards (5 Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
                {/* 1. TRUTH SCORE */}
                <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">TRUTH SCORE</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-nexus-500"></span>
                  </div>
                  <div className="my-2">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">75</span>
                      <span className="text-sm font-bold text-text-muted">/ 100</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-nexus-600 h-full rounded-full w-[75%]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-text-muted font-medium">
                      <span>VERIFICATION INDEX</span>
                      <span className="font-bold text-nexus-600">75%</span>
                    </div>
                  </div>
                </div>

                {/* 2. VERIFIED */}
                <div className="bg-white border border-green-200/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">VERIFIED</span>
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">✓</span>
                  </div>
                  <div className="my-2">
                    <span className="text-4xl sm:text-5xl font-black text-green-600 tracking-tight">36</span>
                  </div>
                  <div className="text-xs text-green-700 font-medium">
                    <strong>49.3%</strong> OF TOTAL CLAIMS
                  </div>
                </div>

                {/* 3. UNCERTAIN */}
                <div className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">UNCERTAIN</span>
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">?</span>
                  </div>
                  <div className="my-2">
                    <span className="text-4xl sm:text-5xl font-black text-amber-500 tracking-tight">37</span>
                  </div>
                  <div className="text-xs text-amber-700 font-medium">
                    <strong>50.7%</strong> OF TOTAL CLAIMS
                  </div>
                </div>

                {/* 4. CONTRADICTED */}
                <div className="bg-white border border-red-200/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider">CONTRADICTED</span>
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">✗</span>
                  </div>
                  <div className="my-2">
                    <span className="text-4xl sm:text-5xl font-black text-red-600 tracking-tight">0</span>
                  </div>
                  <div className="text-xs text-red-700 font-medium">
                    <strong>0.0%</strong> OF TOTAL CLAIMS
                  </div>
                </div>

                {/* 5. TOTAL CLAIMS */}
                <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">TOTAL CLAIMS</span>
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-text-secondary flex items-center justify-center text-xs font-bold">#</span>
                  </div>
                  <div className="my-2">
                    <span className="text-4xl sm:text-5xl font-black text-text-primary tracking-tight">73</span>
                  </div>
                  <div className="text-xs text-text-muted font-medium">
                    EXTRACTED DOCUMENTATION CLAIMS
                  </div>
                </div>
              </div>

              {/* ROW 1: 7:5 Grid (Recent Findings + Evidence Summary & Analysis Info) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                {/* Left Column: Recent Findings (7 cols) */}
                <div className="lg:col-span-7 flex flex-col bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-text-primary">Recent Findings</h3>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center space-x-2 border-b border-border/60 pb-2 mb-3 overflow-x-auto max-w-full">
                      <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-nexus-50 text-nexus-700 shrink-0">
                        All Findings (73)
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-text-muted shrink-0">
                        Verified (36)
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-text-muted shrink-0">
                        Uncertain (37)
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-text-muted shrink-0">
                        Contradicted (0)
                      </span>
                    </div>

                    {/* Findings list */}
                    <div className="space-y-2.5">
                      {sampleFindings.map((f) => (
                        <div key={f.id} className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-text-primary">{f.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase border ${
                              f.verdict === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {f.verdict}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed font-mono">
                            "{f.quote}"
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-border/40 font-mono">
                            <span>{f.source}</span>
                            <span>{f.evidenceCount} evidence pieces</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 text-right">
                    <span className="text-xs font-bold text-nexus-600 hover:text-nexus-700 transition">
                      View all 73 findings &rarr;
                    </span>
                  </div>
                </div>

                {/* Right Column: Evidence Summary & Analysis Information (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  {/* Evidence Summary Card */}
                  <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
                    <div className="mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-text-primary">Evidence Summary</h3>
                      <p className="text-xs text-text-muted mt-0.5">Observed across repository files</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-[11px] font-bold text-text-muted uppercase border-b border-border/60 pb-1.5">
                            <th className="py-1.5 font-bold">SOURCE</th>
                            <th className="py-1.5 text-center font-bold text-green-700">SUPP</th>
                            <th className="py-1.5 text-center font-bold text-red-600">CONT</th>
                            <th className="py-1.5 text-center font-bold text-text-muted">CTX</th>
                            <th className="py-1.5 text-right font-bold">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 font-mono">
                          <tr>
                            <td className="py-2 font-sans font-semibold text-text-secondary">Source Code</td>
                            <td className="py-2 text-center text-green-700 font-bold">24</td>
                            <td className="py-2 text-center text-red-600">0</td>
                            <td className="py-2 text-center text-text-muted">8</td>
                            <td className="py-2 text-right font-bold text-text-primary">32</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-sans font-semibold text-text-secondary">Configuration</td>
                            <td className="py-2 text-center text-green-700 font-bold">12</td>
                            <td className="py-2 text-center text-red-600">0</td>
                            <td className="py-2 text-center text-text-muted">3</td>
                            <td className="py-2 text-right font-bold text-text-primary">15</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-sans font-semibold text-text-secondary">Dependencies</td>
                            <td className="py-2 text-center text-green-700 font-bold">8</td>
                            <td className="py-2 text-center text-red-600">0</td>
                            <td className="py-2 text-center text-text-muted">1</td>
                            <td className="py-2 text-right font-bold text-text-primary">9</td>
                          </tr>
                          <tr className="font-bold bg-slate-50/80">
                            <td className="py-2 font-sans text-text-primary">Total</td>
                            <td className="py-2 text-center text-green-700">44</td>
                            <td className="py-2 text-center text-red-600">0</td>
                            <td className="py-2 text-center text-text-muted">12</td>
                            <td className="py-2 text-right text-nexus-600">56</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analysis Information Card */}
                  <div className="bg-white border border-border/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
                    <div className="mb-3">
                      <h3 className="text-base sm:text-lg font-bold text-text-primary">Analysis Information</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-text-muted uppercase tracking-wider block">FILES SCANNED</span>
                        <span className="text-base font-black text-text-primary mt-0.5 block">64</span>
                      </div>
                      <div>
                        <span className="font-bold text-text-muted uppercase tracking-wider block">SCANNER STATUS</span>
                        <span className="text-xs font-bold text-green-700 mt-0.5 flex items-center space-x-1">
                          <span>✓</span>
                          <span>Completed</span>
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-text-muted uppercase tracking-wider block">DOCUMENTATION FILES</span>
                        <span className="text-base font-black text-text-primary mt-0.5 block">3</span>
                      </div>
                      <div>
                        <span className="font-bold text-text-muted uppercase tracking-wider block">VERIFIER STATUS</span>
                        <span className="text-xs font-bold text-green-700 mt-0.5 flex items-center space-x-1">
                          <span>✓</span>
                          <span>Completed</span>
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-text-muted uppercase tracking-wider block">LINES OF CODE</span>
                        <span className="text-base font-black text-text-primary mt-0.5 block">24,318</span>
                      </div>
                      <div>
                        <span className="font-bold text-text-muted uppercase tracking-wider block">DURATION</span>
                        <span className="text-xs font-mono font-bold text-text-primary mt-0.5 block">1s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
