#!/usr/bin/env node
/**
 * Pulls everything the site shows from the GitHub API into data.json:
 * headline stats, per-project stars, the star-growth series, and a
 * build-in-public timeline of releases. Run by .github/workflows/sync.yml.
 */
import { writeFile, readFile } from 'node:fs/promises';

const USER = 'Mahdi-mortazavi';
const API = 'https://api.github.com';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'mahdi-hub-sync',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};
const gh = async (p, accept) => {
  const r = await fetch(API + p, { headers: accept ? { ...headers, Accept: accept } : headers });
  if (!r.ok) { console.warn('  !', r.status, p); return null; }
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

// Star history → growth series (monthly cumulative)
const events = [];
for (const r of repos.filter(r => r.stargazers_count > 0)) {
  const pages = Math.min(3, Math.ceil(r.stargazers_count / 100));
  for (let p = 1; p <= pages; p++) {
    const rows = await gh(`/repos/${USER}/${r.name}/stargazers?per_page=100&page=${p}`,
      'application/vnd.github.star+json');
    for (const s of rows ?? []) if (s?.starred_at) events.push(s.starred_at);
  }
}
events.sort();
const growth = [];
if (events.length) {
  const key = d => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  const counts = new Map();
  for (const e of events) counts.set(key(new Date(e)), (counts.get(key(new Date(e))) ?? 0) + 1);
  const cur = new Date(events[0]); cur.setUTCDate(1);
  const end = new Date(); let total = 0;
  while (cur <= end) {
    total += counts.get(key(cur)) ?? 0;
    growth.push({ m: key(cur), v: total });
    cur.setUTCMonth(cur.getUTCMonth() + 1);
  }
}
const cut = Date.now() - 30 * 86400000;
const last30 = events.filter(e => new Date(e).getTime() >= cut).length;

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
    stars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    forks: repos.reduce((s, r) => s + r.forks_count, 0),
    repos: repos.length,
    followers: user?.followers ?? 0,
    last30,
  },
  bio: (user?.bio ?? '').split('\n')[0].trim(),
  stats, growth, timeline: timeline.slice(0, 40),
};
await writeFile('data.json', JSON.stringify(data, null, 2));
console.log(`✓ data.json — ${data.totals.stars}★ · ${growth.length} growth points · ${timeline.length} releases`);
