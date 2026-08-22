import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Terminal, FileText, Sparkles, ArrowRight, Code2, Command } from 'lucide-react';
import Magnetic from '../ui/Magnetic';
import Button from '../ui/Button';
import { personalData } from '../../data/portfolioData';

const navItems = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export default function Navbar({ onOpenTerminal }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredNav, setHoveredNav] = useState(null);
  const navRef = useRef(null);

  // Scroll Progress Bar Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  // Track active section and dynamic scroll depth with RAF throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrolled = currentScrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const progress = maxScroll > 0 ? Math.min(currentScrollY / 500, 1) : 0;
          setScrollProgress((prev) => (Math.abs(prev - progress) > 0.04 ? progress : prev));

          const scrollPosition = currentScrollY + 250;
          for (let i = navItems.length - 1; i >= 0; i--) {
            const item = navItems[i];
            const element = document.getElementById(item.id);
            if (element && scrollPosition >= element.offsetTop) {
              setActiveSection((prev) => (prev !== item.id ? item.id : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Page Scroll Progress Indicator Line at top of viewport */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 z-50 origin-left shadow-[0_0_12px_#10b981]"
        style={{ scaleX }}
      />

      {/* 2. Premium Luxury Sticky Floating Glass Header */}
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'py-3 sm:py-4' : 'py-5 sm:py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Ambient Glowing Gradient Backdrop Layer behind Navbar */}
          <div
            className={`absolute -inset-1 rounded-2xl sm:rounded-[28px] xl:rounded-[32px] bg-gradient-to-r from-emerald-500/25 via-cyan-500/15 to-violet-500/25 blur-xl transition-all duration-500 pointer-events-none ${
              scrolled ? 'opacity-80 scale-[0.99]' : 'opacity-40 scale-100'
            }`}
          />

          {/* Main Floating Glass Panel Container */}
          <div
            className={`relative w-full max-w-full overflow-hidden rounded-2xl sm:rounded-[28px] xl:rounded-[32px] transition-all duration-500 flex items-center gap-2 sm:gap-3 xl:gap-4 px-3 sm:px-4 xl:px-6 py-2.5 sm:py-3 xl:py-3.5 shadow-2xl ${
              scrolled
                ? 'bg-neutral-950/85 backdrop-blur-3xl border border-emerald-500/30 shadow-black/90 shadow-emerald-500/5'
                : 'bg-neutral-900/60 backdrop-blur-2xl border border-white/10 shadow-black/50'
            }`}
            style={{
              backdropFilter: `blur(${16 + scrollProgress * 14}px)`,
              WebkitBackdropFilter: `blur(${16 + scrollProgress * 14}px)`
            }}
          >

            {/* Brand Logo with Magnetic Interaction */}
            <Magnetic strength={0.25} className="shrink-0 min-w-0">
              <a
                href="#hero"
                onClick={(e) => handleNavClick(e, '#hero')}
                className="flex items-center gap-2 sm:gap-3 group focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:outline-none rounded-2xl p-0.5 sm:p-1 transition-all min-w-0"
                aria-label="S Balaji Portfolio Home"
              >
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 xl:w-11 xl:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-400 via-cyan-400 to-violet-600 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/50 group-hover:scale-105 transition-all shrink-0">
                  <div className="w-full h-full bg-neutral-950 rounded-[11px] sm:rounded-[14px] flex items-center justify-center">
                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm sm:text-base xl:text-lg font-black text-neutral-100 group-hover:text-emerald-400 transition-colors tracking-tight flex items-center gap-1.5 sm:gap-2 truncate">
                    S BALAJI
                    <span className="hidden sm:inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  </span>
                  <span className="hidden sm:block text-[9px] sm:text-[10px] font-mono text-emerald-400/90 tracking-widest uppercase font-semibold truncate">
                    Coding for Fun
                  </span>
                </div>
              </a>
            </Magnetic>

            {/* Desktop Navigation Track Bar */}
            <nav
              ref={navRef}
              className="hidden xl:flex flex-1 items-center justify-center min-w-0 px-1"
              aria-label="Main Navigation"
            >
              <div className="flex items-center gap-0.5 2xl:gap-1 bg-neutral-950/70 border border-white/10 p-1 2xl:p-1.5 rounded-full backdrop-blur-2xl shadow-inner max-w-full">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredNav === item.id;

                return (
                  <Magnetic key={item.id} strength={0.18} className="shrink-0">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      onMouseEnter={() => setHoveredNav(item.id)}
                      onMouseLeave={() => setHoveredNav(null)}
                      className="relative px-2 py-1.5 2xl:px-3 2xl:py-2 text-xs 2xl:text-sm font-semibold rounded-full transition-all duration-300 block focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none whitespace-nowrap"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active Background Pill Animation */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-emerald-500/20 rounded-full border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                      )}

                      {/* Hover Pill Shadow */}
                      {isHovered && !isActive && (
                        <motion.div
                          layoutId="hoverNavPill"
                          className="absolute inset-0 bg-neutral-800/80 rounded-full border border-neutral-700/50"
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                      )}

                      <span className="relative z-10">{item.label}</span>

                      {/* Animated Neon Underline Highlight */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavUnderline"
                          className="absolute bottom-1 left-2 right-2 2xl:left-3 2xl:right-3 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_10px_#10b981]"
                          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        />
                      )}
                    </a>
                  </Magnetic>
                );
              })}
              </div>
            </nav>

            {/* Right Action Area */}
            <div className="hidden xl:flex items-center gap-2 2xl:gap-3.5 shrink-0">
              <Magnetic strength={0.2} className="shrink-0">
                <button
                  onClick={onOpenTerminal}
                  className="flex items-center gap-1.5 2xl:gap-2.5 text-xs 2xl:text-sm font-mono text-neutral-200 hover:text-emerald-400 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 px-3 py-2 2xl:px-4 2xl:py-2.5 rounded-xl 2xl:rounded-2xl transition-all shadow-md focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none group whitespace-nowrap"
                  title="Open Interactive CLI Terminal (Cmd+K)"
                  aria-label="Open Interactive CLI Terminal"
                >
                  <Terminal className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-emerald-400 group-hover:rotate-6 transition-transform shrink-0" />
                  <span className="font-semibold">CLI</span>
                  <kbd className="hidden 2xl:flex bg-neutral-800 text-neutral-400 text-[11px] px-2 py-0.5 rounded-lg border border-neutral-700 font-sans items-center gap-0.5 shrink-0">
                    <Command className="w-3 h-3" />K
                  </kbd>
                </button>
              </Magnetic>

              <Magnetic strength={0.25} className="shrink-0">
                <Button
                  href={personalData.resumeLink}
                  target="_blank"
                  variant="primary"
                  size="md"
                  icon={FileText}
                  className="px-3.5 py-2 2xl:px-5 2xl:py-2.5 rounded-xl 2xl:rounded-2xl text-xs 2xl:text-sm font-bold shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                >
                  Resume
                </Button>
              </Magnetic>
            </div>

            {/* Mobile Controls & Morphing Animated Hamburger */}
            <div className="flex xl:hidden items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              <button
                onClick={onOpenTerminal}
                className="p-3 text-neutral-200 hover:text-emerald-400 bg-neutral-900 border border-neutral-800 rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                aria-label="Open CLI Terminal"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
              </button>

              <Magnetic strength={0.3}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-11 h-11 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none transition-colors"
                  aria-label={mobileMenuOpen ? 'Close Navigation Drawer' : 'Open Navigation Drawer'}
                  aria-expanded={mobileMenuOpen}
                >
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-[2px] bg-emerald-400 rounded-full block origin-center"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-[2px] bg-neutral-300 rounded-full block"
                  />
                  <motion.span
                    animate={mobileMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-5 h-[2px] bg-emerald-400 rounded-full block origin-center"
                  />
                </button>
              </Magnetic>
            </div>

          </div>
        </div>
      </motion.header>

      {/* 3. Premium Mobile Glass Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 xl:hidden bg-neutral-950/95 backdrop-blur-3xl flex flex-col pt-28 sm:pt-32 px-4 sm:px-6 pb-10 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-md mx-auto w-full flex flex-col justify-between h-full relative z-10">
              <div className="flex flex-col space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 block font-semibold">
                  Navigation Menu
                </span>

                {navItems.map((item, index) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-2xl border text-lg font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                          : 'bg-neutral-900/60 text-neutral-200 border-neutral-800/80 hover:text-neutral-100 hover:border-neutral-700'
                      }`}
                    >
                      <span className="flex items-center gap-3.5">
                        <span className="font-mono text-xs text-neutral-500">0{index + 1}.</span>
                        {item.label}
                      </span>
                      <ArrowRight className={`w-5 h-5 transition-transform ${isActive ? 'text-emerald-400 translate-x-1' : 'text-neutral-600'}`} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Bottom Actions inside Mobile Drawer */}
              <div className="pt-8 border-t border-neutral-800/80 flex flex-col gap-3.5">
                <Button
                  href={personalData.resumeLink}
                  target="_blank"
                  variant="primary"
                  size="lg"
                  icon={FileText}
                  className="w-full justify-center py-4 text-sm font-bold"
                >
                  View Official Resume
                </Button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenTerminal();
                  }}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-2xl text-xs font-mono text-emerald-400 flex items-center justify-center gap-2.5 transition-colors font-semibold"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Launch CLI Terminal (Cmd+K)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
