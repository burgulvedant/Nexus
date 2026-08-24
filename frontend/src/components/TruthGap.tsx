import { useEffect, useRef, useState } from 'react';

export default function TruthGap() {
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
      className={`relative w-full border-t border-border/60 bg-[#f8fafc]/30 transition-colors duration-1000 ${isRevealed ? 'revealed' : ''}`}
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
            WHY NEXUS
          </span>

          {/* Heading */}
          <h2 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight text-center transition-all duration-700 delay-100 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Documentation can say one thing. Your software can say <span className="bg-gradient-to-r from-nexus-600 to-nexus-400 bg-clip-text text-transparent">another.</span>
          </h2>

          {/* Description */}
          <p 
            className={`text-sm md:text-base text-text-secondary mt-6 leading-relaxed transition-all duration-700 delay-200 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Software changes constantly. Documentation doesn’t always keep up. Nexus compares documented claims against evidence from your repository to determine what your software actually does.
          </p>
        </div>

        {/* 3-Column Progression Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* CARD 01 - CLAIM */}
          <div 
            className={`bg-white border border-border/80 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-100`}
          >
            <div>
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest block mb-2">01 / CLAIM</span>
              <h3 className="text-base font-bold text-text-primary mb-4">What the documentation says</h3>
              
              {/* Visual Doc Snippet */}
              <div className="h-44 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 overflow-hidden mb-6">
                <div className="bg-white border border-border rounded-lg p-3.5 w-full shadow-2xs font-mono text-[9px] leading-relaxed relative">
                  <div className="text-text-muted text-[8px] border-b border-border pb-1.5 mb-2 font-sans font-semibold">API Documentation</div>
                  <div className="text-text-primary font-bold">GET /api/courses</div>
                  <div className="h-[1px] bg-slate-100 my-1.5 w-1/3"></div>
                  <div className="text-text-secondary font-sans italic my-1.5 bg-nexus-50/30 border border-nexus-100/50 rounded px-1.5 py-0.5 inline-block">
                    &ldquo;Returns all available courses.&rdquo;
                  </div>
                  <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-slate-50">
                    <span className="text-[7px] text-text-muted">SOURCE: README.md</span>
                    <span className="bg-nexus-50 text-nexus-600 font-sans px-1.5 py-0.5 rounded text-[8px] font-bold">
                      CLAIM DETECTED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mt-auto">
              Nexus starts with the claims your documentation makes about the software.
            </p>
          </div>

          {/* CARD 02 - EVIDENCE */}
          <div 
            className={`bg-white border border-border/80 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-200`}
          >
            <div>
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest block mb-2">02 / EVIDENCE</span>
              <h3 className="text-base font-bold text-text-primary mb-4">What the repository actually shows</h3>
              
              {/* Visual Flow chart */}
              <div className="h-44 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-3 overflow-hidden mb-6 text-[8px] font-medium text-text-secondary space-y-1 relative">
                
                {/* Flow steps */}
                <div className="bg-nexus-50 border border-nexus-150 text-nexus-700 px-2 py-0.5 rounded text-[9px] font-bold">
                  CLAIM: GET /api/courses
                </div>
                
                <svg className="w-4 h-4 text-nexus-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                </svg>

                <div className="bg-white border border-border px-2 py-0.5 rounded font-mono shadow-3xs flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-400"></span>
                  <span>SOURCE CODE &bull; calculator.py:109</span>
                </div>

                <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                <div className="bg-white border border-border px-2 py-0.5 rounded font-mono shadow-3xs flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-400"></span>
                  <span>TESTS &bull; courses.test.ts</span>
                </div>

                <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                <div className="bg-white border border-border px-2 py-0.5 rounded font-mono shadow-3xs flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-400"></span>
                  <span>CONFIG &bull; api/routes.ts</span>
                </div>

                <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>

                <div className="bg-nexus-600 text-white font-bold px-2 py-0.5 rounded-full text-[7px] uppercase tracking-wider shadow-2xs">
                  EVIDENCE FOUND
                </div>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mt-auto">
              Nexus traces each claim through source code, tests, configuration, APIs, dependencies, and other repository evidence.
            </p>
          </div>

          {/* CARD 03 - VERDICT */}
          <div 
            className={`bg-white border border-border/80 rounded-2xl p-6 flex flex-col justify-between min-h-[440px] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } delay-300`}
          >
            <div>
              <span className="text-[10px] font-bold text-nexus-500 uppercase tracking-widest block mb-2">03 / VERDICT</span>
              <h3 className="text-base font-bold text-text-primary mb-4">A clear answer</h3>
              
              {/* Visual Verdict Badges */}
              <div className="h-44 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl p-4 gap-2.5 mb-6">
                <div className="flex items-center space-x-2 bg-verified-bg border border-green-200 px-4 py-2 rounded-xl text-xs font-bold text-verified w-44 shadow-2xs hover:scale-102 transition duration-200">
                  <svg className="h-4 w-4 text-verified" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>✓ VERIFIED</span>
                </div>
                <div className="flex items-center space-x-2 bg-uncertain-bg border border-amber-200 px-4 py-2 rounded-xl text-xs font-bold text-uncertain w-44 shadow-2xs hover:scale-102 transition duration-200">
                  <span className="h-4 w-4 flex items-center justify-center text-xs font-black">?</span>
                  <span>? UNCERTAIN</span>
                </div>
                <div className="flex items-center space-x-2 bg-contradicted-bg border border-red-200 px-4 py-2 rounded-xl text-xs font-bold text-contradicted w-44 shadow-2xs hover:scale-102 transition duration-200">
                  <svg className="h-4 w-4 text-contradicted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>× CONTRADICTED</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mt-auto">
              Every investigated claim receives a transparent verification status based on the evidence available.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
