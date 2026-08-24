import { useEffect, useRef, useState } from 'react';

export default function NexusReport() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
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

  // Smooth count-up animation for Truth Score
  useEffect(() => {
    if (!isRevealed) return;

    // Respect user prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setScore(75);
      return;
    }

    let start = 0;
    const end = 75;
    const duration = 1200; // 1.2 seconds total duration
    const stepTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      setScore(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isRevealed]);

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full bg-white transition-colors duration-1000 ${isRevealed ? 'revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 md:py-24">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          {/* Eyebrow badge matching established style */}
          <span 
            className={`inline-block bg-nexus-50 text-nexus-700 border border-nexus-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase mb-6 transition-all duration-700 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            THE NEXUS REPORT
          </span>

          {/* Heading */}
          <h2 
            className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight transition-all duration-700 delay-100 transform break-words ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            One Repository. <br />
            One <span className="bg-gradient-to-r from-nexus-600 to-nexus-400 bg-clip-text text-transparent">Source of Truth.</span>
          </h2>

          {/* Description */}
          <p 
            className={`text-sm md:text-base text-text-secondary mt-6 leading-relaxed transition-all duration-700 delay-200 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Nexus turns repository evidence into a structured report showing what your documentation gets right, what remains uncertain, and where reality differs from the docs.
          </p>
        </div>

        {/* Main Product Report Visualization Container */}
        <div 
          className={`bg-white border border-border/80 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-nexus-600/5 ring-1 ring-nexus-200/50 max-w-5xl mx-auto transition-all duration-1000 transform ${
            isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } delay-300`}
        >
          {/* Report Sub-Header */}
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-nexus-600 animate-pulse"></span>
              <span className="text-xs font-bold text-text-primary tracking-wide">GradScope Report</span>
              <span className="text-[10px] text-text-muted">Analysis #7</span>
            </div>

            {/* Analysis Complete Badge with subtle fade delay */}
            <div 
              className={`flex items-center space-x-1 bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-2xs transition-opacity duration-700 delay-[1400ms] ${
                isRevealed ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>ANALYSIS COMPLETE</span>
            </div>
          </div>

          {/* Inner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Column 1: Score & Breakdown */}
            <div className="space-y-6">
              {/* 1. TRUTH SCORE */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4.5">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">Truth Score</span>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-extrabold text-text-primary tabular-nums">{score}</span>
                  <span className="text-sm font-semibold text-text-muted ml-1">/ 100</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-nexus-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: isRevealed ? '75%' : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[9px] font-bold text-text-muted uppercase tracking-wider">
                  <span>Verification Index</span>
                  <span className="text-nexus-600">75%</span>
                </div>
              </div>

              {/* 2. VERIFICATION BREAKDOWN */}
              <div 
                className={`bg-slate-50/50 border border-slate-100 rounded-xl p-4.5 space-y-3.5 transition-all duration-700 transform delay-500 ${
                  isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block border-b pb-1.5 border-slate-200">Verification Breakdown</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {/* Verified */}
                  <div className="text-center bg-white border border-green-150 rounded-lg p-2 shadow-2xs">
                    <span className="text-lg font-extrabold text-verified block leading-none">36</span>
                    <span className="text-[8px] font-semibold text-text-muted block mt-1 uppercase">Verified</span>
                  </div>

                  {/* Uncertain */}
                  <div className="text-center bg-white border border-amber-150 rounded-lg p-2 shadow-2xs">
                    <span className="text-lg font-extrabold text-uncertain block leading-none">37</span>
                    <span className="text-[8px] font-semibold text-text-muted block mt-1 uppercase">Uncertain</span>
                  </div>

                  {/* Contradicted */}
                  <div className="text-center bg-white border border-red-150 rounded-lg p-2 shadow-2xs">
                    <span className="text-lg font-extrabold text-contradicted block leading-none">0</span>
                    <span className="text-[8px] font-semibold text-text-muted block mt-1 uppercase">Failed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Evidence Summary */}
            <div 
              className={`bg-slate-50/50 border border-slate-100 rounded-xl p-4.5 flex flex-col transition-all duration-700 transform delay-700 ${
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-4 border-b pb-1.5 border-slate-200">Evidence Summary</span>
              
              <div className="space-y-3.5 flex-1 flex flex-col justify-center">
                {/* Source Code */}
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary mb-1">
                    <span>SOURCE CODE</span>
                    <span>48</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-nexus-600 rounded-full transition-all duration-1000 ease-out delay-500" 
                      style={{ width: isRevealed ? '60%' : '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Configuration */}
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary mb-1">
                    <span>CONFIGURATION</span>
                    <span>17</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-nexus-600 rounded-full transition-all duration-1000 ease-out delay-600" 
                      style={{ width: isRevealed ? '22%' : '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Documentation */}
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary mb-1">
                    <span>DOCUMENTATION</span>
                    <span>6</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-nexus-600 rounded-full transition-all duration-1000 ease-out delay-700" 
                      style={{ width: isRevealed ? '8%' : '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Tests */}
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary mb-1">
                    <span>TESTS</span>
                    <span>5</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-nexus-600 rounded-full transition-all duration-1000 ease-out delay-800" 
                      style={{ width: isRevealed ? '6%' : '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Dependencies */}
                <div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary mb-1">
                    <span>DEPENDENCIES</span>
                    <span>4</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-nexus-600 rounded-full transition-all duration-1000 ease-out delay-900" 
                      style={{ width: isRevealed ? '5%' : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Recent Findings */}
            <div 
              className={`bg-slate-50/50 border border-slate-100 rounded-xl p-4.5 transition-all duration-700 transform delay-[900ms] ${
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-3 border-b pb-1.5 border-slate-200">Recent Findings</span>
              
              <div className="flex flex-col space-y-2.5">
                {/* Finding 1 */}
                <div 
                  className={`bg-white border border-slate-100 rounded-lg p-2 shadow-3xs flex items-start space-x-2 transition-all duration-500 delay-[1000ms] transform ${
                    isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-verified mt-1.5 shrink-0"></span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold text-text-primary truncate">&ldquo;GET /api/courses returns available courses.&rdquo;</p>
                    <div className="flex justify-between text-[7px] text-text-muted font-mono mt-1">
                      <span>calculator.py:109</span>
                      <span>Conf 0.95</span>
                    </div>
                  </div>
                </div>

                {/* Finding 2 */}
                <div 
                  className={`bg-white border border-slate-100 rounded-lg p-2 shadow-3xs flex items-start space-x-2 transition-all duration-500 delay-[1100ms] transform ${
                    isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-verified mt-1.5 shrink-0"></span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold text-text-primary truncate">&ldquo;Run npm run dev to start the frontend.&rdquo;</p>
                    <div className="flex justify-between text-[7px] text-text-muted font-mono mt-1">
                      <span>package.json:12</span>
                      <span>Conf 0.93</span>
                    </div>
                  </div>
                </div>

                {/* Finding 3 */}
                <div 
                  className={`bg-white border border-slate-100 rounded-lg p-2 shadow-3xs flex items-start space-x-2 transition-all duration-500 delay-[1200ms] transform ${
                    isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-uncertain mt-1.5 shrink-0"></span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold text-text-primary truncate">&ldquo;Database falls back to SQLite locally.&rdquo;</p>
                    <div className="flex justify-between text-[7px] text-text-muted font-mono mt-1">
                      <span>backend/db/config.py:34</span>
                      <span>Conf 0.67</span>
                    </div>
                  </div>
                </div>

                {/* Finding 4 */}
                <div 
                  className={`bg-white border border-slate-100 rounded-lg p-2 shadow-3xs flex items-start space-x-2 transition-all duration-500 delay-[1300ms] transform ${
                    isRevealed ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-uncertain mt-1.5 shrink-0"></span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold text-text-primary truncate">&ldquo;Support for mathematical indexing features.&rdquo;</p>
                    <div className="flex justify-between text-[7px] text-text-muted font-mono mt-1">
                      <span>docs/features.md:88</span>
                      <span>Conf 0.63</span>
                    </div>
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
