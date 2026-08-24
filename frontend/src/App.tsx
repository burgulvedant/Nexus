import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProductPreview from './components/ProductPreview'
import EvidenceStrip from './components/EvidenceStrip'
import HowItWorks from './components/HowItWorks'
import TruthGap from './components/TruthGap'
import NexusReport from './components/NexusReport'
import FinalCTA from './components/FinalCTA'
import CreatorSection from './components/CreatorSection'
import Footer from './components/Footer'
import Dashboard from './components/dashboard/Dashboard'
import MarkdownReportModal from './components/dashboard/MarkdownReportModal'
import { GRADSCOPE_EXAMPLE_REPORT_MD } from './data/gradscopeExampleReport'

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing')
  const [isExampleReportOpen, setIsExampleReportOpen] = useState(false)

  useEffect(() => {
    const handleHashAndParams = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);

      // 1. Check for auth error in hash fragment (#auth_error=xxx) or query (?auth_error=xxx)
      let authError: string | null = null;
      if (hash.startsWith('#auth_error=')) {
        authError = decodeURIComponent(hash.replace('#auth_error=', '').split('&')[0]);
      } else if (urlParams.has('auth_error')) {
        authError = decodeURIComponent(urlParams.get('auth_error') || '');
      }

      if (authError) {
        alert(`GitHub Authentication Failed: ${authError}`);
        window.history.replaceState(null, '', window.location.pathname);
        setCurrentView('landing');
        return;
      }

      // 2. Discover token in priority order: #token=... -> ?token=... -> localStorage('nexus_token')
      let token: string | null = null;
      if (hash.startsWith('#token=')) {
        token = hash.replace('#token=', '').split('&')[0];
      } else if (urlParams.has('token')) {
        token = urlParams.get('token');
      }

      if (token) {
        // Fresh token received from OAuth callback
        localStorage.setItem('nexus_token', token);
        // Clean URL and navigate to dashboard
        window.history.replaceState(null, '', window.location.pathname + '#dashboard');
        setCurrentView('dashboard');
        return;
      }

      // 3. Check for existing valid session in localStorage
      const storedToken = localStorage.getItem('nexus_token');
      if (storedToken) {
        // If explicit navigation to home was clicked, allow landing; otherwise restore dashboard
        if (hash === '#home' || hash === '#about' || hash === '#how-it-works' || hash === '#creator') {
          setCurrentView('landing');
        } else {
          setCurrentView('dashboard');
        }
        return;
      }

      // 4. No token at all: regular landing navigation
      if (hash === '#dashboard' || hash.startsWith('#/dashboard')) {
        // Redirect to landing if unauthenticated
        setCurrentView('landing');
      } else {
        setCurrentView('landing');
      }
    };

    handleHashAndParams();
    window.addEventListener('hashchange', handleHashAndParams);
    return () => window.removeEventListener('hashchange', handleHashAndParams);
  }, []);

  const handleConnectWithGitHub = () => {
    // Initiate real GitHub OAuth flow via backend redirect endpoint
    const backendAuthUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/github`;
    window.location.href = backendAuthUrl;
  };

  const navigateToLanding = () => {
    // Navigation back to landing page preserves stored session
    window.location.hash = '#home';
    setCurrentView('landing');
  };

  const handleLogout = () => {
    // Explicit user sign-out: clear stored JWT and reset hash
    localStorage.removeItem('nexus_token');
    window.location.hash = '';
    setCurrentView('landing');
  };

  if (currentView === 'dashboard') {
    return <Dashboard onBackToLanding={navigateToLanding} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <Navbar onConnectGitHub={handleConnectWithGitHub} />
      <main>
        <div id="home">
          <HeroSection 
            onSeeExampleReport={() => setIsExampleReportOpen(true)}
            onAnalyzeRepo={handleConnectWithGitHub}
          />
        </div>
        <div id="product-preview">
          <ProductPreview />
        </div>
        <EvidenceStrip />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="about">
          <div id="why-nexus">
            <TruthGap />
          </div>
        </div>
        <div id="nexus-report">
          <NexusReport />
        </div>
        <FinalCTA 
          onSeeExampleReport={() => setIsExampleReportOpen(true)}
          onAnalyzeRepo={handleConnectWithGitHub}
        />
        <div id="creator">
          <CreatorSection />
        </div>
      </main>
      <Footer 
        onSeeExampleReport={() => setIsExampleReportOpen(true)}
        onAnalyzeRepo={handleConnectWithGitHub}
      />

      {/* GradScope Example Report Modal for Landing Page */}
      <MarkdownReportModal
        isOpen={isExampleReportOpen}
        onClose={() => setIsExampleReportOpen(false)}
        markdownContent={GRADSCOPE_EXAMPLE_REPORT_MD}
        repoName="gradscope"
      />
    </div>
  )
}
