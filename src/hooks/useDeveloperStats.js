import { useState, useEffect, useCallback } from 'react';

const USERNAME = 'Balaji-Coder06';
const CACHE_KEY = 'dev_stats_cache_v2';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache for high performance & auto-freshness

// Helper to generate fallback 365-day contribution calendar if offline
function generateFallbackContributions() {
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      count: 0,
      level: 0
    });
  }
  return {
    totalContributions: 167,
    days
  };
}

export function useDeveloperStats() {
  // Initialize from localStorage cache if available for instant rendering
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.data) return parsed.data;
      }
    } catch {
      // Ignore storage errors
    }
    return {
      github: null,
      contributions: generateFallbackContributions(),
    };
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const fetchAllStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache if not forcing refresh
      if (!forceRefresh) {
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (
              parsed?.timestamp &&
              Date.now() - parsed.timestamp < CACHE_TTL_MS &&
              parsed?.data?.github &&
              parsed?.data?.contributions?.days?.length > 0
            ) {
              setStats(parsed.data);
              setLastSynced(new Date(parsed.timestamp));
              setLoading(false);
              return;
            }
          }
        } catch {
          // Continue to fetch
        }
      }

      // Fetch live GitHub user, repositories, and contribution history simultaneously
      const [ghResult, ghReposResult, ghContribResult] = await Promise.allSettled([
        fetch(`https://api.github.com/users/${USERNAME}`).then((r) => (r.ok ? r.json() : null)),
        fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=10`).then((r) => (r.ok ? r.json() : [])),
        fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then((r) => (r.ok ? r.json() : null)),
      ]);

      // 1. Process GitHub User Profile & Repositories
      let githubData = null;
      if (ghResult.status === 'fulfilled' && ghResult.value) {
        const user = ghResult.value;
        const repos = ghReposResult.status === 'fulfilled' && Array.isArray(ghReposResult.value) ? ghReposResult.value : [];
        const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

        const langMap = {};
        repos.forEach((r) => {
          if (r.language) {
            langMap[r.language] = (langMap[r.language] || 0) + 1;
          }
        });
        const totalLangs = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
        const languages = Object.entries(langMap)
          .map(([name, count]) => ({
            name,
            percent: Math.round((count / totalLangs) * 100),
          }))
          .sort((a, b) => b.percent - a.percent);

        githubData = {
          username: user.login || USERNAME,
          name: user.name || 'S Balaji',
          avatar: user.avatar_url,
          bio: user.bio || 'Computer Science Engineering Student & Full Stack Engineer',
          publicRepos: user.public_repos,
          followers: user.followers,
          following: user.following,
          totalStars: totalStars,
          repos: repos.slice(0, 4).map((r) => ({
            id: r.id,
            name: r.name,
            url: r.html_url,
            stars: r.stargazers_count,
            forks: r.forks_count,
            description: r.description || 'Public GitHub project',
            language: r.language,
          })),
          languages:
            languages.length > 0
              ? languages
              : [
                  { name: 'JavaScript / React', percent: 45 },
                  { name: 'HTML5 & CSS3', percent: 30 },
                  { name: 'C / C++', percent: 15 },
                  { name: 'Python', percent: 10 },
                ],
        };
      }

      // 2. Process GitHub Contribution Activity & Telemetry
      let contributionsData = null;
      if (ghContribResult.status === 'fulfilled' && ghContribResult.value) {
        const contribJson = ghContribResult.value;
        const days = Array.isArray(contribJson.contributions) ? contribJson.contributions : [];
        const totalLastYear = contribJson.total?.lastYear ?? days.reduce((sum, d) => sum + (d.count || 0), 0);

        if (days.length > 0) {
          contributionsData = {
            totalContributions: totalLastYear,
            days: days.map((d) => ({
              date: d.date,
              count: d.count ?? 0,
              level: d.level ?? (d.count > 0 ? Math.min(4, Math.ceil(d.count / 2)) : 0),
            })),
          };
        }
      }

      const freshData = {
        github: githubData || stats.github,
        contributions: contributionsData || stats.contributions || generateFallbackContributions(),
      };

      const now = new Date();
      setStats(freshData);
      setLastSynced(now);

      // Save to localStorage cache
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: now.getTime(),
            data: freshData,
          })
        );
      } catch {
        // Storage quota or disabled, ignore
      }
    } catch (err) {
      console.error('Error fetching developer stats:', err);
      setError('Network issue fetching live API stats');
    } finally {
      setLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  return {
    stats,
    loading,
    error,
    lastSynced,
    refetch: () => fetchAllStats(true),
  };
}
