import { useEffect, useRef, useState } from 'react';

interface FinalCTAProps {
  onAnalyzeRepo?: () => void;
  onSeeExampleReport?: () => void;
}

export default function FinalCTA({ onAnalyzeRepo, onSeeExampleReport }: FinalCTAProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [verdictState, setVerdictState] = useState<'analyzing' | 'verified'>('analyzing');
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

  // Trigger state transition from analyzing to verified
  useEffect(() => {
    if (!isRevealed) {
      setVerdictState('analyzing');
      return;
    }

    const timer = setTimeout(() => {
      setVerdictState('verified');
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [isRevealed]);

  return (
    <section 
      ref={sectionRef}
      className={`relative w-full bg-[#f8fafc]/40 py-16 md:py-24 transition-colors duration-1000 ${isRevealed ? 'revealed' : ''}`}
    >
      {/* Self-contained CSS keyframes for abstract background and visual panel */}
      <style>{`
        @keyframes abstractBlob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.15); }
          66% { transform: translate(-25px, 20px) scale(0.9); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes drawNetworkPath {
          from { stroke-dashoffset: 70; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes floatChip {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .anim-blob-1 {
          animation: abstractBlob 15s infinite ease-in-out;
        }
        .anim-blob-2 {
          animation: abstractBlob 18s infinite ease-in-out 2s;
        }
        .anim-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
        .anim-network-line {
          stroke-dasharray: 70;
          stroke-dashoffset: 70;
        }
        .revealed .anim-network-line {
          animation: drawNetworkPath 2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.6s;
        }
        .anim-chip-float-1 { animation: floatChip 4.5s infinite ease-in-out; }
        .anim-chip-float-2 { animation: floatChip 5.5s infinite ease-in-out 0.5s; }
        .anim-chip-float-3 { animation: floatChip 5s infinite ease-in-out 1.2s; }
        .anim-chip-float-4 { animation: floatChip 6s infinite ease-in-out 0.2s; }
        .anim-chip-float-5 { animation: floatChip 4.8s infinite ease-in-out 1.8s; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Centered Eyebrow Pill */}
        <span 
          className={`inline-block bg-nexus-50 text-nexus-700 border border-nexus-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase mb-8 transition-all duration-700 transform ${
            isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          READY TO VERIFY?
        </span>

        {/* Large Rounded CTA Container Card (max-w-5xl to align exactly with the Nexus Report) */}
        <div 
          className={`bg-white border border-nexus-100/60 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-nexus-600/5 ring-1 ring-nexus-200/50 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 transition-all duration-1000 transform relative overflow-hidden ${
            isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          
          {/* LARGE ABSTRACT NEXUS BACKGROUND DESIGN */}
          <div className="absolute inset-0 pointer-events-none -z-10 rounded-[2rem] overflow-hidden">
            {/* Blurred Light Blue Circles */}
            <div 
              className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full anim-blob-1"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                filter: 'blur(50px)'
              }}
            ></div>
            <div 
              className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full anim-blob-2"
              style={{
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.04) 0%, transparent 70%)',
                filter: 'blur(60px)'
              }}
            ></div>

            {/* Geometric Verification Overlay Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 1000 500" fill="none" preserveAspectRatio="none">
              <path d="M 0 100 Q 250 250 500 100 T 1000 100" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 5" />
              <path d="M 0 400 Q 250 250 500 400 T 1000 400" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="200" y1="0" x2="200" y2="500" stroke="#3b82f6" strokeWidth="0.5" />
              <line x1="800" y1="0" x2="800" y2="500" stroke="#3b82f6" strokeWidth="0.5" />
              <circle cx="200" cy="100" r="3" fill="#3b82f6" />
              <circle cx="800" cy="400" r="3" fill="#3b82f6" />
            </svg>
          </div>

          {/* LEFT SIDE: CTA Message */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 z-10">
            <div>
              {/* Heading */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
                Stop trusting documentation. <br />
                <span className="bg-gradient-to-r from-nexus-600 to-nexus-400 bg-clip-text text-transparent">Start verifying it.</span>
              </h2>

              {/* Supporting Text */}
              <p className="text-sm md:text-base text-text-secondary mt-5 leading-relaxed max-w-lg">
                Connect your GitHub repository and let Nexus compare what your documentation claims with what your software actually does.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
              <button 
                onClick={onAnalyzeRepo}
                className="w-full sm:w-auto bg-nexus-600 hover:bg-nexus-700 hover:-translate-y-0.5 text-white rounded-xl px-7 py-3.5 text-sm font-semibold shadow-lg shadow-nexus-600/10 hover:shadow-xl hover:shadow-nexus-600/20 transition-all duration-200 cursor-pointer"
              >
                Analyze a GitHub Repository &rarr;
              </button>
              <button 
                onClick={onSeeExampleReport}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 hover:-translate-y-0.5 text-text-primary border border-border rounded-xl px-7 py-3.5 text-sm font-medium hover:border-nexus-300 transition-all duration-200 cursor-pointer"
              >
                See an Example Report &rarr;
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Large Elevated Visual Panel */}
          <div className="lg:col-span-6 flex items-center justify-center z-10">
            {/* Elevated visual panel mimicking actual dashboard card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xl relative w-full max-w-md mx-auto flex flex-col space-y-4">
              
              {/* Header block */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Repository Verifier</span>
                <span className="flex items-center space-x-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${verdictState === 'analyzing' ? 'bg-nexus-500 animate-pulse' : 'bg-green-500'}`}></span>
                  <span className="text-[8px] font-semibold text-text-secondary">
                    {verdictState === 'analyzing' ? 'Evidence Trace...' : 'Sync Complete'}
                  </span>
                </span>
              </div>

              {/* Claim Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <span className="text-[7px] font-bold text-text-muted uppercase tracking-wider block mb-1">Documentation Claim</span>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-text-primary">GET /api/courses</span>
                  <span className="text-[8px] text-text-secondary italic">&ldquo;Returns available courses&rdquo;</span>
                </div>
              </div>

              {/* Network flow diagram area */}
              <div className="h-32 bg-slate-50/50 border border-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center p-4">
                
                {/* SVG connection lines routing to center (50, 50) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                  <line x1="15" y1="20" x2="50" y2="50" stroke="#bfdbfe" strokeWidth="0.8" className="anim-network-line" />
                  <line x1="85" y1="20" x2="50" y2="50" stroke="#bfdbfe" strokeWidth="0.8" className="anim-network-line" />
                  <line x1="12" y1="50" x2="50" y2="50" stroke="#bfdbfe" strokeWidth="0.8" className="anim-network-line" />
                  <line x1="88" y1="50" x2="50" y2="50" stroke="#bfdbfe" strokeWidth="0.8" className="anim-network-line" />
                  <line x1="50" y1="85" x2="50" y2="50" stroke="#bfdbfe" strokeWidth="0.8" className="anim-network-line" />
                </svg>

                {/* Central logo node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2.5 border border-nexus-100 shadow-sm z-20">
                  <svg className={`h-5 w-5 text-nexus-600 ${verdictState === 'analyzing' ? 'anim-spin-slow' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </div>

                {/* Staggered floating nodes */}
                <div className="absolute top-[8%] left-[4%] anim-chip-float-1 bg-white border border-border rounded px-1.5 py-0.5 text-[6px] font-bold text-text-secondary shadow-3xs z-10">
                  SOURCE CODE
                </div>
                <div className="absolute top-[8%] right-[4%] anim-chip-float-2 bg-white border border-border rounded px-1.5 py-0.5 text-[6px] font-bold text-text-secondary shadow-3xs z-10">
                  TESTS
                </div>
                <div className="absolute top-[44%] left-[2%] anim-chip-float-3 bg-white border border-border rounded px-1.5 py-0.5 text-[6px] font-bold text-text-secondary shadow-3xs z-10">
                  CONFIG
                </div>
                <div className="absolute top-[44%] right-[2%] anim-chip-float-4 bg-white border border-border rounded px-1.5 py-0.5 text-[6px] font-bold text-text-secondary shadow-3xs z-10">
                  API SPEC
                </div>
                <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 anim-chip-float-5 bg-white border border-border rounded px-1.5 py-0.5 text-[6px] font-bold text-text-secondary shadow-3xs z-10">
                  DEPENDENCIES
                </div>
              </div>

              {/* Verdict Indicator */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[7px] font-bold text-text-muted uppercase tracking-wider">Verdict Output</span>
                
                {/* Toggle states */}
                {verdictState === 'analyzing' ? (
                  <div className="flex items-center space-x-1 text-[9px] font-semibold text-text-secondary">
                    <svg className="animate-spin h-3 w-3 text-nexus-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Comparing code reality...</span>
                  </div>
                ) : (
                  <div 
                    className={`flex items-center space-x-1.5 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-lg text-[9px] font-bold shadow-3xs transition-all duration-500 transform scale-100 opacity-100`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>✓ VERIFIED</span>
                    <span className="text-[7px] font-normal text-green-600/80 border-l border-green-200 pl-1.5">Conf: 0.95</span>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
