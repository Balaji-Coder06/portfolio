import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Terminal, MapPin, Sparkles, ChevronDown, CheckCircle2, Code2, Mail } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Magnetic from '../ui/Magnetic';
import { personalData, socialLinks } from '../../data/portfolioData';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, WhatsAppIcon } from '../ui/SocialIcons';
import AICoreProfile from '../interactive/AICoreProfile';

const roles = [
  "Frontend Developer",
  "Computer Science Student",
  "Full Stack Engineer",
  "AI & ML Enthusiast",
  "Coding for Fun"
];

const floatingTech = [
  { name: 'React 19', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10', pos: 'top-2 -left-6 sm:-left-10' },
  { name: 'Tailwind v4', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10', pos: 'top-1/4 -right-4 sm:-right-8' },
  { name: 'Python & AI', color: 'border-violet-500/40 text-violet-400 bg-violet-500/10', pos: 'bottom-16 -left-6 sm:-left-12' },
  { name: 'C++ / Java', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10', pos: 'bottom-4 -right-4 sm:-right-6' },
];

const socialIconMap = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Mail: Mail,
  MessageSquare: WhatsAppIcon,
  Instagram: InstagramIcon,
  Twitter: TwitterIcon
};

export default function HeroSection({ onOpenTerminal }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedRole, setDisplayedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    const currentFullRole = roles[roleIndex];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && displayedRole === currentFullRole) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayedRole === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedRole(
        isDeleting
          ? currentFullRole.substring(0, displayedRole.length - 1)
          : currentFullRole.substring(0, displayedRole.length + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedRole, isDeleting, roleIndex]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-40 pb-16 overflow-hidden bg-transparent">
      
      {/* Ambient Gradient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Main Hero Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Availability Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <div className="glass-panel px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-mono font-medium text-emerald-300">
                  {personalData.status}
                </span>
              </div>

              <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5 bg-neutral-900/60 px-3 py-1.5 rounded-full border border-neutral-800">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{personalData.location}</span>
              </div>
            </motion.div>

            {/* Huge Cinematic Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-1"
            >
              <span className="text-xs sm:text-sm font-mono tracking-widest text-emerald-400 uppercase font-semibold block mb-1">
                // Welcome to my portfolio
              </span>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-neutral-100 leading-[1.05]">
                Hi, I'm <br className="hidden sm:block" />
                <span className="text-gradient">S BALAJI</span>
              </h1>
            </motion.div>

            {/* Typewriter Role Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="h-14 mt-4 flex items-center"
            >
              <div className="text-lg sm:text-2xl lg:text-3xl font-mono font-bold text-neutral-200 flex items-center gap-2">
                <span className="text-emerald-400">&gt;</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                  {displayedRole}
                </span>
                <span className="w-3 h-7 bg-emerald-400 inline-block animate-pulse ml-0.5 rounded-sm" />
              </div>
            </motion.div>

            {/* Professional Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-3 text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed font-normal"
            >
              Computer Science student passionate about crafting responsive, visually engaging, and highly performant web applications.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.25}>
                <Button
                  href="#projects"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Explore Projects
                </Button>
              </Magnetic>

              <Magnetic strength={0.2}>
                <Button
                  href={personalData.resumeLink}
                  target="_blank"
                  variant="secondary"
                  size="lg"
                  icon={FileText}
                >
                  Download Resume
                </Button>
              </Magnetic>

              <Magnetic strength={0.2}>
                <button
                  onClick={onOpenTerminal}
                  className="flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-neutral-900/90 hover:bg-neutral-800 border border-emerald-500/30 hover:border-emerald-400 px-4 py-3.5 rounded-xl transition-all shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  aria-label="Launch CLI Terminal"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Launch CLI</span>
                </button>
              </Magnetic>
            </motion.div>

            {/* Social Icons Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-10 pt-4 flex items-center gap-4 w-full"
            >
              <span className="text-xs font-mono text-neutral-400">Connect:</span>
              <div className="flex items-center gap-2.5">
                {socialLinks.slice(0, 5).map((social) => {
                  const IconComp = socialIconMap[social.icon] || GithubIcon;
                  return (
                    <Magnetic key={social.name} strength={0.3}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800/80 hover:border-emerald-500/40 flex items-center justify-center text-neutral-400 hover:text-emerald-400 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                        title={social.name}
                        aria-label={`Open ${social.name}`}
                      >
                        <IconComp className="w-4 h-4" />
                      </a>
                    </Magnetic>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Interactive Sci-Fi AI Core Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center items-center relative mt-6 lg:mt-0"
          >
            <AICoreProfile />
          </motion.div>

        </div>
      </div>

      {/* 4. Bottom Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
      >
        <a
          href="#about"
          className="flex flex-col items-center text-xs font-mono text-neutral-400 hover:text-emerald-400 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-lg p-1"
          aria-label="Scroll to About section"
        >
          <span className="tracking-widest uppercase text-[10px]">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-emerald-400 mt-1" />
        </a>
      </motion.div>
    </section>
  );
}
