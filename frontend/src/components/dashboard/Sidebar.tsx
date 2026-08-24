interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNewAnalysis: () => void;
  onHome?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  onNewAnalysis,
  onHome,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const mainNav = [
    { id: 'home', label: 'Home', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    )},
    { id: 'repositories', label: 'Repositories', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )},
    { id: 'new-analysis', label: 'New Analysis', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )},
  ];

  const insightsNav = [
    { id: 'reports', label: 'Reports', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'evidence', label: 'Evidence Explorer', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    { id: 'history', label: 'History', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  const settingsNav = [
    { id: 'settings', label: 'Settings', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  const renderNavSection = (items: typeof mainNav, isMobile: boolean) => (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = currentTab === item.id;
        const handleClick = () => {
          if (item.id === 'home' && onHome) {
            onHome();
          } else if (item.id === 'new-analysis') {
            onNewAnalysis();
          } else {
            onSelectTab(item.id);
          }
          if (isMobile && onCloseMobile) {
            onCloseMobile();
          }
        };

        return (
          <button
            key={item.id}
            onClick={handleClick}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
              active
                ? 'bg-nexus-50 text-nexus-700 shadow-2xs'
                : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
            }`}
          >
            <span className={active ? 'text-nexus-600' : 'text-text-muted'}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  const renderNavContent = (isMobile: boolean) => (
    <div className="space-y-6">
      {/* MAIN */}
      <div>
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2.5 mb-2 block">
          MAIN
        </span>
        {renderNavSection(mainNav, isMobile)}
      </div>

      {/* INSIGHTS */}
      <div>
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2.5 mb-2 block">
          INSIGHTS
        </span>
        {renderNavSection(insightsNav, isMobile)}
      </div>

      {/* SETTINGS */}
      <div>
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider px-2.5 mb-2 block">
          SETTINGS
        </span>
        {renderNavSection(settingsNav, isMobile)}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (Unchanged stationary left rail) */}
      <aside className="hidden md:flex md:w-[230px] lg:w-[240px] shrink-0 bg-white border-r border-border/80 flex-col p-4 sm:p-5 h-screen overflow-y-auto">
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

          {renderNavContent(false)}
        </div>
      </aside>

      {/* 2. Mobile Navigation Drawer Overlay (Visible on < md when open) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
          />
          {/* Slide-out Drawer */}
          <aside className="relative w-[280px] max-w-[85vw] bg-white h-full flex flex-col p-5 overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
              <div className="flex items-center space-x-2.5">
                <svg className="h-6 w-6 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
                <span className="font-bold tracking-wide text-text-primary text-lg">NEXUS</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close navigation menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
