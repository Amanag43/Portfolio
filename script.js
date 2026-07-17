// Subtle reveal-on-scroll for sections below the fold.
// Respects prefers-reduced-motion via CSS; this just toggles a class.
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('.project, .about-block, .stack-group');

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  initCodeToggles();
  loadGithubStats();
});

// ---- Code snippet accordions ----
function initCodeToggles() {
  document.querySelectorAll('.code-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      panel.hidden = isOpen;
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

// ---- Live GitHub stats (client-side fetch, unauthenticated public API) ----
const GITHUB_USERNAME = 'Amanag43';

async function loadGithubStats() {
  const panel = document.getElementById('ghPanel');
  if (!panel) return;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`),
    ]);

    if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API request failed');

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Aggregate top language across public repos
    const langCounts = {};
    repos.forEach(r => {
      if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    });
    const topLanguage = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];

    // Most recently pushed repo
    const lastPush = repos
      .map(r => r.pushed_at)
      .filter(Boolean)
      .sort()
      .reverse()[0];
    const daysAgo = lastPush ? Math.floor((Date.now() - new Date(lastPush)) / 86400000) : null;
    const lastPushLabel = daysAgo === null ? '—' : daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

    const joinYear = user.created_at ? new Date(user.created_at).getFullYear() : '—';

    panel.innerHTML = `
      <div class="gh-stats-grid">
        <div class="gh-stat">
          <div class="gh-stat-value">${user.public_repos ?? '—'}</div>
          <div class="gh-stat-label mono">Public repos</div>
        </div>
        <div class="gh-stat">
          <div class="gh-stat-value">${topLanguage ? topLanguage[0] : '—'}</div>
          <div class="gh-stat-label mono">Most-used language</div>
        </div>
        <div class="gh-stat">
          <div class="gh-stat-value">${lastPushLabel}</div>
          <div class="gh-stat-label mono">Last push</div>
        </div>
        <div class="gh-stat">
          <div class="gh-stat-value">${joinYear}</div>
          <div class="gh-stat-label mono">On GitHub since</div>
        </div>
      </div>
      <p class="gh-footnote mono">Pulled live from the GitHub API on page load · <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener">github.com/${GITHUB_USERNAME} ↗</a></p>
    `;
  } catch (err) {
    panel.innerHTML = `
      <p class="gh-error mono">Couldn't reach the GitHub API just now (rate limits reset hourly) —
      see the live activity directly at <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener">github.com/${GITHUB_USERNAME} ↗</a></p>
    `;
  }
}