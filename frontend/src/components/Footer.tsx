interface FooterProps {
  onAnalyzeRepo?: () => void;
  onSeeExampleReport?: () => void;
}

export default function Footer({ onAnalyzeRepo, onSeeExampleReport }: FooterProps) {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navbarOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="w-full bg-[#f8fafc]/40 border-t border-border/60 relative">
      {/* Centered bounding wrapper matching the navbar/dashboard max-w-7xl structure */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 flex flex-col space-y-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT SIDE: Brand Block (spans 5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col space-y-4 max-w-sm">
            {/* Logo + Wordmark */}
            <div className="flex items-center space-x-2.5">
              <svg className="h-6 w-6 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
              <span className="font-bold tracking-wide text-text-primary text-lg">NEXUS</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Verify what your documentation claims against what your repository actually does.
            </p>
          </div>

          {/* RIGHT SIDE: Navigation Columns (spans 7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Column 1 - Product */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Product</span>
              <ul className="flex flex-col space-y-2 text-xs font-semibold text-text-secondary">
                <li>
                  <a 
                    href="#how-it-works" 
                    onClick={(e) => scrollToSection(e, 'how-it-works')}
                    className="hover:text-nexus-600 transition duration-200 cursor-pointer"
                  >
                    How Nexus Works
                  </a>
                </li>
                <li>
                  <a 
                    href="#why-nexus" 
                    onClick={(e) => scrollToSection(e, 'why-nexus')}
                    className="hover:text-nexus-600 transition duration-200 cursor-pointer"
                  >
                    Why Nexus
                  </a>
                </li>
                <li>
                  <a 
                    href="#nexus-report" 
                    onClick={(e) => scrollToSection(e, 'nexus-report')}
                    className="hover:text-nexus-600 transition duration-200 cursor-pointer"
                  >
                    Nexus Report
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 - Resources */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Resources</span>
              <ul className="flex flex-col space-y-2 text-xs font-semibold text-text-secondary">
                <li>
                  <button 
                    type="button"
                    onClick={onSeeExampleReport}
                    className="hover:text-nexus-600 transition duration-200 cursor-pointer text-left font-semibold text-text-secondary text-xs"
                  >
                    Example Report
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Get Started */}
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Get Started</span>
              <ul className="flex flex-col space-y-2 text-xs font-semibold text-text-secondary">
                <li>
                  <button 
                    type="button"
                    onClick={onAnalyzeRepo}
                    className="hover:text-nexus-600 transition duration-200 cursor-pointer text-left font-semibold text-text-secondary text-xs"
                  >
                    Analyze a Repository
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={onSeeExampleReport}
                    className="hover:text-nexus-600 transition duration-200 cursor-pointer text-left font-semibold text-text-secondary text-xs"
                  >
                    View Example Report
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: Divider & Copyright Info */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-semibold text-text-muted">
          <span>&copy; 2026 Nexus. Built for repository verification.</span>
          <span>Built by Vedant Burgul.</span>
        </div>

      </div>
    </footer>
  );
}
