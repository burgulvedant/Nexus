
interface HeroSectionProps {
  onSeeExampleReport?: () => void;
  onAnalyzeRepo?: () => void;
}

const HeroSection = ({ onSeeExampleReport, onAnalyzeRepo }: HeroSectionProps) => {
  return (
    <section className="relative pt-32 md:pt-40 pb-8 md:pb-12 flex flex-col items-center overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
      />

      <div className="flex flex-col items-center w-full max-w-4xl px-4 z-10">
        <span className="inline-block bg-nexus-50 text-nexus-700 border border-nexus-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase mb-8">
          NEXUS
        </span>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary tracking-tight leading-tight text-center max-w-4xl mx-auto">
          Is Your Documentation Actually <span className="bg-gradient-to-r from-nexus-600 to-nexus-400 bg-clip-text text-transparent">True?</span>
        </h1>

        <div className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto text-center leading-relaxed mt-6 flex flex-col space-y-1">
          <span>Documentation changes. Code changes.</span>
          <span>But nobody continuously verifies that what your documentation says is what your software actually does.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-10 gap-4 w-full">
          <button 
            onClick={onAnalyzeRepo}
            className="w-full sm:w-auto bg-nexus-600 hover:bg-nexus-700 text-white rounded-xl px-7 py-3.5 text-base font-semibold shadow-lg shadow-nexus-600/20 hover:shadow-xl hover:shadow-nexus-600/30 transition-all duration-200 cursor-pointer"
          >
            Analyze a GitHub Repository &rarr;
          </button>
          <button 
            onClick={onSeeExampleReport}
            className="w-full sm:w-auto bg-white hover:bg-surface-alt text-text-primary border border-border rounded-xl px-7 py-3.5 text-base font-medium hover:border-nexus-300 transition-all duration-200 cursor-pointer"
          >
            See GradScope Example Report &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
