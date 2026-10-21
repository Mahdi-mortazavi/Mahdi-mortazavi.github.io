// Projects. The facts that the rest of the site also uses (names, taglines,
// descriptions, screenshots) come straight from the hub's projects.json, so
// this window, the /p/<slug>/ pages and the sitemap never drift apart. This
// file adds the case-study layer on top: story, highlights, stack, links.

import hub from "#site/projects.json";

const GH = "https://github.com/Mahdi-mortazavi";
export const SITE = "https://mahdi-mortazavi.github.io";

export const projectCategories = [
  { id: "all", label: "All" },
  { id: "mobile", label: "Mobile" },
  { id: "desktop", label: "Desktop" },
  { id: "web", label: "Web & games" },
];

const CASE_STUDIES = {
  relay: {
    title: "Relay",
    kind: "Android + Windows app",
    category: "desktop",
    year: "2026",
    status: "Live",
    description: [
      "Relay exists because a laptop kept having no internet while the phone next to it did. Tap Start Sharing on the phone, click the phone on the PC (or type the two digits it shows), tap Allow, and every app on the computer is online: TCP and UDP, games, calls and installers, not just the browser.",
      "It works over whatever already connects the two devices: your Wi-Fi, the phone's hotspot or a USB cable. There is no account, no server and no telemetry. Keys are made per pairing and destroyed when sharing stops, and nothing ever leaves your two devices.",
    ],
    highlights: [
      "One WireGuard tunnel carries all TCP and UDP traffic, with DNS and IPv6 leak protection at 22 µs per connection and an optional kill switch.",
      "Shares whatever the phone is on, including its VPN, and re-checks the best route every ten seconds.",
      "Rides out packet loss and a switch from Wi-Fi to LTE underneath an active download.",
      "Honest status: “Connected” means a real handshake happened. Live speed on the phone, speed, totals and latency on the PC.",
      "Quick Settings tile, home-screen widget and a Windows tray app; English and Persian throughout, with screen-reader support on both platforms.",
      "No local build step: CI builds, tests on real Android images and a real Windows runner, and ships every release.",
    ],
    stack: ["Kotlin", "Jetpack Compose", ".NET 8", "WinUI 3", "Go", "WireGuard", "GitHub Actions"],
    links: [
      { label: "Download", href: `${GH}/relay/releases/latest`, kind: "live" },
      { label: "Source", href: `${GH}/relay`, kind: "source" },
    ],
  },
  flow: {
    title: "Flow",
    kind: "Android app",
    category: "mobile",
    year: "2026",
    status: "Live",
    rtl: true,
    description: [
      "You start the morning with twenty “important” tasks and end the night with guilt. The problem was never the list, it's the decision. Flow asks one question every morning: if only one thing gets done today, which one? That thing is your Boulder, and everything else queues behind it.",
      "A day with Flow is a loop: pick the Boulder in under 90 seconds, focus on it with a timer that cannot lose your session, review the day in 60 seconds, and see the week in the Mirror. Everything stays on the phone: no account, no server, no internet.",
    ],
    highlights: [
      "Crash-proof focus: the timer runs on the wall clock, so closing the app or rebooting the phone never loses a session.",
      "Habits built as “after [X], [tiny behavior]” with recovery rate instead of punishing streaks.",
      "Every feature maps to a behavioral-science idea: Implementation Intentions, Tiny Habits, Self-Compassion, the Zeigarnik effect, Five Whys.",
      "Brain Vault parks a distracting thought in two seconds without leaving focus.",
      "Persian and English with instant RTL ⇄ LTR switching, Jalali calendar and six color palettes.",
      "86 automated tests; releases are built, signed and published automatically from a version bump.",
    ],
    stack: ["Flutter", "Dart", "Riverpod", "SQLite", "Jalali calendar"],
    links: [
      { label: "Download", href: `${GH}/flow/releases/latest`, kind: "live" },
      { label: "Source", href: `${GH}/flow`, kind: "source" },
    ],
  },
  sooda: {
    title: "Sooda",
    kind: "Progressive web app",
    category: "web",
    year: "2026",
    status: "Live",
    rtl: true,
    description: [
      "You made 20% profit, but can you still afford to restock? A shopkeeper sells ten shawls at 20% and is pleased, until the wholesaler calls: prices are up, and the money from ten shawls no longer buys ten shawls. Sooda is built for that moment.",
      "Next to the nominal profit it shows the real profit after restocking, flags thin margins, and suggests a price that puts the shelf back the way it was. It also prices instalment plans honestly, and works fully offline in English and Persian without tracking anything.",
    ],
    highlights: [
      "Profit, selling price, discount and reverse discount, each one screen and one tap.",
      "Real profit: picks when the money comes back and estimates the restock cost from inflation, or from a price you already know.",
      "Instalment pricing that answers both “how much should I add?” and “is my deal profitable?”, with a shareable payment schedule.",
      "My products: saved items with a health chip and bulk repricing with a preview.",
      "An interactive tutorial of eight short lessons run in a practice shop that never touches your data.",
      "Installs like an app and works offline; no server, no account, no analytics.",
    ],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "IndexedDB", "PWA"],
    links: [
      { label: "Open the app", href: `${SITE}/sooda/`, kind: "live" },
      { label: "Source", href: `${GH}/sooda`, kind: "source" },
    ],
  },
  nava: {
    title: "Nava",
    kind: "Mobile app",
    category: "mobile",
    year: "2026",
    status: "Open source",
    rtl: true,
    description: [
      "Most to-do apps look like spreadsheets: rules, tiny buttons and confusing menus. Nava is a rebellion against that, inspired by one line: simplicity is the ultimate sophistication. The goal was an app you open and take a deep breath, instead of feeling stressed.",
      "Every task carries the one number that matters, how long it takes, and starting a task turns it into a focus session. Extra buttons were removed, sharp corners were sanded down, and dry clicks were replaced with fluid, physical motion.",
    ],
    highlights: [
      "Liquid Glass UI: translucent, blurred surfaces with tint gradients, hairline borders and physics-based press animations.",
      "Background-safe focus timer derived from wall-clock deltas, so it never drifts even if the app is suspended mid-session.",
      "A haptic engine with distinct patterns for success, warnings, selection and timer completion.",
      "Reliable reminders with exact alarms, automatic fallback and recovery for reminders missed while the app was closed.",
      "Pins, subtasks, categories and first-class Persian (Jalali) calendar support.",
    ],
    stack: ["Flutter", "Dart", "Riverpod", "Haptics"],
    links: [
      { label: "Download", href: `${GH}/app/releases/latest`, kind: "live" },
      { label: "Source", href: `${GH}/app`, kind: "source" },
    ],
  },
  purify: {
    title: "Purify",
    kind: "Windows app",
    category: "desktop",
    year: "2026",
    status: "Open source",
    description: [
      "When a Windows drive fills up, one tool shows a maze of folders and another asks you to delete blindly. The problem isn't finding files, it's knowing what to trust. Purify gives you a calmer path: understand the space, review the reason, then clean with a way back.",
      "Every suggestion comes with a plain-language reason and a confidence level, and approved items move to a local quarantine instead of being deleted. Nothing is removed by default, and nothing about your disk ever leaves the computer.",
    ],
    highlights: [
      "Disk map: a fast treemap of the space that matters, reading the NTFS Master File Table directly when elevated.",
      "30+ built-in cleanup signatures for caches, leftovers and developer clutter, each labelled Safe, Likely safe or Review needed.",
      "Reversible by default: a local quarantine with restore, and permanent purge only when you ask for it.",
      "Roughly 20 ms to scan and 28 ms to analyze a 7,400-file profile in release builds.",
      "A scriptable CLI and community-editable rules in TOML; CI runs fmt, Clippy, tests and desktop builds on every PR.",
    ],
    stack: ["Rust", "Tauri 2", "NTFS / MFT", "TOML", "GitHub Actions"],
    links: [
      { label: "Download", href: `${GH}/purify/releases/latest`, kind: "live" },
      { label: "Source", href: `${GH}/purify`, kind: "source" },
    ],
  },
  overrun: {
    title: "Overrun",
    kind: "Multiplayer game",
    category: "web",
    year: "2026",
    status: "Live",
    description: [
      "Overrun is a top-down arena shooter that installs like an app, plays with the network cut, and takes eight people online. Co-op waves, 4v4 team deathmatch and 2v2v2v2 squad royale all run on one simulation.",
      "There are no asset files: every mesh, texture, character rig, animation and sound effect is generated in code at runtime. The browser steps the simulation at 60 Hz, and a Cloudflare Durable Object steps the same file at 20 Hz as the sole authority on what happened.",
    ],
    highlights: [
      "One simulation, three homes: the shared package has no DOM, no renderer and no network, so client and server run identical code.",
      "One Durable Object per match keeps authoritative state at the edge, close to every player.",
      "Ten enemy archetypes share one AI core: line-of-sight perception with memory, a BFS flow field, utility scoring and squad roles.",
      "Movement with weight: friction-and-accelerate locomotion plus an unclamped impulse channel for recoil and knockback.",
      "Plays offline as a PWA and ships as an Android APK; touch, gamepad and keyboard controls with honest client-side aim assist.",
    ],
    stack: ["JavaScript", "three.js", "Web Audio", "Cloudflare Workers", "Durable Objects", "PWA"],
    links: [
      { label: "Play now", href: "https://overrun.mahdi-mortazavi-135.workers.dev", kind: "live" },
      { label: "Source", href: `${GH}/overrun`, kind: "source" },
    ],
  },
  mova: {
    title: "Mova",
    kind: "Web app",
    category: "web",
    year: "2025",
    status: "Open source",
    description: [
      "Mova is a psychology-based productivity app for perfectionists who struggle with procrastination. Its motto is the opposite of most productivity tools: start, don't perfect it.",
      "An AI coach breaks intimidating goals into small, actionable tasks, and the progression system rewards starting and consistency instead of flawless completion. It's also kept public on purpose, as an experiment in shipping over polishing.",
    ],
    highlights: [
      "AI-powered goal breakdown with Google Gemini, with a choice of supportive, direct or playful coaching styles.",
      "Four evidence-based exercises: self-compassion break, exposure to imperfection, cognitive reframing and worst-case scenario.",
      "Growth Points for starting tasks, not only finishing them, plus character traits that unlock features.",
      "An “incompleteness slider” to mark tasks as done enough, and a forgiving daily streak.",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Framer Motion", "Gemini AI"],
    links: [{ label: "Source", href: `${GH}/Mova`, kind: "source" }],
  },
};

// The hub's media list, flattened to what the Projects and Photos windows show.
const shotsOf = (p) =>
  (p.media ?? []).map((m) => (m.type === "video" ? m.poster : m.src)).filter(Boolean);

export const projects = hub.projects.map((p) => {
  const cs = CASE_STUDIES[p.slug];
  const shots = shotsOf(p);
  return {
    id: p.slug,
    slug: p.slug,
    repo: p.repo,
    icon: p.icon,
    accent: p.accent,
    tagline: p.tagline,
    summary: p.desc,
    tags: p.tags ?? [],
    platforms: p.os,
    language: p.lang,
    page: `/p/${p.slug}/`,
    thumbnail: `/assets/og/${p.slug}.png`,
    // A bare screenshot (no title baked in), for small tiles like the phone widget.
    shot: p.media?.find((m) => m.type === "image")?.thumb ?? p.media?.find((m) => m.type === "image")?.src,
    screenshots: shots.length ? shots : [`/assets/og/${p.slug}.png`],
    ...cs,
    links: [...cs.links, { label: "Project page", href: `/p/${p.slug}/`, kind: "site" }],
  };
});

// More on this site, outside the desktop.
export const archive = [
  {
    id: "timeline",
    title: "Build in Public",
    year: "2026",
    description: "Every release of every project, as it ships, synced from GitHub every six hours.",
    stack: ["GitHub API", "GitHub Actions"],
    live: "/timeline/",
    source: `${GH}/Mahdi-mortazavi.github.io`,
  },
  {
    id: "project-pages",
    title: "Project pages",
    year: "2026",
    description: "One page per project with screenshots, FAQs and live star counts.",
    stack: ["Static HTML", "Structured data"],
    live: "/p/",
    source: `${GH}/Mahdi-mortazavi.github.io`,
  },
];

// Nothing gets deleted here: the Trash only holds a note.
export const trashedProjects = [];

export const getProject = (id) => projects.find((p) => p.id === id);
