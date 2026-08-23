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

      // 1. Check for token in hash fragment (#token=xxx)
      if (hash.startsWith('#token=')) {
        const token = hash.replace('#token=', '').split('&')[0];
        if (token) {
          localStorage.setItem('nexus_token', token);
          // Clean URL and navigate to dashboard
          window.history.replaceState(null, '', window.location.pathname + '#dashboard');
          setCurrentView('dashboard');
          return;
        }
      }

      // 2. Check for auth error in hash fragment (#auth_error=xxx)
      if (hash.startsWith('#auth_error=')) {
        const errorMsg = decodeURIComponent(hash.replace('#auth_error=', '').split('&')[0]);
        alert(`GitHub Authentication Failed: ${errorMsg}`);
        window.history.replaceState(null, '', window.location.pathname);
        setCurrentView('landing');
        return;
      }

      // 3. Regular hash navigation
      if (hash === '#dashboard' || hash.startsWith('#/dashboard')) {
        setCurrentView('dashboard');
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
    window.location.hash = '';
    setCurrentView('landing');
  };

  if (currentView === 'dashboard') {
    return <Dashboard onBackToLanding={navigateToLanding} />
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
