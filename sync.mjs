#!/usr/bin/env node
/**
 * Pulls everything the site shows from the GitHub API into data.json:
 * headline stats, per-project stars, the star-growth series, and a
 * build-in-public timeline of releases. Run by .github/workflows/sync.yml.
 */
import { writeFile, readFile } from 'node:fs/promises';

const USER = 'Mahdi-mortazavi';
const API = 'https://api.github.com';
// STARS_TOKEN (optional) is a personal token with public-repo read — the only
// credential GitHub accepts for cross-repo /stargazers (GITHUB_TOKEN gets 403,
// anonymous gets 401). Without it the growth curve still works, built from the
// daily snapshots in history.json instead of backfilled timestamps.
const TOKEN = process.env.STARS_TOKEN || process.env.GITHUB_TOKEN;
// Which credential are we actually using? Length only — never the value.
console.log('auth:', process.env.STARS_TOKEN ? `STARS_TOKEN (${process.env.STARS_TOKEN.length} chars)`
  : process.env.GITHUB_TOKEN ? 'GITHUB_TOKEN (STARS_TOKEN not set)' : 'anonymous (no token)');
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'mahdi-hub-sync',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};
const gh = async (p, accept) => {
  const h = accept ? { ...headers, Accept: accept } : { ...headers };
  let r = await fetch(API + p, { headers: h });
  // The repo-scoped GITHUB_TOKEN is refused (403) on some cross-repo reads,
  // stargazer timestamps among them. That data is public — ask again without
  // credentials rather than losing the history entirely.
  const authStatus = r.status;
  let retried = false;
  if (r.status === 403 && h.Authorization) {
    const { Authorization, ...anon } = h;
    r = await fetch(API + p, { headers: anon });
    retried = true;
  }
  if (!r.ok) {
    console.warn(`  ! ${p} — authed:${authStatus}${retried ? ` anon:${r.status}` : ''}`);
    return null;
  }
  if (retried) console.log('  ↩ anonymous retry succeeded:', p);
  return r.json();
};

const { projects } = JSON.parse(await readFile('projects.json', 'utf8'));

const user = await gh(`/users/${USER}`);
const all = (await gh(`/users/${USER}/repos?per_page=100&sort=updated`)) ?? [];
const repos = all.filter(r => !r.fork && !r.private);

// Per-project live facts
const byName = Object.fromEntries(repos.map(r => [r.name.toLowerCase(), r]));
const stats = {};
for (const p of projects) {
  const r = byName[p.repo.toLowerCase()];
  if (!r) continue;
  stats[p.slug] = {
    stars: r.stargazers_count, forks: r.forks_count,
    language: r.language, pushedAt: r.pushed_at, description: r.description,
  };
}

// ── Growth series ──────────────────────────────────────────────────────
// Preferred source: real starred_at timestamps. The repo-scoped GITHUB_TOKEN
// is refused (403) on cross-repo /stargazers, so this usually yields nothing —
// hence the snapshot history below, which always works and accumulates.
const events = [];
for (const r of repos.filter(r => r.stargazers_count > 0)) {
  const pages = Math.min(3, Math.ceil(r.stargazers_count / 100));
  for (let p = 1; p <= pages; p++) {
    const rows = await gh(`/repos/${USER}/${r.name}/stargazers?per_page=100&page=${p}`,
      'application/vnd.github.star+json');
    if (!Array.isArray(rows)) { p = pages; continue; }
    for (const s of rows) if (s?.starred_at) events.push(s.starred_at);
  }
}
events.sort();

const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);

// Snapshot history: one row per day, appended every run. Always available.
const today = new Date().toISOString().slice(0, 10);
let history = [];
try { history = JSON.parse(await readFile('history.json', 'utf8')); } catch {}
history = history.filter(h => h.d !== today);
history.push({ d: today, stars: totalStars, followers: user?.followers ?? 0, repos: repos.length });
history.sort((a, b) => a.d.localeCompare(b.d));
await writeFile('history.json', JSON.stringify(history, null, 2));

const monthKey = d => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
let growth = [];
if (events.length) {
  const counts = new Map();
  for (const e of events) {
    const k = monthKey(new Date(e));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const cur = new Date(events[0]); cur.setUTCDate(1);
  const end = new Date(); let total = 0;
  while (cur <= end) { total += counts.get(monthKey(cur)) ?? 0; growth.push({ m: monthKey(cur), v: total }); cur.setUTCMonth(cur.getUTCMonth() + 1); }
} else {
  // Fall back to the snapshot history (one point per recorded day).
  growth = history.map(h => ({ m: h.d, v: h.stars }));
}

// Stars gained in the last 30 days: from real timestamps when we have them,
// otherwise measured against the oldest snapshot inside the window.
const cut = Date.now() - 30 * 86400000;
let last30;
if (events.length) {
  last30 = events.filter(e => new Date(e).getTime() >= cut).length;
} else {
  const window = history.filter(h => new Date(h.d).getTime() >= cut);
  last30 = window.length > 1 ? totalStars - window[0].stars : 0;
}

// Build-in-public timeline: every public release, newest first
const timeline = [];
for (const r of repos) {
  const rels = (await gh(`/repos/${USER}/${r.name}/releases?per_page=20`)) ?? [];
  for (const rel of rels) {
    if (rel.draft) continue;
    timeline.push({
      repo: r.name, slug: (projects.find(p => p.repo.toLowerCase() === r.name.toLowerCase()) || {}).slug ?? null,
      tag: rel.tag_name, name: rel.name || rel.tag_name,
      at: rel.published_at, url: rel.html_url,
      body: (rel.body ?? '').split('\n').filter(Boolean).slice(0, 3).join(' ').slice(0, 260),
    });
  }
}
timeline.sort((a, b) => new Date(b.at) - new Date(a.at));

const data = {
  generatedAt: new Date().toISOString(),
  totals: {
    stars: totalStars,
    forks: repos.reduce((s, r) => s + r.forks_count, 0),
    repos: repos.length,
    followers: user?.followers ?? 0,
    last30,
  },
  bio: (user?.bio ?? '').split('\n')[0].trim(),
  growthSource: events.length ? 'stargazer-timestamps' : 'daily-snapshots',
  stats, growth, timeline: timeline.slice(0, 40),
};
await writeFile('data.json', JSON.stringify(data, null, 2));
console.log(`✓ data.json — ${data.totals.stars}★ · ${growth.length} growth points · ${timeline.length} releases`);
