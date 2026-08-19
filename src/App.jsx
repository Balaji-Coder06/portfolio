import { useState, useEffect } from 'react';
import SmoothScrollProvider from './animations/SmoothScrollProvider';
import CursorFollower from './animations/CursorFollower';
import GlobalBackground from './components/layout/GlobalBackground';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import DeveloperDashboardSection from './components/sections/DeveloperDashboardSection';
import ContactSection from './components/sections/ContactSection';
import CodeTerminalModal from './components/interactive/CodeTerminalModal';
import MusicPlayer from './components/interactive/MusicPlayer';

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#050508] text-neutral-100 selection:bg-emerald-500/30 selection:text-emerald-300 relative font-sans">
        
        {/* Layered Cinematic Global Background */}
        <GlobalBackground />

        {/* Custom Glowing Cursor */}
        <CursorFollower />

        {/* Sticky Glass Navbar */}
        <Navbar onOpenTerminal={() => setTerminalOpen(true)} />

        {/* Main Section Content */}
        <main className="relative z-10">
          <HeroSection onOpenTerminal={() => setTerminalOpen(true)} />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <DeveloperDashboardSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Floating Cyber Glass Music Player */}
        <MusicPlayer />

        {/* CLI Terminal Modal */}
        <CodeTerminalModal
          isOpen={terminalOpen}
          onClose={() => setTerminalOpen(false)}
        />
      </div>
    </SmoothScrollProvider>
  );
}
