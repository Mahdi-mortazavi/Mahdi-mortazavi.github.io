#!/usr/bin/env node
/**
 * Builds one post per day from public, attribution-friendly sources:
 *   - Hacker News (official Algolia API) — what developers are actually reading
 *   - GitHub        (search API)         — repositories gaining traction now
 *
 * Every item links back to its original source. Nothing is republished.
 *
 * If ANTHROPIC_API_KEY is set, Claude writes original bilingual commentary
 * around the picks. Without it the post still ships, as a factual digest.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';

const TODAY = new Date().toISOString().slice(0, 10);
const OUT = `content/posts/${TODAY}.json`;

const j = async (u, opts) => {
  const r = await fetch(u, opts);
  if (!r.ok) { console.warn('  !', r.status, u.slice(0, 80)); return null; }
  return r.json();
};

/* ── Hacker News: front page over the last 24h, best first ── */
async function hackerNews(n = 6) {
  const since = Math.floor(Date.now() / 1000) - 86400;
  const d = await j(`https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>${since},points>80&hitsPerPage=40`);
  return (d?.hits ?? [])
    .filter(h => h.title && (h.url || h.objectID))
    .sort((a, b) => b.points - a.points)
    .slice(0, n)
    .map(h => ({
      kind: 'hn',
      title: h.title,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      discussion: `https://news.ycombinator.com/item?id=${h.objectID}`,
      points: h.points, comments: h.num_comments,
      domain: h.url ? new URL(h.url).hostname.replace(/^www\./, '') : 'news.ycombinator.com',
    }));
}

/* ── GitHub: repositories that gained the most stars recently ── */
async function githubTrending(n = 6) {
  const since = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mahdi-daily-digest',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
  const d = await j(`https://api.github.com/search/repositories?q=created:>${since}+stars:>50&sort=stars&order=desc&per_page=${n}`, { headers });
  return (d?.items ?? []).map(r => ({
    kind: 'repo',
    title: r.full_name,
    url: r.html_url,
    description: r.description ?? '',
    stars: r.stargazers_count,
    language: r.language,
    topics: (r.topics ?? []).slice(0, 4),
  }));
}

/* ── Optional: Claude writes the original commentary ── */
async function withClaude(items) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { console.log('ANTHROPIC_API_KEY not set — shipping the factual digest'); return null; }

  const brief = items.map((i, n) =>
    `${n + 1}. [${i.kind}] ${i.title}${i.description ? ` — ${i.description}` : ''}` +
    `${i.points ? ` (${i.points} points, ${i.comments} comments)` : ''}` +
    `${i.stars ? ` (${i.stars} stars, ${i.language ?? 'multi'})` : ''}\n   ${i.url}`).join('\n');

  const prompt = `You are Mahdi Mortazavi (مهدی مرتضوی), a full-stack developer and product builder from Iran who writes a daily developer digest. Today's picks:

${brief}

Write today's post as JSON with exactly these keys:
"title_en", "title_fa", "dek_en", "dek_fa", "intro_en", "intro_fa",
"takes": [{"i": <1-based index of the item>, "en": "...", "fa": "..."}],
"closing_en", "closing_fa"

Rules:
- Titles: specific and concrete, under 65 characters, no clickbait, no colons-plus-subtitle formula.
- dek: one sentence that says why today's set matters.
- intro: 2-3 sentences in your own voice. First-principles, practical, opinionated.
- takes: one short paragraph per item (2-3 sentences) — your actual read on why it matters to a working developer. Not a summary of the title. Add a concrete angle a reader could act on.
- closing: 1-2 sentences.
- Persian must be natural, fluent, modern Persian as a developer would write it — not translated-sounding. Use Persian technical terms where they are standard, English terms where Persian would be awkward.
- No hype words ("game-changing", "revolutionary"). No emoji in prose.
Return ONLY the JSON object.`;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.CONTENT_MODEL || 'claude-sonnet-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) { console.warn('  ! Claude API', r.status, (await r.text()).slice(0, 200)); return null; }
  const body = await r.json();
  const text = body?.content?.[0]?.text ?? '';
  try {
    return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim());
  } catch (e) {
    console.warn('  ! Claude returned unparseable JSON:', e.message);
    return null;
  }
}

/* ── main ── */
const [hn, repos] = await Promise.all([hackerNews(), githubTrending()]);
const items = [...hn, ...repos];
if (!items.length) { console.log('no items today — nothing to publish'); process.exit(0); }

const written = await withClaude(items);
const { follows } = JSON.parse(await readFile('sources.json', 'utf8'));

const post = {
  slug: TODAY,
  date: TODAY,
  authored: !!written,
  title_en: written?.title_en ?? 'Developer digest',
  title_fa: written?.title_fa ?? 'خلاصه‌ی روزانه‌ی توسعه‌دهندگان',
  dek_en: written?.dek_en ?? 'What developers are reading and starring today.',
  dek_fa: written?.dek_fa ?? 'امروز توسعه‌دهنده‌ها چه می‌خوانند و چه چیزی را ستاره می‌کنند.',
  intro_en: written?.intro_en ?? '',
  intro_fa: written?.intro_fa ?? '',
  closing_en: written?.closing_en ?? '',
  closing_fa: written?.closing_fa ?? '',
  items: items.map((it, n) => {
    const t = written?.takes?.find(x => x.i === n + 1);
    return { ...it, take_en: t?.en ?? '', take_fa: t?.fa ?? '' };
  }),
  follows,
};

await mkdir('content/posts', { recursive: true });
await writeFile(OUT, JSON.stringify(post, null, 2));
console.log(`✓ ${OUT} — ${hn.length} HN + ${repos.length} repos · authored:${post.authored}`);
