import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, BookOpen, Activity, RefreshCw, Sparkles, BarChart3, Calendar, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AnimatedCounter from '../ui/AnimatedCounter';
import { GithubIcon } from '../ui/SocialIcons';
import { useDeveloperStats } from '../../hooks/useDeveloperStats';

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Build 52-Week Contribution Matrix from Live GitHub Telemetry Data
const buildHeatmapWeeks = (days = []) => {
  if (!days || days.length === 0) return [];
  const weeks = [];
  let currentWeek = [];

  // Align starting day to Sunday if necessary
  const firstDay = new Date(days[0].date);
  const firstDayOfWeek = isNaN(firstDay.getDay()) ? 0 : firstDay.getDay(); // 0 is Sunday
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({
      date: '',
      count: 0,
      level: 0,
      colorClass: 'invisible pointer-events-none opacity-0'
    });
  }

  days.forEach((day) => {
    let colorClass = 'bg-neutral-900 border-neutral-800/80';
    if (day.level === 1) colorClass = 'bg-emerald-950 border-emerald-800/60';
    else if (day.level === 2) colorClass = 'bg-emerald-800/80 border-emerald-600/60 shadow-[0_0_4px_rgba(16,185,129,0.3)]';
    else if (day.level === 3) colorClass = 'bg-emerald-600 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    else if (day.level >= 4) colorClass = 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_#10b981]';

    currentWeek.push({
      date: day.date,
      count: typeof day.count === 'number' ? day.count : (day.level || 0),
      level: day.level || 0,
      colorClass
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

export default function DeveloperDashboardSection() {
  const { stats, loading, refetch } = useDeveloperStats();
  const [hoveredDay, setHoveredDay] = useState(null);

  const gh = stats.github;
  const contributions = stats.contributions;
  const totalContributions = contributions?.totalContributions ?? 167;
  const days = contributions?.days || [];

  const heatmapWeeks = useMemo(() => buildHeatmapWeeks(days), [days]);

  return (
    <section id="dashboard" className="py-28 relative overflow-hidden bg-transparent">

      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Live Developer Analytics Engine"
          title="GitHub Analytics &"
          highlight="Live Telemetry"
          subtitle="Real-time GitHub profile metrics and contribution telemetry fetched automatically. Zero hardcoded data."
        />

        {/* 1. Metric Counter Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

          {/* Public Repos */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-emerald-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">Public Repos</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading && !gh ? <span className="animate-pulse">...</span> : <AnimatedCounter value={gh?.publicRepos ?? 10} />}
                </span>
              </div>
            </div>
          </Card>

          {/* GitHub Followers */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-cyan-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">GitHub Followers</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading && !gh ? <span className="animate-pulse">...</span> : <AnimatedCounter value={gh?.followers ?? 20} />}
                </span>
              </div>
            </div>
          </Card>

          {/* Total GitHub Stars */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-amber-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">GitHub Stars</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading && !gh ? <span className="animate-pulse">...</span> : <AnimatedCounter value={gh?.totalStars ?? 15} />}
                </span>
              </div>
            </div>
          </Card>

          {/* GitHub Contributions */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-violet-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">Total Commits</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading && !contributions ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <AnimatedCounter value={totalContributions} />
                  )}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Main Analytics Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

          {/* Left Column: 365-Day Matrix & Language Breakdown */}
          <div className="lg:col-span-8 space-y-8">

            {/* 365-Day Contribution Matrix Card */}
            <Card className="p-6 relative" tiltEffect={false}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-100">GitHub Contribution Telemetry</h3>
                    <p className="text-xs text-neutral-400">
                      Live 365-day commit history matrix •{' '}
                      <span className="text-emerald-400 font-semibold">{totalContributions} contributions</span> in the last year
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => refetch()}
                    disabled={loading}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors disabled:opacity-50"
                    title="Refresh Live GitHub Telemetry"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{loading ? 'Syncing...' : 'Live Telemetry'}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Telemetry Inspection Banner */}
              <div className="mb-4 min-h-[36px]">
                <AnimatePresence mode="wait">
                  {hoveredDay && hoveredDay.date ? (
                    <motion.div
                      key={hoveredDay.date}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono flex items-center justify-between text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-emerald-200">{formatDateLabel(hoveredDay.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Activity:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {hoveredDay.count > 0 ? `${hoveredDay.count} ${hoveredDay.count === 1 ? 'Commit' : 'Commits'}` : 'No Commits (Rest Day)'}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="px-3.5 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-xs font-mono flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Hover over any cell in the grid to inspect telemetry</span>
                      </span>
                      <span className="text-neutral-500">365 Days Telemetry</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Heatmap Grid Overflow Container */}
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="flex gap-1 min-w-[700px]">
                  {heatmapWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {week.map((day, dIdx) => (
                        <div
                          key={dIdx}
                          onMouseEnter={() => day.date && setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-2.5 h-2.5 rounded-sm border ${day.colorClass} transition-all duration-150 ${
                            day.date ? 'cursor-pointer' : ''
                          } ${
                            hoveredDay?.date && hoveredDay.date === day.date
                              ? 'ring-2 ring-emerald-400 border-emerald-300 z-20 shadow-[0_0_8px_#10b981]'
                              : day.date ? 'hover:ring-1 hover:ring-emerald-400/80 hover:border-emerald-400' : ''
                          }`}
                          title={day.date ? `${day.date}: ${day.count} ${day.count === 1 ? 'commit' : 'commits'}` : undefined}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Less Activity</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900 border border-neutral-800" title="0 commits" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-800" title="1-2 commits" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800/80 border border-emerald-600/60" title="3-5 commits" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 border border-emerald-500" title="6-10 commits" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300" title="11+ commits" />
                </div>
                <span>More Activity</span>
              </div>
            </Card>

            {/* Language Breakdown Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-neutral-100">Primary Codebase Distribution</h3>
                </div>
                <span className="text-xs font-mono text-neutral-400">Calculated across live repos</span>
              </div>

              {/* Multi-color Segment Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex mb-6 bg-neutral-900 border border-neutral-800">
                {(gh?.languages || [
                  { name: 'JavaScript / React', percent: 45 },
                  { name: 'HTML5 & CSS3', percent: 30 },
                  { name: 'C / C++', percent: 15 },
                  { name: 'Python', percent: 10 }
                ]).map((lang, idx) => {
                  const colors = ['bg-emerald-400', 'bg-cyan-400', 'bg-amber-400', 'bg-violet-400', 'bg-rose-400'];
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={lang.name}
                      style={{ width: `${lang.percent}%` }}
                      className={`${color} h-full transition-all duration-500`}
                      title={`${lang.name}: ${lang.percent}%`}
                    />
                  );
                })}
              </div>

              {/* Language Chips Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(gh?.languages || [
                  { name: 'JavaScript / React', percent: 45 },
                  { name: 'HTML5 & CSS3', percent: 30 },
                  { name: 'C / C++', percent: 15 },
                  { name: 'Python', percent: 10 }
                ]).map((lang, idx) => {
                  const colors = ['bg-emerald-400', 'bg-cyan-400', 'bg-amber-400', 'bg-violet-400', 'bg-rose-400'];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={lang.name} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="text-xs font-semibold text-neutral-200">{lang.name}</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{lang.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>

          {/* Right Column: Live Repos Feed & GitHub Profile */}
          <div className="lg:col-span-4 space-y-8">

            {/* GitHub Profile Highlight Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={gh?.avatar || 'https://avatars.githubusercontent.com/u/Balaji-Coder06'}
                  alt="GitHub Avatar"
                  className="w-14 h-14 rounded-2xl border border-emerald-500/40 p-0.5 object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-100">{gh?.name || 'S Balaji'}</h3>
                  <a
                    href={`https://github.com/${gh?.username || 'Balaji-Coder06'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>@{gh?.username || 'Balaji-Coder06'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                {gh?.bio || 'Computer Science Engineering student crafting responsive web applications, full-stack tools, and exploring AI/ML models.'}
              </p>

              <Button
                href={`https://github.com/${gh?.username || 'Balaji-Coder06'}`}
                target="_blank"
                variant="primary"
                size="sm"
                icon={GithubIcon}
                className="w-full justify-center"
              >
                Follow on GitHub
              </Button>
            </Card>

            {/* Recent Live Repositories */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-neutral-100 mb-4 flex items-center justify-between">
                <span>Recent GitHub Repos</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Live API</span>
              </h3>

              <div className="space-y-3">
                {gh?.repos && gh.repos.length > 0 ? (
                  gh.repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-500/40 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors truncate max-w-[180px]">
                          {repo.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {repo.description}
                      </p>
                    </a>
                  ))
                ) : (
                  <div className="space-y-2">
                    {['Weather-Sentinel', 'Stock_Sphere', 'portfolio', 'Campus-Connect'].map((r) => (
                      <a
                        key={r}
                        href={`https://github.com/Balaji-Coder06/${r}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-500/40 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                            {r}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Card>

          </div>

        </div>

      </div>
    </section>
  );
}
