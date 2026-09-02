#!/usr/bin/env node
/**
 * Builds the bilingual blog.
 *
 * URL shape (one URL per language, cross-linked with hreflang — the structure
 * Google expects for multilingual sites):
 *   /blog/            English index      /blog/fa/            Persian index
 *   /blog/<slug>/     English post       /blog/fa/<slug>/     Persian post
 *   /blog/rss.xml     feed
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';

const ORIGIN = 'https://mahdi-mortazavi.github.io';
const AUTHOR = { name: 'Mahdi Mortazavi', fa: 'مهدی مرتضوی', url: ORIGIN + '/' };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const files = (await readdir('content/posts').catch(() => []))
  .filter(f => f.endsWith('.json')).sort().reverse();
const posts = [];
for (const f of files) posts.push(JSON.parse(await readFile(`content/posts/${f}`, 'utf8')));

const L = {
  en: { dir: 'ltr', lang: 'en', blog: 'Blog', home: 'Home', all: 'All posts',
        by: 'by', sources: 'Sources I follow', read: 'Read', discuss: 'Discussion',
        onHN: 'on Hacker News', repo: 'Repository', stars: 'stars',
        tagline: 'A daily read on what developers are actually building and arguing about.',
        title: 'Blog — Mahdi Mortazavi', other: 'فارسی', otherHref: s => `/blog/fa/${s}`,
        desc: 'Daily developer digest by Mahdi Mortazavi: what is on Hacker News, which repositories are gaining traction, and why it matters.' },
  fa: { dir: 'rtl', lang: 'fa', blog: 'وبلاگ', home: 'خانه', all: 'همه‌ی نوشته‌ها',
        by: 'نوشته‌ی', sources: 'منابعی که دنبال می‌کنم', read: 'خواندن', discuss: 'بحث',
        onHN: 'در هکرنیوز', repo: 'مخزن', stars: 'ستاره',
        tagline: 'روایت روزانه از اینکه توسعه‌دهنده‌ها واقعاً چه می‌سازند و سر چه بحث می‌کنند.',
        title: 'وبلاگ — مهدی مرتضوی', other: 'English', otherHref: s => `/blog/${s}`,
        desc: 'خلاصه‌ی روزانه‌ی توسعه‌دهندگان از مهدی مرتضوی: چه چیزی در هکرنیوز داغ است، کدام مخزن‌ها در حال رشدند و چرا اهمیت دارد.' },
};

const css = `*{margin:0;padding:0;box-sizing:border-box}
:root{--txt:#F5F5F7;--muted:#B9C0CC;--dim:#8A93A3;--accent:#0A84FF;--stroke:rgba(255,255,255,.14);
--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--fa:'Vazirmatn',var(--font)}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:#05070d;color:var(--txt);-webkit-font-smoothing:antialiased;
 display:flex;justify-content:center;padding:34px 18px 70px;line-height:1.6}
body[dir=rtl]{font-family:var(--fa)}
.bg{position:fixed;inset:-25%;z-index:-2;filter:blur(70px) saturate(150%);
 background:radial-gradient(38% 42% at 22% 16%,rgba(10,132,255,.45),transparent 70%),
 radial-gradient(34% 38% at 82% 28%,rgba(94,92,230,.4),transparent 70%),
 radial-gradient(40% 40% at 62% 96%,rgba(48,209,208,.22),transparent 70%)}
.w{width:100%;max-width:720px}
a{color:inherit}
.top{display:flex;justify-content:space-between;align-items:center;gap:14px;font-size:14px;font-weight:600}
.top a{color:var(--dim);text-decoration:none}.top a:hover{color:var(--txt)}
.lang{padding:6px 13px;border-radius:999px;border:1px solid var(--stroke);background:rgba(255,255,255,.05)}
h1{font-size:34px;font-weight:800;letter-spacing:-.8px;line-height:1.18;margin-top:22px}
body[dir=rtl] h1{letter-spacing:0}
.dek{color:var(--muted);font-size:17px;margin-top:12px}
.meta{color:var(--dim);font-size:13.5px;margin-top:14px}
.intro{color:var(--muted);font-size:16px;margin-top:26px}
h2{font-size:20px;font-weight:700;margin:38px 0 4px;letter-spacing:-.3px}
.card{display:block;text-decoration:none;padding:17px 19px;border-radius:19px;margin-top:14px;
 background:linear-gradient(155deg,rgba(255,255,255,.085),rgba(255,255,255,.04));
 -webkit-backdrop-filter:blur(18px) saturate(170%);backdrop-filter:blur(18px) saturate(170%);
 border:1px solid rgba(255,255,255,.13);transition:transform .18s,border-color .18s}
@media(hover:hover){.card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.3)}}
.k{font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--accent)}
.card h3{font-size:17.5px;font-weight:700;margin-top:7px;letter-spacing:-.2px}
.stat{color:var(--dim);font-size:12.5px;margin-top:7px}
.take{color:var(--muted);font-size:15px;margin-top:12px}
.links{margin-top:12px;font-size:13.5px;font-weight:600}
.links a{color:var(--accent);text-decoration:none;margin-inline-end:16px}
.closing{color:var(--muted);font-size:16px;margin-top:34px;padding-top:22px;border-top:1px solid var(--stroke)}
.follows{margin-top:30px;font-size:13.5px;color:var(--dim)}
.follows a{color:var(--muted);text-decoration:none;margin-inline-end:12px;white-space:nowrap}
.foot{margin-top:42px;padding-top:22px;border-top:1px solid var(--stroke);color:var(--dim);font-size:13.5px}
.foot a{color:var(--muted);text-decoration:none}
.entry{display:block;text-decoration:none;padding:20px 21px;border-radius:20px;margin-top:15px;
 background:linear-gradient(155deg,rgba(255,255,255,.085),rgba(255,255,255,.04));
 border:1px solid rgba(255,255,255,.13);transition:transform .18s,border-color .18s}
@media(hover:hover){.entry:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.3)}}
.entry time{color:var(--dim);font-size:12.5px;font-weight:600}
.entry h2{font-size:21px;margin:8px 0 0}
.entry p{color:var(--muted);font-size:15px;margin-top:8px}
/* Latin titles, stats and URLs stay LTR inside the Persian page; without this
   bidi moves numbers and trailing punctuation to the wrong end. */
body[dir=rtl] .card h3,body[dir=rtl] .stat,body[dir=rtl] .links{direction:ltr;text-align:right}
body[dir=rtl] .entry time{direction:ltr;display:inline-block}`;

const head = ({ t, d, url, lang, alt, article }) => `<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#05070d" />
<title>${esc(t)}</title>
<meta name="description" content="${esc(d)}" />
<link rel="canonical" href="${url}" />
<link rel="alternate" hreflang="en" href="${alt.en}" />
<link rel="alternate" hreflang="fa" href="${alt.fa}" />
<link rel="alternate" hreflang="x-default" href="${alt.en}" />
<link rel="alternate" type="application/rss+xml" title="Mahdi Mortazavi — Blog" href="${ORIGIN}/blog/rss.xml" />
<link rel="icon" type="image/png" href="/avatar.png" />
<link rel="stylesheet" href="/fonts.css" />
<link rel="stylesheet" href="/blog/blog.css" />
<meta property="og:type" content="${article ? 'article' : 'website'}" />
<meta property="og:site_name" content="Mahdi Mortazavi" />
<meta property="og:locale" content="${lang === 'fa' ? 'fa_IR' : 'en_US'}" />
<meta property="og:title" content="${esc(t)}" />
<meta property="og:description" content="${esc(d)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${ORIGIN}/og-card.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(t)}" />
<meta name="twitter:description" content="${esc(d)}" />
<meta name="twitter:image" content="${ORIGIN}/og-card.png" />`;

const nav = (l, altHref) => `<nav class="top">
  <span><a href="/">${l.home}</a> &nbsp;·&nbsp; <a href="${l.lang === 'fa' ? '/blog/fa/' : '/blog/'}">${l.blog}</a></span>
  <a class="lang" href="${altHref}">${l.other}</a>
</nav>`;

const fmt = (d, lang) => new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB',
  { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));

function postPage(p, lang) {
  const l = L[lang];
  const url = lang === 'fa' ? `${ORIGIN}/blog/fa/${p.slug}/` : `${ORIGIN}/blog/${p.slug}/`;
  const alt = { en: `${ORIGIN}/blog/${p.slug}/`, fa: `${ORIGIN}/blog/fa/${p.slug}/` };
  const t = lang === 'fa' ? p.title_fa : p.title_en;
  const dek = lang === 'fa' ? p.dek_fa : p.dek_en;
  const intro = lang === 'fa' ? p.intro_fa : p.intro_en;
  const closing = lang === 'fa' ? p.closing_fa : p.closing_en;

  const ld = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: t, description: dek, datePublished: p.date, dateModified: p.date,
    inLanguage: lang, url, mainEntityOfPage: url, image: `${ORIGIN}/og-card.png`,
    author: { '@type': 'Person', name: AUTHOR.name, alternateName: AUTHOR.fa, url: AUTHOR.url },
    publisher: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    isPartOf: { '@type': 'Blog', name: l.title, url: `${ORIGIN}/blog/` },
  };
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: AUTHOR.name, item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: l.blog, item: lang === 'fa' ? `${ORIGIN}/blog/fa/` : `${ORIGIN}/blog/` },
      { '@type': 'ListItem', position: 3, name: t, item: url },
    ],
  };

  const cards = p.items.map(it => {
    const take = lang === 'fa' ? it.take_fa : it.take_en;
    const isHN = it.kind === 'hn';
    const stat = isHN
      ? `${it.points} points · ${it.comments} comments · ${esc(it.domain)}`
      : `${it.stars} ${l.stars}${it.language ? ` · ${esc(it.language)}` : ''}`;
    return `<article class="card">
      <div class="k">${isHN ? 'Hacker News' : 'GitHub'}</div>
      <h3>${esc(it.title)}</h3>
      ${!isHN && it.description ? `<p class="stat">${esc(it.description)}</p>` : ''}
      <div class="stat">${stat}</div>
      ${take ? `<p class="take">${esc(take)}</p>` : ''}
      <div class="links">
        <a href="${esc(it.url)}" rel="noopener">${isHN ? l.read : l.repo} →</a>
        ${isHN ? `<a href="${esc(it.discussion)}" rel="noopener">${l.discuss} ${l.onHN} →</a>` : ''}
      </div>
    </article>`;
  }).join('\n');

  const follows = (p.follows ?? []).map(f =>
    `<a href="${esc(f.url)}" rel="noopener">@${esc(f.name)}</a>`).join(' ');

  return `<!doctype html>
<html lang="${l.lang}" dir="${l.dir}">
<head>
${head({ t: `${t} — ${AUTHOR.name}`, d: dek, url, lang, alt, article: true })}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body dir="${l.dir}">
<div class="bg" aria-hidden="true"></div>
<main class="w">
  ${nav(l, l.otherHref(p.slug + '/'))}
  <h1>${esc(t)}</h1>
  <p class="dek">${esc(dek)}</p>
  <p class="meta">${l.by} <a href="/">${lang === 'fa' ? AUTHOR.fa : AUTHOR.name}</a> · <time datetime="${p.date}">${fmt(p.date, lang)}</time></p>
  ${intro ? `<p class="intro">${esc(intro)}</p>` : ''}
  ${cards}
  ${closing ? `<p class="closing">${esc(closing)}</p>` : ''}
  ${follows ? `<p class="follows">${l.sources}: ${follows}</p>` : ''}
  <p class="foot"><a href="${lang === 'fa' ? '/blog/fa/' : '/blog/'}">← ${l.all}</a> &nbsp;·&nbsp; <a href="/">${lang === 'fa' ? AUTHOR.fa : AUTHOR.name}</a></p>
</main>
</body></html>`;
}

function indexPage(lang) {
  const l = L[lang];
  const url = lang === 'fa' ? `${ORIGIN}/blog/fa/` : `${ORIGIN}/blog/`;
  const alt = { en: `${ORIGIN}/blog/`, fa: `${ORIGIN}/blog/fa/` };
  const entries = posts.map(p => {
    const href = lang === 'fa' ? `/blog/fa/${p.slug}/` : `/blog/${p.slug}/`;
    return `<a class="entry" href="${href}">
      <time datetime="${p.date}">${fmt(p.date, lang)}</time>
      <h2>${esc(lang === 'fa' ? p.title_fa : p.title_en)}</h2>
      <p>${esc(lang === 'fa' ? p.dek_fa : p.dek_en)}</p>
    </a>`;
  }).join('\n') || `<p class="dek">—</p>`;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Blog',
    name: l.title, description: l.desc, url, inLanguage: lang,
    author: { '@type': 'Person', name: AUTHOR.name, alternateName: AUTHOR.fa, url: AUTHOR.url },
    blogPost: posts.slice(0, 20).map(p => ({
      '@type': 'BlogPosting',
      headline: lang === 'fa' ? p.title_fa : p.title_en,
      datePublished: p.date,
      url: lang === 'fa' ? `${ORIGIN}/blog/fa/${p.slug}/` : `${ORIGIN}/blog/${p.slug}/`,
    })),
  };

  return `<!doctype html>
<html lang="${l.lang}" dir="${l.dir}">
<head>
${head({ t: l.title, d: l.desc, url, lang, alt, article: false })}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body dir="${l.dir}">
<div class="bg" aria-hidden="true"></div>
<main class="w">
  ${nav(l, lang === 'fa' ? '/blog/' : '/blog/fa/')}
  <h1>${l.blog}</h1>
  <p class="dek">${l.tagline}</p>
  ${entries}
  <p class="foot"><a href="/">← ${lang === 'fa' ? AUTHOR.fa : AUTHOR.name}</a> &nbsp;·&nbsp; <a href="/blog/rss.xml">RSS</a></p>
</main>
</body></html>`;
}

function rss() {
  const items = posts.slice(0, 30).map(p => `  <item>
    <title>${esc(p.title_en)}</title>
    <link>${ORIGIN}/blog/${p.slug}/</link>
    <guid isPermaLink="true">${ORIGIN}/blog/${p.slug}/</guid>
    <pubDate>${new Date(p.date + 'T09:00:00Z').toUTCString()}</pubDate>
    <description>${esc(p.dek_en)}</description>
  </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Mahdi Mortazavi — Blog</title>
  <link>${ORIGIN}/blog/</link>
  <atom:link href="${ORIGIN}/blog/rss.xml" rel="self" type="application/rss+xml" />
  <description>${esc(L.en.desc)}</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>
`;
}

await mkdir('blog/fa', { recursive: true });
await writeFile('blog/blog.css', css);
await writeFile('blog/index.html', indexPage('en'));
await writeFile('blog/fa/index.html', indexPage('fa'));
await writeFile('blog/rss.xml', rss());
for (const p of posts) {
  await mkdir(`blog/${p.slug}`, { recursive: true });
  await mkdir(`blog/fa/${p.slug}`, { recursive: true });
  await writeFile(`blog/${p.slug}/index.html`, postPage(p, 'en'));
  await writeFile(`blog/fa/${p.slug}/index.html`, postPage(p, 'fa'));
}
console.log(`✓ blog: ${posts.length} post(s) × 2 languages + indexes + RSS`);
