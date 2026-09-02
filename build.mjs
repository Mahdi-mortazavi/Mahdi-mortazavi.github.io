#!/usr/bin/env node
/**
 * Builds the hub's SEO surface:
 *   p/<slug>/index.html  — one indexable page per project, each with
 *                          SoftwareApplication structured data
 *   sitemap.xml, robots.txt
 * Run: node build.mjs
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';

const ORIGIN = 'https://mahdi-mortazavi.github.io';
const GH = 'https://github.com/Mahdi-mortazavi';
const { person, projects } = JSON.parse(await readFile('projects.json', 'utf8'));
let live = { totals: {}, stats: {}, timeline: [], growth: [] };
try { live = JSON.parse(await readFile('data.json', 'utf8')); console.log('using data.json'); }
catch { console.log('no data.json yet — pages render without live numbers'); }
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const page = p => {
  const url = `${ORIGIN}/p/${p.slug}/`;
  const repo = `${GH}/${p.repo}`;
  const ld = {
    '@context':'https://schema.org','@type':'SoftwareApplication',
    name:p.name, alternateName:p.repo, url, sameAs:[repo],
    description:p.desc, applicationCategory:'DeveloperApplication',
    operatingSystem:p.os, programmingLanguage:p.lang,
    isAccessibleForFree:true, license:'https://opensource.org/licenses',
    offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},
    author:{'@type':'Person',name:person.name,alternateName:person.nameFa,url:person.url,sameAs:person.sameAs},
  };
  const crumbs = {
    '@context':'https://schema.org','@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'Mahdi Mortazavi',item:ORIGIN+'/'},
      {'@type':'ListItem',position:2,name:'Projects',item:ORIGIN+'/p/'},
      {'@type':'ListItem',position:3,name:p.name,item:url},
    ],
  };
  const title = `${p.name} — ${p.tagline} | Mahdi Mortazavi`;
  const chips = p.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#05070d" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.desc)}" />
<link rel="canonical" href="${url}" />
<link rel="icon" type="image/png" href="/avatar.png" />
<link rel="stylesheet" href="/fonts.css" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Mahdi Mortazavi" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(p.desc)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${ORIGIN}/og-card.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(p.desc)}" />
<meta name="twitter:image" content="${ORIGIN}/og-card.png" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
<style>
:root{--accent:${p.accent};--txt:#F5F5F7;--muted:#B9C0CC;--dim:#8A93A3;--stroke:rgba(255,255,255,.16);
--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--fa:'Vazirmatn',var(--font)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--font);color:var(--txt);background:#05070d;min-height:100vh;
 -webkit-font-smoothing:antialiased;display:flex;justify-content:center;
 padding:max(28px,env(safe-area-inset-top)) 18px 56px}
.bg{position:fixed;inset:-25%;z-index:-2;filter:blur(70px) saturate(150%);
 background:radial-gradient(38% 42% at 24% 18%,${p.accent}88,transparent 70%),
 radial-gradient(34% 38% at 80% 26%,rgba(94,92,230,.45),transparent 70%),
 radial-gradient(42% 44% at 66% 92%,rgba(48,209,208,.28),transparent 70%)}
.wrap{width:100%;max-width:640px}
a{color:inherit}
.back{display:inline-flex;gap:8px;align-items:center;text-decoration:none;color:var(--dim);
 font-size:14px;font-weight:600;margin-bottom:18px}
.back:hover{color:var(--txt)}
.card{padding:32px 28px;border-radius:28px;
 background:linear-gradient(155deg,rgba(255,255,255,.11),rgba(255,255,255,.055));
 -webkit-backdrop-filter:blur(30px) saturate(185%);backdrop-filter:blur(30px) saturate(185%);
 border:1px solid var(--stroke);
 box-shadow:0 12px 50px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.28)}
.ic{width:74px;height:74px;border-radius:22px;display:grid;place-items:center;font-size:36px;
 background:${p.accent}2e;border:1px solid ${p.accent}66;margin-bottom:18px}
h1{font-size:34px;font-weight:800;letter-spacing:-.8px}
.tag{color:var(--muted);font-size:18px;font-weight:600;margin-top:8px}
.fa{font-family:var(--fa);direction:rtl}
.tagfa{color:var(--dim);font-size:15px;margin-top:6px}
p.desc{color:var(--muted);font-size:15px;line-height:1.7;margin-top:18px}
p.descfa{color:var(--dim);font-size:14px;line-height:1.9;margin-top:10px}
.chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:20px}
.chip{padding:8px 15px;border-radius:999px;font-size:13.5px;font-weight:600;color:#C9D1D9;
 background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13)}
.meta{display:flex;gap:22px;flex-wrap:wrap;margin-top:22px;font-size:13.5px;color:var(--dim)}
.meta b{color:var(--muted);font-weight:600}
.cta{display:flex;gap:11px;flex-wrap:wrap;margin-top:26px}
.btn{flex:1 1 180px;display:flex;align-items:center;justify-content:center;gap:9px;
 padding:15px 18px;border-radius:17px;text-decoration:none;font-weight:650;font-size:15.5px;
 border:1px solid var(--stroke);background:linear-gradient(155deg,rgba(255,255,255,.1),rgba(255,255,255,.05));
 transition:transform .18s,border-color .18s}
.btn.primary{background:linear-gradient(155deg,${p.accent}cc,${p.accent}77);border-color:${p.accent}}
@media(hover:hover){.btn:hover{transform:translateY(-2px);border-color:#fff6}}
.foot{text-align:center;color:var(--dim);font-size:13px;margin-top:26px;line-height:1.9}
.foot a{color:var(--muted);text-decoration:none}
</style>
</head>
<body>
<div class="bg" aria-hidden="true"></div>
<main class="wrap">
  <a class="back" href="/">← Mahdi Mortazavi · <span class="fa">مهدی مرتضوی</span></a>
  <article class="card">
    <div class="ic" aria-hidden="true">${p.icon}</div>
    <h1>${esc(p.name)}</h1>
    <div class="tag">${esc(p.tagline)}</div>
    <div class="tagfa fa">${esc(p.taglineFa)}</div>
    <p class="desc">${esc(p.desc)}</p>
    <p class="descfa fa">${esc(p.descFa)}</p>
    <div class="chips">${chips}</div>
    <div class="meta">
      <span><b>Platform</b> · ${esc(p.os)}</span>
      <span><b>Built with</b> · ${esc(p.lang)}</span>
      <span><b>Stars</b> · <span data-stars="${esc(p.repo)}">${live.stats?.[p.slug]?.stars != null ? "★ " + live.stats[p.slug].stars : "—"}</span></span>
    </div>
    <div class="cta">
      <a class="btn primary" href="${repo}">Open on GitHub →</a>
      <a class="btn" href="${repo}/releases/latest">Download</a>
    </div>
  </article>
  <p class="foot">
    An open-source project by <a href="/"><b>Mahdi Mortazavi</b></a> · <span class="fa">مهدی مرتضوی</span><br/>
    <a href="https://t.me/Mahdi_mortazavi1">Telegram</a> · <a href="${GH}">GitHub</a>
  </p>
</main>
<script>
fetch('https://api.github.com/repos/Mahdi-mortazavi/${p.repo}')
  .then(r=>r.ok?r.json():null)
  .then(d=>{if(d)document.querySelectorAll('[data-stars]').forEach(e=>e.textContent='★ '+d.stargazers_count)})
  .catch(()=>{});
</script>
</body>
</html>`;
};

for (const p of projects) {
  await mkdir(`p/${p.slug}`, { recursive: true });
  await writeFile(`p/${p.slug}/index.html`, page(p));
}

// Projects index
const list = projects.map(p =>
  `<li><a href="/p/${p.slug}/"><span>${p.icon}</span><b>${esc(p.name)}</b> — ${esc(p.tagline)}</a></li>`).join('\n');
await writeFile('p/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Open-Source Projects — Mahdi Mortazavi · مهدی مرتضوی</title>
<meta name="description" content="Open-source projects by Mahdi Mortazavi (مهدی مرتضوی): ${projects.map(p=>p.name).join(', ')}." />
<link rel="canonical" href="${ORIGIN}/p/" /><link rel="stylesheet" href="/fonts.css" />
<link rel="icon" type="image/png" href="/avatar.png" />
<meta property="og:title" content="Open-Source Projects — Mahdi Mortazavi" />
<meta property="og:description" content="Open-source projects by Mahdi Mortazavi (مهدی مرتضوی)." />
<meta property="og:url" content="${ORIGIN}/p/" />
<meta property="og:image" content="${ORIGIN}/og-card.png" />
<meta name="twitter:card" content="summary_large_image" />
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;background:#05070d;color:#F5F5F7;
 display:flex;justify-content:center;padding:40px 18px 60px;-webkit-font-smoothing:antialiased}
.bg{position:fixed;inset:-25%;z-index:-2;filter:blur(70px) saturate(150%);
 background:radial-gradient(38% 42% at 22% 18%,rgba(10,132,255,.5),transparent 70%),
 radial-gradient(34% 38% at 82% 26%,rgba(94,92,230,.45),transparent 70%)}
.w{width:100%;max-width:620px}
h1{font-size:30px;font-weight:800;letter-spacing:-.6px}
.s{color:#B9C0CC;margin-top:8px;font-size:15px}
ul{list-style:none;margin-top:26px}
li a{display:flex;gap:12px;align-items:center;text-decoration:none;color:#F5F5F7;
 padding:16px 18px;margin-bottom:11px;border-radius:18px;font-size:15px;
 background:linear-gradient(155deg,rgba(255,255,255,.09),rgba(255,255,255,.045));
 border:1px solid rgba(255,255,255,.13);transition:transform .18s,border-color .18s}
li a:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.3)}
a.back{color:#8A93A3;text-decoration:none;font-size:14px;font-weight:600}
</style></head>
<body><div class="bg"></div><main class="w">
<a class="back" href="/">← Mahdi Mortazavi · مهدی مرتضوی</a>
<h1 style="margin-top:16px">Open-Source Projects</h1>
<p class="s">Everything I build in the open — by <b>Mahdi Mortazavi</b> (مهدی مرتضوی).</p>
<ul>
${list}
</ul></main></body></html>`);


/* ── Build-in-public timeline: one dated entry per release. Fresh, indexable
      content that grows on its own every time something ships. ── */
{
  const items = live.timeline ?? [];
  const fmt = iso => new Intl.DateTimeFormat('en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
  const ld = {
    '@context':'https://schema.org','@type':'CollectionPage',
    name:'Build in Public — Mahdi Mortazavi', url:`${ORIGIN}/timeline/`,
    description:'Every public release across the open-source projects of Mahdi Mortazavi (مهدی مرتضوی).',
    isPartOf:{'@id':`${ORIGIN}/#website`},
    about:{'@type':'Person',name:person.name,alternateName:person.nameFa,url:person.url},
    hasPart: items.slice(0,20).map(i => ({
      '@type':'SoftwareApplication', name:`${i.repo} ${i.tag}`,
      softwareVersion:i.tag, datePublished:i.at, url:i.url,
      applicationCategory:'DeveloperApplication',
      author:{'@type':'Person',name:person.name},
    })),
  };
  const rows = items.length ? items.map(i => `
      <li class="ev">
        <div class="dot" aria-hidden="true"></div>
        <time datetime="${i.at}">${fmt(i.at)}</time>
        <div class="body">
          <a class="h" href="${i.url}"><b>${esc(i.repo)}</b> <span class="tag">${esc(i.tag)}</span></a>
          ${i.body ? `<p>${esc(i.body)}</p>` : ''}
          ${i.slug ? `<a class="more" href="/p/${i.slug}/">About ${esc(i.repo)} →</a>` : ''}
        </div>
      </li>`).join('') : '<li class="ev"><div class="body"><p>No releases published yet.</p></div></li>';

  await mkdir('timeline', { recursive: true });
  await writeFile('timeline/index.html', `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#05070d" />
<title>Build in Public — every release by Mahdi Mortazavi · مهدی مرتضوی</title>
<meta name="description" content="A running log of every public release Mahdi Mortazavi (مهدی مرتضوی) ships across relay, Flow, Nava, purify, sooda and overrun. Updated automatically." />
<link rel="canonical" href="${ORIGIN}/timeline/" />
<link rel="icon" type="image/png" href="/avatar.png" />
<link rel="stylesheet" href="/fonts.css" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Build in Public — Mahdi Mortazavi" />
<meta property="og:description" content="Every public release, as it ships. By Mahdi Mortazavi (مهدی مرتضوی)." />
<meta property="og:url" content="${ORIGIN}/timeline/" />
<meta property="og:image" content="${ORIGIN}/og-card.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${ORIGIN}/og-card.png" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--txt:#F5F5F7;--muted:#B9C0CC;--dim:#8A93A3;--accent:#0A84FF;
--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;--fa:'Vazirmatn',var(--font)}
body{font-family:var(--font);background:#05070d;color:var(--txt);display:flex;justify-content:center;
 padding:40px 18px 70px;-webkit-font-smoothing:antialiased}
.bg{position:fixed;inset:-25%;z-index:-2;filter:blur(70px) saturate(150%);
 background:radial-gradient(38% 42% at 22% 16%,rgba(10,132,255,.5),transparent 70%),
 radial-gradient(34% 38% at 82% 30%,rgba(94,92,230,.42),transparent 70%),
 radial-gradient(40% 40% at 60% 95%,rgba(48,209,208,.24),transparent 70%)}
.w{width:100%;max-width:660px}
a{color:inherit}
.back{color:var(--dim);text-decoration:none;font-size:14px;font-weight:600}
.back:hover{color:var(--txt)}
h1{font-size:31px;font-weight:800;letter-spacing:-.7px;margin-top:16px}
.sub{color:var(--muted);font-size:15px;margin-top:8px;line-height:1.65}
.subfa{font-family:var(--fa);direction:rtl;color:var(--dim);font-size:14px;margin-top:6px}
ul{list-style:none;margin-top:30px;position:relative}
ul:before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:2px;
 background:linear-gradient(#0A84FF,rgba(10,132,255,.05))}
.ev{position:relative;padding-left:34px;padding-bottom:26px}
.dot{position:absolute;left:0;top:5px;width:16px;height:16px;border-radius:50%;
 background:#0A84FF;box-shadow:0 0 0 4px rgba(10,132,255,.16)}
time{display:block;font-size:12.5px;font-weight:600;color:var(--dim);letter-spacing:.4px}
.body{margin-top:6px;padding:15px 17px;border-radius:17px;
 background:linear-gradient(155deg,rgba(255,255,255,.09),rgba(255,255,255,.04));
 -webkit-backdrop-filter:blur(18px) saturate(170%);backdrop-filter:blur(18px) saturate(170%);
 border:1px solid rgba(255,255,255,.13)}
.h{text-decoration:none;font-size:16px;font-weight:650}
.tag{display:inline-block;margin-left:6px;padding:2px 9px;border-radius:999px;font-size:12px;
 color:#9EC9FF;background:rgba(10,132,255,.16);border:1px solid rgba(10,132,255,.35)}
.body p{color:var(--muted);font-size:14px;line-height:1.65;margin-top:8px}
.more{display:inline-block;margin-top:10px;font-size:13px;font-weight:600;color:var(--dim);text-decoration:none}
.more:hover{color:var(--txt)}
</style></head>
<body><div class="bg" aria-hidden="true"></div><main class="w">
<a class="back" href="/">← Mahdi Mortazavi · <span style="font-family:var(--fa)">مهدی مرتضوی</span></a>
<h1>Build in Public</h1>
<p class="sub">Every public release I ship, newest first — generated automatically from GitHub.</p>
<p class="subfa">هر نسخه‌ای که منتشر می‌کنم، از جدید به قدیم — به‌صورت خودکار از گیت‌هاب ساخته می‌شود.</p>
<ul>${rows}</ul>
</main></body></html>`);
  console.log('✓ timeline:', items.length, 'releases');
}

// sitemap + robots
const postSlugs = (await readdir('content/posts').catch(() => []))
  .filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')).sort().reverse();
const urls = [
  `${ORIGIN}/`, `${ORIGIN}/p/`, `${ORIGIN}/timeline/`,
  `${ORIGIN}/blog/`, `${ORIGIN}/blog/fa/`,
  ...projects.map(p => `${ORIGIN}/p/${p.slug}/`),
  ...postSlugs.flatMap(s => [`${ORIGIN}/blog/${s}/`, `${ORIGIN}/blog/fa/${s}/`]),
];
const today = new Date().toISOString().slice(0, 10);
await writeFile('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${i === 0 ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
await writeFile('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log(`✓ ${projects.length} project pages + index + sitemap(${urls.length}) + robots`);
