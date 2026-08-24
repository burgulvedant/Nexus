import { useEffect, useRef, useState } from 'react';

export default function HowItWorks() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full border-t border-b border-border/60 bg-white transition-colors duration-1000 ${isRevealed ? 'revealed' : ''}`}
    >
      {/* Inline styles for modular animations */}
      <style>{`
        @keyframes drawDashedPath {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes subtleHighlight {
          0% { background-color: rgba(59, 130, 246, 0); border-color: rgba(59, 130, 246, 0); }
          100% { background-color: rgba(59, 130, 246, 0.06); border-color: rgba(147, 197, 253, 0.5); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }
        .anim-dash-line {
          stroke-dasharray: 6;
          animation: drawDashedPath 2s linear infinite;
        }
        .anim-highlight {
          border-width: 1px;
          border-style: solid;
          border-color: transparent;
        }
        .revealed .anim-highlight {
          animation: subtleHighlight 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
        }
        .anim-glow {
          animation: pulseGlow 4s infinite ease-in-out;
        }
      `}</style>

      {/* Centered bounding wrapper matching the navbar/dashboard max-w-7xl structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 md:py-24">
        
        {/* Title area */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span 
            className={`inline-block bg-nexus-50 text-nexus-700 border border-nexus-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase mb-6 transition-all duration-700 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            HOW NEXUS WORKS
          </span>
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight transition-all duration-700 delay-100 transform break-words ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            From Documentation to <span className="bg-gradient-to-r from-nexus-600 to-nexus-400 bg-clip-text text-transparent">Verified Truth.</span>
          </h2>
          <p 
            className={`text-sm md:text-base text-text-secondary mt-6 leading-relaxed transition-all duration-700 delay-200 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Nexus traces what your documentation claims, finds evidence across your repository, and verifies whether those claims match what your software actually does.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* CARD 01 - CONNECT */}
          <div 
            className={`bg-white border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[380px] shadow-xs hover:shadow-md transition-all duration-500 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-100`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest">01 / Connect</span>
              <h3 className="text-base font-bold text-text-primary">Connect Your Repository</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Connect a public GitHub repository and give Nexus the codebase it needs to investigate.
              </p>
            </div>

            {/* Visual */}
            <div className="h-40 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl relative overflow-hidden mt-6">
              {/* GitHub Node */}
              <div className="flex items-center space-x-1.5 bg-white border border-border rounded-full px-3 py-1 shadow-2xs z-10 text-[10px] font-semibold text-text-primary">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </div>

              {/* Connecting Dotted Line */}
              <svg className="w-8 h-10 my-0.5" viewBox="0 0 32 40" fill="none">
                <path d="M16 0v40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="anim-dash-line" />
              </svg>

              {/* Connected repo Node */}
              <div className="bg-white border border-border rounded-lg p-3 w-40 shadow-xs z-10 relative">
                <div className="anim-glow absolute inset-0 bg-nexus-100/20 rounded-lg -z-10"></div>
                <div className="flex items-center justify-between text-[10px] font-bold text-text-primary">
                  <span className="truncate">GradScope</span>
                  <span className="text-text-muted font-normal">main</span>
                </div>
                <div className="flex items-center space-x-1 text-[9px] text-green-600 font-semibold mt-1">
                  <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 02 - EXTRACT CLAIMS */}
          <div 
            className={`bg-white border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[380px] shadow-xs hover:shadow-md transition-all duration-500 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-200`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest">02 / Extract</span>
              <h3 className="text-base font-bold text-text-primary">Extract Documentation Claims</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Nexus identifies meaningful claims made throughout your documentation, specifications, and project files.
              </p>
            </div>

            {/* Visual */}
            <div className="h-40 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 mt-6">
              <div className="bg-white border border-border rounded-lg p-3.5 w-full shadow-2xs font-mono text-[9px] leading-relaxed relative overflow-hidden">
                <div className="text-text-muted text-[8px] border-b border-border pb-1 mb-2 font-sans font-semibold">API Documentation</div>
                <div className="text-nexus-600 font-bold">GET /api/courses</div>
                <div className="h-[1px] bg-slate-100 my-1.5 w-1/2"></div>
                <div className="anim-highlight rounded px-1.5 py-0.5 text-text-primary font-sans italic inline-block mt-0.5">
                  &ldquo;Returns available courses&rdquo;
                </div>
                <div className="flex justify-end mt-2">
                  <span className="bg-nexus-50 text-nexus-600 font-sans border border-nexus-100 px-1.5 py-0.5 rounded text-[8px] font-bold">
                    CLAIM DETECTED &bull; OK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 03 - TRACE EVIDENCE */}
          <div 
            className={`bg-white border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[380px] shadow-xs hover:shadow-md transition-all duration-500 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-300`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest">03 / Trace</span>
              <h3 className="text-base font-bold text-text-primary">Trace the Evidence</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Nexus searches across source code, tests, configuration, API specifications, dependencies, Git history, and runtime evidence.
              </p>
            </div>

            {/* Visual */}
            <div className="h-40 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 mt-6 relative">
              <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 200 140" fill="none">
                {/* Connecting Lines */}
                <path d="M100 35 L45 75 M100 35 L100 75 M100 35 L155 75" stroke="#bfdbfe" strokeWidth="1.5" />
                <path d="M45 90 L100 120 M100 90 L100 120 M155 90 L100 120" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              {/* Nodes */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-nexus-50 border border-nexus-200 text-nexus-600 font-bold px-3 py-1 rounded-full text-[9px] shadow-2xs">
                CLAIM
              </div>

              <div className="absolute top-16 left-3 bg-white border border-border text-text-secondary font-semibold px-2.5 py-1 rounded-md text-[8px] shadow-2xs">
                SOURCE
              </div>
              <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white border border-border text-text-secondary font-semibold px-2.5 py-1 rounded-md text-[8px] shadow-2xs">
                TESTS
              </div>
              <div className="absolute top-16 right-3 bg-white border border-border text-text-secondary font-semibold px-2.5 py-1 rounded-md text-[8px] shadow-2xs">
                CONFIG
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-nexus-600 border border-nexus-600 text-white font-bold px-3 py-1 rounded-full text-[9px] shadow-sm">
                EVIDENCE
              </div>
            </div>
          </div>

          {/* CARD 04 - COMPARE */}
          <div 
            className={`bg-white border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[380px] shadow-xs hover:shadow-md transition-all duration-500 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-400`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest">04 / Compare</span>
              <h3 className="text-base font-bold text-text-primary">Compare Claim vs Reality</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Nexus compares each documented claim against the evidence discovered inside the repository.
              </p>
            </div>

            {/* Visual */}
            <div className="h-40 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 mt-6">
              <div className="flex flex-col space-y-2 w-full">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="bg-white border border-border rounded p-2 flex-1 shadow-2xs min-w-0">
                    <span className="text-[7px] text-text-muted font-bold block mb-0.5">DOCUMENTATION</span>
                    <p className="text-[8px] text-text-secondary truncate font-serif italic">&ldquo;GET /api/courses returns...&rdquo;</p>
                  </div>
                  <span className="text-[8px] font-bold text-text-muted shrink-0 px-1 py-0.5 bg-slate-100 rounded border">VS</span>
                  <div className="bg-white border border-border rounded p-2 flex-1 shadow-2xs min-w-0">
                    <span className="text-[7px] text-nexus-600 font-bold block mb-0.5">SOURCE CODE</span>
                    <p className="text-[8px] font-mono text-text-secondary truncate">@router.get("/courses")</p>
                  </div>
                </div>
                <div className="bg-green-50/60 border border-green-200 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-[9px] font-bold text-green-700 flex items-center space-x-1">
                    <svg className="h-3 w-3 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>MATCH DETECTED</span>
                  </span>
                  <span className="bg-green-600 text-white rounded-full h-3.5 w-3.5 flex items-center justify-center text-[8px] font-bold shadow-xs">
                    &bull;
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 05 - VERDICT */}
          <div 
            className={`bg-white border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[380px] shadow-xs hover:shadow-md transition-all duration-500 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-500`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest">05 / Verdict</span>
              <h3 className="text-base font-bold text-text-primary">Assign a Verdict</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every investigated claim receives a clear verification status based on the available evidence.
              </p>
            </div>

            {/* Visual */}
            <div className="h-40 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 gap-2 mt-6">
              {/* Verdict cards */}
              <div className="flex items-center space-x-1.5 bg-verified-bg border border-green-200 px-3.5 py-1.5 rounded-lg text-[9px] font-bold text-verified w-44 shadow-2xs">
                <svg className="h-3.5 w-3.5 text-verified" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>VERIFIED</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-uncertain-bg border border-amber-200 px-3.5 py-1.5 rounded-lg text-[9px] font-bold text-uncertain w-44 shadow-2xs">
                <span className="h-3.5 w-3.5 flex items-center justify-center text-[10px] font-black">?</span>
                <span>UNCERTAIN</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-contradicted-bg border border-red-200 px-3.5 py-1.5 rounded-lg text-[9px] font-bold text-contradicted w-44 shadow-2xs">
                <svg className="h-3.5 w-3.5 text-contradicted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>CONTRADICTED</span>
              </div>
            </div>
          </div>

          {/* CARD 06 - TRUTH REPORT */}
          <div 
            className={`bg-white border border-border rounded-2xl p-6 flex flex-col justify-between min-h-[380px] shadow-xs hover:shadow-md transition-all duration-500 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-600`}
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest">06 / Report</span>
              <h3 className="text-base font-bold text-text-primary">Generate the Truth Report</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Nexus turns the investigation into a structured report showing what is true, what is uncertain, what is contradicted, and why.
              </p>
            </div>

            {/* Visual */}
            <div className="h-40 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 mt-6">
              <div className="bg-white border border-border rounded-lg p-3.5 w-full shadow-2xs space-y-2.5">
                <div className="flex justify-between items-center text-[8px] font-bold text-text-primary border-b pb-1.5">
                  <span className="text-[7px] text-text-muted">TRUTH SCORE</span>
                  <span>75 / 100</span>
                </div>
                {/* Micro slider */}
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-nexus-600 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[7px] font-semibold text-center text-text-muted leading-tight">
                  <div className="bg-green-50/50 border border-green-100 rounded py-1">
                    <span className="font-bold text-verified block">36</span>
                    <span>Verified</span>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100 rounded py-1">
                    <span className="font-bold text-uncertain block">37</span>
                    <span>Uncertain</span>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 rounded py-1">
                    <span className="font-bold text-contradicted block">0</span>
                    <span>Failed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
