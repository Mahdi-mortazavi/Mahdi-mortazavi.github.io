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

/* ── Media: real screenshots and screen recordings, rendered as a horizontal
      scroll-snap gallery (App Store style) with a lightbox for full size. ── */
const BUILT = new Date().toISOString().slice(0, 10);

const gallery = p => {
  const m = p.media ?? [];
  if (!m.length) return '';
  const items = m.map((x, i) => {
    const or = x.w > x.h ? 'land' : 'port';
    const cap = `<figcaption>${esc(x.caption)}<span class="capfa fa">${esc(x.captionFa)}</span></figcaption>`;
    if (x.type === 'video') {
      return `<figure class="m ${or} vid">
        <div class="vwrap">
        <video class="mv" poster="${x.poster}" width="${x.w}" height="${x.h}"
               muted loop playsinline preload="none" controls
               aria-label="${esc(x.alt)}">
          <source src="${x.mp4}" type="video/mp4" />
          <source src="${x.webm}" type="video/webm" />
        </video>
        <span class="play" aria-hidden="true"></span>
      </div>${cap}</figure>`;
    }
    return `<figure class="m ${or}">
      <button type="button" class="mb" data-i="${i}" data-full="${x.src}"
              data-cap="${esc(x.caption)}" aria-label="${esc(x.alt)} — open full size">
        <img src="${x.thumb ?? x.src}" width="${x.w}" height="${x.h}"
             loading="lazy" decoding="async" alt="${esc(x.alt)}" />
      </button>${cap}</figure>`;
  }).join('\n');
  const nv = m.filter(x => x.type === 'video').length;
  const en = nv ? 'Screens & video' : 'Screens';
  const fa = nv ? 'تصاویر و ویدیو' : 'تصاویر';
  return `
    <section class="gal" aria-label="Screenshots of ${esc(p.name)}">
      <h2 class="galh">${en} <span class="galn">${m.length}</span><span class="fa galhfa">${fa}</span></h2>
      <div class="stripw"><div class="strip">${items}</div></div>
    </section>`;
};

/* Structured data for the media, so Google can surface it in image and video search. */
const mediaLd = p => {
  const m = p.media ?? [];
  const url = `${ORIGIN}/p/${p.slug}/`;
  return m.filter(x => x.type === 'video').map(x => JSON.stringify({
    '@context':'https://schema.org','@type':'VideoObject',
    name:`${p.name} — ${x.caption}`, description:x.alt,
    thumbnailUrl:[ORIGIN + x.poster], contentUrl:ORIGIN + x.mp4,
    uploadDate:BUILT, width:x.w, height:x.h, isFamilyFriendly:true,
    embedUrl:url, contentSize:undefined,
    author:{'@type':'Person',name:person.name,alternateName:person.nameFa,url:person.url},
  }));
};

const mediaImages = p => (p.media ?? []).filter(x => x.type === 'image').map(x => ({
  '@type':'ImageObject', contentUrl:ORIGIN + x.src, url:ORIGIN + x.src,
  width:x.w, height:x.h, caption:x.caption,
}));

/* Social cards, best first: a purpose-built 1200x630 card if one has been
   generated for this project, then the widest real landscape shot, then the
   site-wide card. SVG and small squares never make good previews. */
const ogCards = new Set(
  await readdir('assets/og').catch(() => [])
);
const socialImage = p => {
  if (ogCards.has(`${p.slug}.png`)) return `${ORIGIN}/assets/og/${p.slug}.png`;
  const land = (p.media ?? [])
    .filter(x => x.type === 'image' && x.w > x.h && x.w >= 600 && !x.src.endsWith('.svg'))
    .sort((a, b) => b.w - a.w)[0];
  if (land) return ORIGIN + land.src;
  const vid = (p.media ?? []).find(x => x.type === 'video' && x.w > x.h);
  if (vid) return ORIGIN + vid.poster;
  return `${ORIGIN}/og-card.png`;
};

const page = p => {
  const url = `${ORIGIN}/p/${p.slug}/`;
  const repo = `${GH}/${p.repo}`;
  const gal = gallery(p);
  const og = socialImage(p);
  const shots = mediaImages(p);
  const ld = {
    '@context':'https://schema.org','@type':'SoftwareApplication',
    name:p.name, alternateName:p.repo, url, sameAs:[repo],
    description:p.desc, applicationCategory:'DeveloperApplication',
    operatingSystem:p.os, programmingLanguage:p.lang,
    isAccessibleForFree:true, license:'https://opensource.org/licenses',
    offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},
    author:{'@type':'Person',name:person.name,alternateName:person.nameFa,url:person.url,sameAs:person.sameAs},
    ...(shots.length ? { screenshot: shots, image: shots.map(s => s.contentUrl) } : {}),
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
<meta property="og:image" content="${og}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(p.desc)}" />
<meta name="twitter:image" content="${og}" />
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
${mediaLd(p).map(j => `<script type="application/ld+json">${j}</script>`).join('\n')}
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
/* ── media gallery ── */
.gal{margin-top:26px}
.galh{font-size:13px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;
 color:var(--dim);display:flex;align-items:baseline;gap:9px}
.galn{font-size:11.5px;letter-spacing:0;padding:2px 8px;border-radius:999px;color:#C9D1D9;
 background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}
.galhfa{font-size:12.5px;letter-spacing:0;text-transform:none;font-weight:600;opacity:.85}
/* full-bleed scroller: the negative margin lets media reach the card edge,
   the matching padding keeps the first item aligned with the body text */
.stripw{position:relative;margin:14px -28px 0}
.stripw:after{content:"";position:absolute;top:0;bottom:16px;right:0;width:46px;pointer-events:none;
 background:linear-gradient(90deg,transparent,rgba(5,7,13,.55))}
.strip{display:flex;gap:14px;overflow-x:auto;overscroll-behavior-x:contain;
 scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;
 padding:2px 28px 16px;scrollbar-width:thin;
 scrollbar-color:rgba(255,255,255,.22) transparent}
.strip::-webkit-scrollbar{height:7px}
.strip::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2);border-radius:99px}
.strip>*:last-child{padding-right:28px}
.m{flex:0 0 auto;scroll-snap-align:center;margin:0}
.m img,.m video{display:block;width:auto;max-width:84vw;object-fit:contain;
 border-radius:16px;border:1px solid var(--stroke);background:#080c14;
 box-shadow:0 8px 28px rgba(0,0,0,.4)}
/* wide shots stay short enough that the next one peeks in; tall phone shots
   get the height they need to stay readable */
.m.land img,.m.land video{height:clamp(210px,34vh,330px)}
.m.port img,.m.port video{height:clamp(300px,48vh,430px)}
/* a video that has not started yet still needs to look playable */
.vwrap{position:relative;display:inline-block;line-height:0}
.play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
 width:58px;height:58px;border-radius:50%;pointer-events:none;transition:opacity .2s;
 background:rgba(10,12,20,.55);border:1px solid rgba(255,255,255,.5);
 -webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.play:after{content:"";position:absolute;left:53%;top:50%;transform:translate(-50%,-50%);
 border-style:solid;border-width:11px 0 11px 18px;border-color:transparent transparent transparent #fff}
.vwrap.playing .play{opacity:0}
.mb{display:block;padding:0;border:0;background:none;cursor:zoom-in;border-radius:16px}
.mb:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media(hover:hover){.mb:hover img{border-color:rgba(255,255,255,.42)}}
.m figcaption{color:var(--dim);font-size:12.5px;line-height:1.6;margin-top:10px;
 max-width:min(320px,84vw);white-space:normal}
.capfa{display:block;margin-top:3px;font-size:12px;opacity:.78}
/* ── lightbox ── */
.lb{position:fixed;inset:0;z-index:50;display:none;place-items:center;padding:20px;
 background:rgba(3,5,10,.9);-webkit-backdrop-filter:blur(22px);backdrop-filter:blur(22px)}
.lb[open]{display:grid}
.lb img{max-width:min(1200px,94vw);max-height:82vh;width:auto;height:auto;
 border-radius:18px;border:1px solid var(--stroke)}
.lbc{color:var(--muted);font-size:13.5px;text-align:center;margin-top:14px;max-width:min(700px,90vw)}
.lbx,.lbn,.lbp{position:absolute;background:rgba(255,255,255,.1);border:1px solid var(--stroke);
 color:#fff;border-radius:50%;width:44px;height:44px;font-size:19px;cursor:pointer;
 display:grid;place-items:center;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
.lbx{top:18px;right:18px}.lbp{left:14px}.lbn{right:14px}
.lbp,.lbn{top:50%;transform:translateY(-50%)}
@media(max-width:520px){.lbp,.lbn{top:auto;bottom:18px;transform:none}}
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
    ${gal}
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
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Full-size screenshot">
  <button class="lbx" id="lbx" aria-label="Close">&times;</button>
  <button class="lbp" id="lbp" aria-label="Previous">&#8249;</button>
  <button class="lbn" id="lbn" aria-label="Next">&#8250;</button>
  <div><img id="lbi" alt="" /><p class="lbc" id="lbc"></p></div>
</div>
<script>
/* Play the screen recording only while it is on screen — never on load. */
(function(){
  var vs = [].slice.call(document.querySelectorAll('.mv'));
  if (!vs.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      var v = e.target;
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(function(){}); }
      else v.pause();
    });
  }, { threshold: 0.4 });
  vs.forEach(function(v){
    io.observe(v);
    var w = v.parentNode;
    v.addEventListener('play',  function(){ w.classList.add('playing'); });
    v.addEventListener('pause', function(){ w.classList.remove('playing'); });
  });
})();

/* Lightbox over the screenshots. */
(function(){
  var btns = [].slice.call(document.querySelectorAll('.mb'));
  if (!btns.length) return;
  var lb = document.getElementById('lb'), img = document.getElementById('lbi'),
      cap = document.getElementById('lbc'), at = 0;
  function show(i){
    at = (i + btns.length) % btns.length;
    var b = btns[at];
    img.src = b.dataset.full;
    img.alt = b.querySelector('img').alt;
    cap.textContent = b.dataset.cap;
    lb.setAttribute('open',''); document.body.style.overflow = 'hidden';
    document.getElementById('lbx').focus();
  }
  function hide(){ lb.removeAttribute('open'); document.body.style.overflow = '';
                   img.src = ''; btns[at].focus(); }
  btns.forEach(function(b,i){ b.addEventListener('click', function(){ show(i); }); });
  document.getElementById('lbx').addEventListener('click', hide);
  document.getElementById('lbn').addEventListener('click', function(){ show(at+1); });
  document.getElementById('lbp').addEventListener('click', function(){ show(at-1); });
  lb.addEventListener('click', function(e){ if (e.target === lb) hide(); });
  document.addEventListener('keydown', function(e){
    if (!lb.hasAttribute('open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowRight') show(at+1);
    if (e.key === 'ArrowLeft') show(at-1);
  });
})();

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
const thumbOf = p => {
  const m = (p.media ?? []).filter(x => !String(x.src ?? '').endsWith('.svg'));
  const v = m.find(x => x.type === 'video');
  const i = m.find(x => x.type === 'image');
  if (v) return { src: v.poster, w: v.w, h: v.h };
  if (i) return { src: i.thumb ?? i.src, w: i.w, h: i.h };
  return null;
};
const list = projects.map(p => {
  const t = thumbOf(p);
  const shot = t
    ? `<img class="th" src="${t.src}" width="${t.w}" height="${t.h}"
         loading="lazy" decoding="async" alt="A screenshot of ${esc(p.name)}" />`
    : `<span class="th thi" aria-hidden="true">${p.icon}</span>`;
  return `<li><a href="/p/${p.slug}/">${shot}<span class="tx"><b>${esc(p.name)}</b>${esc(p.tagline)}</span></a></li>`;
}).join('\n');
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
li a{display:flex;gap:14px;align-items:center;text-decoration:none;color:#F5F5F7;
 padding:13px 15px;margin-bottom:11px;border-radius:18px;font-size:15px;
 background:linear-gradient(155deg,rgba(255,255,255,.09),rgba(255,255,255,.045));
 border:1px solid rgba(255,255,255,.13);transition:transform .18s,border-color .18s}
li a:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.3)}
.th{flex:0 0 auto;width:98px;height:64px;border-radius:12px;
 border:1px solid rgba(255,255,255,.14);background:#080c14;
 object-fit:cover;object-position:center 16%}
.thi{display:grid;place-items:center;font-size:28px}
.tx{display:flex;flex-direction:column;gap:3px;min-width:0}
.tx b{font-size:15.5px;font-weight:650}
.tx{color:#AEB6C4;font-size:13.5px;line-height:1.5}
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
const urls = [`${ORIGIN}/`, `${ORIGIN}/p/`, `${ORIGIN}/timeline/`, ...projects.map(p => `${ORIGIN}/p/${p.slug}/`)];
const today = new Date().toISOString().slice(0, 10);
/* Screenshots are listed as <image:image> so they can rank in Google Images,
   which is a second way into the same pages. */
const shotsFor = u => {
  const p = projects.find(x => u === `${ORIGIN}/p/${x.slug}/`);
  if (!p) return '';
  return (p.media ?? []).map(x => {
    const src = x.type === 'video' ? x.poster : x.src;
    return `\n    <image:image><image:loc>${ORIGIN}${src}</image:loc>` +
           `<image:title>${esc(x.caption)}</image:title>` +
           `<image:caption>${esc(x.alt)}</image:caption></image:image>`;
  }).join('');
};
await writeFile('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${i === 0 ? '1.0' : '0.8'}</priority>${shotsFor(u)}</url>`).join('\n')}
</urlset>
`);
await writeFile('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
console.log(`✓ ${projects.length} project pages + index + sitemap(${urls.length}) + robots`);
