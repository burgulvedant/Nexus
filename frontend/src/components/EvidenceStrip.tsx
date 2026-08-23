import type { ReactNode } from 'react';

interface EvidenceItem {
  label: string;
  icon: ReactNode;
}

const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    label: 'DOCUMENTATION',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    label: 'SOURCE CODE',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: 'TESTS',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: 'CONFIGURATION',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    label: 'API SPECIFICATIONS',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: 'DEPENDENCIES',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    label: 'GIT HISTORY',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
    ),
  },
  {
    label: 'RUNTIME',
    icon: (
      <svg className="w-4 h-4 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
];

export default function EvidenceStrip() {
  // Duplicated list for seamless CSS infinite scroll loop
  const displayItems = [...EVIDENCE_ITEMS, ...EVIDENCE_ITEMS];

  return (
    <section className="py-16 md:py-24 overflow-hidden" aria-label="Evidence Sources">
      {/* Title area centered above strip */}
      <div className="text-center mb-12 px-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-3">
          Evidence Sources
        </p>
        <h2 className="text-lg md:text-xl font-semibold text-text-primary">
          Nexus investigates your entire codebase
        </h2>
      </div>

      {/* Scrolling Strip Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left edge fade mask */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-surface-page to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Right edge fade mask */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-surface-page to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Moving Track */}
        <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused]">
          {displayItems.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex-shrink-0 mx-4 md:mx-6 select-none"
            >
              <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-6 py-3 md:px-8 md:py-4 shadow-xs transition-all duration-200 hover:border-nexus-300 hover:shadow-sm">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-nexus-50 text-nexus-600">
                  {item.icon}
                </span>
                <span className="text-sm md:text-base font-semibold tracking-wide text-text-secondary whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
