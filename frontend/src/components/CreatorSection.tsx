import { useEffect, useRef, useState } from 'react';
import vedantPortrait from '../assets/vedant_burgul.jpg';
import linkedinIcon from '../assets/linkedin_icon.png';
import githubIcon from '../assets/github_icon.png';

export default function CreatorSection() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
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
      className={`relative w-full border-t border-border/60 bg-[#f8fafc]/30 transition-colors duration-1000 ${
        isRevealed ? 'revealed' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span
            className={`inline-block bg-nexus-50 text-nexus-700 border border-nexus-200 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase mb-6 transition-all duration-700 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            BEHIND THE PROJECT
          </span>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-tight transition-all duration-700 delay-100 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Building things that solve{' '}
            <span className="bg-gradient-to-r from-nexus-600 to-nexus-400 bg-clip-text text-transparent">
              real problems.
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg text-text-secondary mt-5 leading-relaxed transition-all duration-700 delay-200 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            I'm a Computer Science student who loves turning ideas into working products.
          </p>
        </div>

        {/* Main Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Portrait, Identity & Social Links (5 cols) */}
          <div
            className={`lg:col-span-5 flex flex-col items-center lg:items-start transition-all duration-700 delay-300 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="w-full max-w-sm sm:max-w-md bg-white border border-border/80 rounded-2xl md:rounded-3xl p-4 sm:p-5 shadow-xl shadow-nexus-600/5 ring-1 ring-nexus-200/40 space-y-4">
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl aspect-[4/5] bg-slate-100">
                <img
                  src={vedantPortrait}
                  alt="Vedant Burgul"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                    Vedant Burgul
                  </h3>
                  <p className="text-sm font-medium text-text-secondary mt-1">
                    BTech Computer Science @ VIT Pune
                  </p>
                  <p className="text-xs text-text-muted font-mono mt-0.5">
                    2024 — 2028
                  </p>
                </div>

                {/* Social Icon Links */}
                <div className="flex items-center space-x-2.5">
                  <a
                    href="https://www.linkedin.com/in/vedantburgul"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-nexus-50 border border-border/80 hover:border-nexus-300 p-2 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
                  >
                    <img src={linkedinIcon} alt="LinkedIn" className="w-full h-full object-contain" />
                  </a>
                  <a
                    href="https://github.com/burgulvedant"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-nexus-50 border border-border/80 hover:border-nexus-300 p-2 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105"
                  >
                    <img src={githubIcon} alt="GitHub" className="w-full h-full object-contain" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Journey & Why Nexus (7 cols) */}
          <div
            className={`lg:col-span-7 space-y-8 text-text-secondary transition-all duration-700 delay-400 transform ${
              isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* About Me Story */}
            <div className="space-y-5 text-base sm:text-[17px] leading-relaxed">
              <p>
                <strong className="text-text-primary font-semibold">
                  I love turning ideas into real products through code.
                </strong>{' '}
                For me, software engineering is about finding meaningful problems, understanding why they exist, and building practical systems that solve them. My primary focus revolves around software development, Python, SQL, and data-driven problem solving.
              </p>
              <p>
                <strong className="text-text-primary font-semibold">
                  I'm constantly learning by building.
                </strong>{' '}
                Rather than stopping at theoretical concepts, I prefer taking new technologies, experimenting with ideas, and testing how systems actually behave under real conditions. Building projects is how I explore architectures, understand tradeoffs, and learn the most.
              </p>
              <p>
                <strong className="text-text-primary font-semibold">
                  I'm particularly interested in the data side of technology.
                </strong>{' '}
                Whether exploring data science, structuring analytical queries, or making sense of signals hidden in complex systems, I enjoy combining data-backed insight with clean, intuitive software interfaces.
              </p>
            </div>

            {/* Why I Built Nexus Editorial Card */}
            <div className="bg-white border border-border/80 rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-md shadow-nexus-600/5 ring-1 ring-nexus-200/40 space-y-5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-nexus-600"></span>
                <span className="text-xs font-bold text-nexus-700 tracking-wider uppercase">
                  WHY I BUILT NEXUS
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                The idea started with a simple problem: documentation can become outdated long before anyone notices.
              </h4>

              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                In software projects, documentation often says one thing while the repository tells a different story. Over time, features evolve, flags change, and behaviors shift across source code, test suites, configurations, and APIs—leaving documentation describing claims that are no longer true.
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-nexus-50/70 border border-nexus-200/80 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-nexus-800">
                  The Core Question
                </span>
                <p className="text-base sm:text-lg font-bold text-nexus-900 italic">
                  &ldquo;Does what my documentation says still match what my software actually does?&rdquo;
                </p>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                Existing developer tools frequently focus on code linting, automated doc generation, test coverage, or workflow monitoring. Nexus explores that missing verification gap: extracting claims directly from documentation, tracing evidence throughout the codebase, and generating a structured, evidence-backed truth report.
              </p>
            </div>

            {/* Subtle Minimal Final CTA */}
            <div className="pt-2 flex items-center justify-between border-t border-border/60 text-xs sm:text-sm text-text-muted">
              <span>Built from a question worth asking.</span>
              <a
                href="#product-preview"
                className="font-semibold text-nexus-600 hover:text-nexus-700 transition"
              >
                Explore what Nexus finds &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
