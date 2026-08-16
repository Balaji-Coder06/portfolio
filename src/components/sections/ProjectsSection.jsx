import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, Sparkles, Layers, ArrowUpRight, CheckCircle2, Star, Eye, Code, Filter, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Magnetic from '../ui/Magnetic';
import { projectsData } from '../../data/portfolioData';
import { GithubIcon } from '../ui/SocialIcons';

// Base Asset URL helper for GitHub Pages & subpath hosting compatibility
const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL || './';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
};

// Fail-proof image renderer with automatic asset path resolution & fallback preview
function ProjectImage({ src, alt, className }) {
  const [imageError, setImageError] = useState(false);
  const resolvedSrc = getAssetUrl(src);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (imageError || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/60 p-4 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Sparkles className="w-6 h-6 animate-pulse text-emerald-400" />
        </div>
        <span className="text-xs font-mono font-bold text-neutral-200">{alt}</span>
        <span className="text-[10px] font-mono text-emerald-400/80 mt-0.5">Interactive Preview</span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      onError={() => setImageError(true)}
      className={className}
    />
  );
}

// Enhanced project dataset with visual previews, carousel views, and status metadata
const enhancedProjects = projectsData.map((project) => {
  if (project.id === 'weather-sentinel') {
    return {
      ...project,
      image: '/weathersentinel_preview.png',
      status: 'Live Intelligence Feed',
      version: 'v1.0 Live',
      carousel: [
        { label: 'Overview', image: '/weathersentinel_preview.png', caption: 'Weather Sentinel Environmental Intelligence Dashboard' },
        { label: 'Activity Planner', image: '/weathersentinel_preview.png', caption: 'Context-Aware Decision Support & Activity Sensitivity Profiles' },
        { label: 'Live Telemetry', image: '/weathersentinel_preview.png', caption: 'Open-Meteo Live Meteorological Telemetry Feed' }
      ]
    };
  } else if (project.id === 'stocksphere') {
    return {
      ...project,
      image: '/stocksphere_preview.png',
      status: 'Enterprise AI Active',
      version: 'v3.0 Production',
      carousel: [
        { label: 'Overview', image: '/stocksphere_preview.png', caption: 'Enterprise Intelligence Operating System Dashboard' },
        { label: 'AI Copilot', image: '/stocksphere_preview.png', caption: 'Explainable AI Copilot & Automated Business Workflows' },
        { label: 'Digital Twin', image: '/stocksphere_preview.png', caption: 'Strategic Scenario Simulation & Predictive Twin Engine' },
        { label: 'Knowledge Graph', image: '/stocksphere_preview.png', caption: 'Enterprise Knowledge Graph connecting 50+ business entities' }
      ]
    };
  } else if (project.id === 'portfolio-v2') {
    return {
      ...project,
      image: '/portfolio_preview.png',
      status: 'Production Active',
      version: 'v2.0 Release',
      carousel: [
        { label: 'Overview', image: '/portfolio_preview.png', caption: 'Kinetic single-page developer experience' },
        { label: 'CLI Terminal', image: '/portfolio_preview.png', caption: 'Interactive command line modal (Cmd+K)' },
        { label: 'Motion Engine', image: '/portfolio_preview.png', caption: 'Lenis inertia scroll + GSAP ScrollTrigger' }
      ]
    };
  } else if (project.id === 'campus-connect') {
    return {
      ...project,
      image: '/campus_preview.png',
      status: 'Live Platform',
      version: 'v1.4 Live',
      carousel: [
        { label: 'Overview', image: '/campus_preview.png', caption: 'Inter-college discussion & networking hub' },
        { label: 'Resource Board', image: '/campus_preview.png', caption: 'Department resource sharing directory' }
      ]
    };
  } else {
    return {
      ...project,
      image: '/wiki_preview.png',
      status: 'Theme Project',
      version: 'v1.0 Release',
      carousel: [
        { label: 'Overview', image: '/wiki_preview.png', caption: 'Anime fan wiki with custom CSS keyframes' },
        { label: 'Card Directory', image: '/wiki_preview.png', caption: 'Character profile cards & episode guide' }
      ]
    };
  }
});

const categories = ['All', 'Featured', 'Enterprise AI', 'Web Application', 'Community Platform', 'Web Design'];

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabMap, setActiveTabMap] = useState({});
  const [featuredTabIdx, setFeaturedTabIdx] = useState(0);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  // Filter projects by category and search query
  const filteredProjects = enhancedProjects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Featured'
        ? project.featured
        : project.category === selectedCategory;

    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredProject = enhancedProjects.find((p) => p.featured) || enhancedProjects[0];

  return (
    <section id="projects" className="py-28 relative overflow-hidden bg-transparent">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Project Showcase"
          title="Built Software &"
          highlight="Web Applications"
          subtitle="Production-grade web applications built with modern frontend engineering, motion design, and responsive systems."
        />

        {/* 1. Featured Project Hero Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <Card tiltMax={8} className="p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative group">
            
            {/* Background Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" style={{ willChange: 'opacity' }} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Info Column */}
              <div className="lg:col-span-6 space-y-5">
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                    <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                    Featured Project
                  </span>
                  <span className="text-xs font-mono text-emerald-300 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {featuredProject.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-neutral-100 group-hover:text-emerald-400 transition-colors tracking-tight">
                    {featuredProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-cyan-400 mt-1">
                    {featuredProject.tagline}
                  </p>
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed">
                  {featuredProject.fullDescription || featuredProject.description}
                </p>

                {/* Key Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {featuredProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Chips */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
                  {featuredProject.tags.map((tag) => (
                    <Badge key={tag} variant="emerald">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Hero Actions */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  {featuredProject.live && (
                    <Magnetic strength={0.25}>
                      <Button
                        href={featuredProject.live}
                        target="_blank"
                        onClick={triggerConfetti}
                        variant="primary"
                        size="md"
                        icon={ArrowUpRight}
                        iconPosition="right"
                      >
                        Launch Live App
                      </Button>
                    </Magnetic>
                  )}

                  {featuredProject.github && (
                    <Magnetic strength={0.2}>
                      <Button
                        href={featuredProject.github}
                        target="_blank"
                        variant="secondary"
                        size="md"
                        icon={GithubIcon}
                      >
                        View Source Code
                      </Button>
                    </Magnetic>
                  )}
                </div>

              </div>

              {/* Right Image Mockup Preview Column */}
              <div className="lg:col-span-6 relative">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl group-hover:border-emerald-500/40 transition-colors">
                  
                  {/* Fake Browser Window Header */}
                  <div className="bg-neutral-900 px-4 py-2.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/80" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>

                    {/* Interactive Carousel Tabs for Featured Project */}
                    {featuredProject.carousel && (
                      <div className="flex items-center gap-1 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800">
                        {featuredProject.carousel.map((tab, idx) => (
                          <button
                            key={tab.label}
                            onClick={() => setFeaturedTabIdx(idx)}
                            onMouseEnter={() => setFeaturedTabIdx(idx)}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
                              featuredTabIdx === idx
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                                : 'text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 hidden sm:block" />
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-[16/10] overflow-hidden group bg-neutral-950">
                    <ProjectImage
                      src={featuredProject.carousel ? featuredProject.carousel[featuredTabIdx]?.image || featuredProject.image : featuredProject.image}
                      alt={featuredProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-40 pointer-events-none" />
                    
                    {/* Caption Overlay */}
                    {featuredProject.carousel && featuredProject.carousel[featuredTabIdx] && (
                      <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-800/80 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between shadow-lg">
                        <span className="truncate">❖ {featuredProject.carousel[featuredTabIdx].caption}</span>
                        <span className="text-[10px] text-neutral-500">{featuredTabIdx + 1}/{featuredProject.carousel.length}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>

          </Card>
        </motion.div>

        {/* 2. Controls Bar: Search & Category Filter Navigation */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                    : 'bg-neutral-900/60 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Real-time Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or tech..."
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl pl-10 pr-9 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-300"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* 3. Product Showcase Masonry / Grid Layout */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const activeTabIdx = activeTabMap[project.id] || 0;
              const currentSlide = project.carousel ? project.carousel[activeTabIdx] : null;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className={`h-full flex flex-col justify-between p-6 group transition-all duration-300 ${
                    project.id === 'weather-sentinel'
                      ? 'border-cyan-500/40 hover:border-cyan-400/80 shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/20 bg-gradient-to-b from-neutral-900/90 to-neutral-950 ring-1 ring-cyan-500/25'
                      : 'hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10'
                  }`}>
                    <div>
                      
                      {/* Window Header & Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {project.id === 'weather-sentinel' && (
                            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                              <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                              Featured Project
                            </span>
                          )}
                          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {project.status || 'Active'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 hover:border-cyan-500/40 transition-all"
                              title="View Code Repository"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={triggerConfetti}
                              className={`p-2 rounded-xl border transition-all ${
                                project.id === 'weather-sentinel'
                                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-neutral-950 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950'
                              }`}
                              title="Launch Project"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Interactive Visual Window Mockup */}
                      <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden mb-5 group-hover:border-emerald-500/30 transition-colors">
                        
                        {/* Fake Browser Window Controls */}
                        <div className="bg-neutral-900/80 px-3 py-2 border-b border-neutral-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[140px]">
                            {project.category}
                          </span>
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                          <ProjectImage
                            src={currentSlide ? currentSlide.image : project.image}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Carousel Tab Selectors */}
                        {project.carousel && project.carousel.length > 1 && (
                          <div className="bg-neutral-900/90 border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-center gap-1">
                            {project.carousel.map((tab, idx) => (
                              <button
                                key={tab.label}
                                onClick={() => setActiveTabMap({ ...activeTabMap, [project.id]: idx })}
                                onMouseEnter={() => setActiveTabMap({ ...activeTabMap, [project.id]: idx })}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                                  activeTabIdx === idx
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'text-neutral-500 hover:text-neutral-300'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-xl font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs font-mono text-cyan-400 mb-3">
                        {project.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-1.5 mb-5">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Tech Chips Footer */}
                    <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <Badge key={t} variant={project.id === 'weather-sentinel' ? 'cyan' : 'neutral'}>
                          {t}
                        </Badge>
                      ))}
                    </div>

                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search Feedback */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-mono text-neutral-400 mb-3">
              No projects found matching "{searchQuery}" in {selectedCategory}.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              variant="outline"
              size="sm"
              icon={RefreshCw}
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
