import { useState, useEffect } from 'react';

interface NavbarProps {
  onConnectGitHub?: () => void;
}

const Navbar = ({ onConnectGitHub }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pointer-events-none mt-4">
      <nav
        className={`pointer-events-auto flex w-full max-w-4xl items-center justify-between rounded-full border border-border/60 px-4 py-2.5 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-md backdrop-blur-xl' : 'bg-white/80 shadow-sm backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center space-x-2 cursor-pointer" onClick={(e) => scrollToSection(e as any, 'home')}>
          <svg className="h-6 w-6 text-nexus-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
          <span className="font-bold tracking-wide text-text-primary">NEXUS</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition cursor-pointer"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition cursor-pointer"
          >
            About
          </a>
          <a
            href="#creator"
            onClick={(e) => scrollToSection(e, 'creator')}
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition cursor-pointer"
          >
            Creator
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile-only Compact GitHub Icon Button */}
          <button
            onClick={onConnectGitHub}
            aria-label="Connect with GitHub"
            className="md:hidden w-9 h-9 flex items-center justify-center bg-black hover:bg-slate-900 text-white rounded-full transition cursor-pointer shadow-xs"
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>

          {/* Mobile-only Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-alt transition cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop-only Connect with GitHub Button */}
          <button
            onClick={onConnectGitHub}
            className="hidden md:flex items-center space-x-2 bg-black hover:bg-slate-900 text-white rounded-full px-5 py-2 text-sm font-medium hover:scale-102 transition cursor-pointer shadow-xs"
          >
            <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Connect with GitHub &rarr;</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto md:hidden w-full max-w-4xl mt-2 p-3 bg-white/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, 'home')}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            How It Works
          </a>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            About
          </a>
          <a
            href="#creator"
            onClick={(e) => scrollToSection(e, 'creator')}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            Creator
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
