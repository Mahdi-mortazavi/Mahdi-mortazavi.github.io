// Single source of truth for who I am and how to reach me.
// Everything else (Notes, Contact, Terminal, Resume, meta tags) reads from here.

export const profile = {
  name: "Mahdi Mortazavi",
  firstName: "Mahdi",
  initials: "MM",
  // Shown on the iPhone home screen (wallpaper + profile widget), in Contacts
  // and in the Control Center. Replace the file to change it everywhere.
  photo: "/images/me.webp",
  // Head-and-shoulders crop of the same photo, for round avatars.
  avatar: "/images/me-avatar.webp",
  role: "CTO · Full-Stack Engineer",
  title: "CTO & Head of Product · Full-Stack Engineer · Co-Founder",
  headline: "I solve the problem first and choose the technology second. Technology is an instrument, not an identity",
  location: "Iran",
  timezone: "Asia/Tehran",
  email: "mahdi.mortazavi.135@gmail.com",
  phone: "+98 992 927 1926",
  phoneHref: "tel:+989929271926",
  whatsapp: "https://wa.me/989929271926",
  website: "https://mahdi-mortazavi.github.io",
  host: "mahdi-mortazavi.github.io",
  resumeUrl: "/files/mahdi-mortazavi-resume.pdf",
  availability: "Available now for remote work, full-time or contract",
  summary: [
    "I solve the problem first and choose the technology second. I've designed, built and released six products across four different toolchains (Dart, Rust, Kotlin and TypeScript), because each problem demanded a different one. Technology is an instrument, not an identity.",
    "Today I'm CTO & Head of Product at Senagh, an AI assistant for real-estate agents, and co-founder of a HealthTech startup working on cardiac early warning. Everything I ship on my own is open source, offline-first and private by design.",
  ],
};

// Persian overrides, merged over `profile` when the site is in Persian.
export const profileFa = {
  name: "مهدی مرتضوی",
  firstName: "مهدی",
  role: "مدیر فنی · توسعه‌دهنده فول‌استک",
  title: "مدیر فنی و مدیر محصول · توسعه‌دهنده فول‌استک · هم‌بنیان‌گذار",
  headline: "اول مسئله را حل می‌کنم، بعد ابزارش را انتخاب می‌کنم. تکنولوژی برای من ابزار است، نه هویت",
  resumeUrl: "/files/mahdi-mortazavi-resume-fa.pdf",
  location: "ایران",
  availability: "همین حالا برای همکاری دورکاری آماده‌ام، تمام‌وقت یا پروژه‌ای",
  summary: [
    "اول مسئله را حل می‌کنم، بعد ابزارش را انتخاب می‌کنم. تا امروز شش محصول را طراحی کرده‌ام، ساخته‌ام و منتشر کرده‌ام، با چهار زبان و ابزار متفاوت (Dart، Rust، Kotlin و TypeScript)، چون هر مسئله ابزار خودش را می‌خواست. تکنولوژی برای من ابزار است، نه هویت.",
    "این روزها مدیر فنی و مدیر محصول ثناق هستم، دستیار هوش مصنوعی مشاوران املاک، و هم‌بنیان‌گذار یک استارتاپ سلامت در حوزه هشدار زودهنگام قلبی. هر چیزی که خودم منتشر می‌کنم متن‌باز، آفلاین‌محور و با حریم خصوصی از پایه است.",
  ],
};

export const socials = [
  {
    id: "github",
    label: "GitHub",
    handle: "@Mahdi-mortazavi",
    href: "https://github.com/Mahdi-mortazavi",
  },
  {
    id: "telegram",
    label: "Telegram",
    handle: "@Mahdi_mortazavi1",
    href: "https://t.me/Mahdi_mortazavi1",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: profile.phone,
    href: profile.whatsapp,
  },
  {
    id: "channel",
    label: "Startup Legend",
    handle: "@Startup_legend",
    href: "https://t.me/Startup_legend",
  },
  {
    id: "email",
    label: "Email",
    handle: profile.email,
    href: `mailto:${profile.email}`,
  },
];

export const skillCategoriesFa = {
  Mobile: "موبایل",
  "Systems & desktop": "سیستم و دسکتاپ",
  "Web & backend": "وب و بک‌اند",
  Infrastructure: "زیرساخت",
  "AI engineering": "مهندسی AI",
  "Product & design": "محصول و طراحی",
};

export const skills = [
  { category: "Mobile", items: ["Flutter", "Dart", "Riverpod", "Kotlin", "Jetpack Compose", "Android SDK", "Swift"] },
  { category: "Systems & desktop", items: ["Rust", "Tauri", "C# / .NET", "Go", "WireGuard", "Python"] },
  { category: "Web & backend", items: ["TypeScript", "React 19", "Next.js", "Vite", "PWA", "Node.js"] },
  {
    category: "Infrastructure",
    items: ["Cloudflare Workers", "Durable Objects", "Supabase", "Firebase", "Railway", "GitHub Actions"],
  },
  {
    category: "AI engineering",
    items: ["Gemini API", "Multi-agent orchestration", "Temporal", "Windmill", "Agentic coding"],
  },
  {
    category: "Product & design",
    items: ["Figma", "iOS HIG interaction design", "RTL & localization", "PWA performance"],
  },
];

// Startups and roles, newest first.
export const ventures = [
  {
    id: "senagh",
    role: "CTO & Head of Product",
    name: "Senagh",
    what: "AI assistant for real-estate agents",
    href: "https://senagh.ir",
    text: "Technical and product lead for an AI-agent assistant that works alongside real-estate agents. The system absorbs the repetitive half of the job so the agent spends their hours with clients instead. I own the architecture, the agent design and the product direction.",
  },
  {
    id: "healthtech",
    role: "Co-Founder",
    name: "HealthTech startup",
    what: "Cardiac early warning",
    text: "Building software for the early detection and prevention of heart attack, a problem where a few minutes of warning is the difference between saving someone and losing them. I work on product architecture and the signal pipeline.",
  },
  {
    id: "admobify",
    role: "Co-Founder",
    name: "Admobify",
    what: "Developer monetization",
    text: "Infrastructure that lets developers inside constrained markets connect AdMob and actually receive their revenue. The hard part was payments, not code, and it had been keeping an entire region of builders out of the global market.",
  },
  {
    id: "startup-legend",
    role: "Community Organizer",
    name: "Startup Legend",
    what: "Founder community",
    href: "https://t.me/Startup_legend",
    text: "Running a founder community: programming, coordination and growth.",
  },
];

export const venturesFa = {
  senagh: {
    role: "مدیر فنی (CTO) و مدیر محصول",
    name: "ثناق",
    what: "دستیار هوش مصنوعی مشاوران املاک",
    text: "مسئول فنی و محصولِ یک دستیار مبتنی بر AI Agent برای مشاوران املاک. سیستم نیمه‌ی تکراری کار را برمی‌دارد تا مشاور وقتش را با مشتری بگذراند. معماری سیستم، طراحی ایجنت‌ها و مسیر محصول با من است.",
  },
  healthtech: {
    role: "هم‌بنیان‌گذار",
    name: "استارتاپ سلامت",
    what: "هشدار زودهنگام قلبی",
    text: "نرم‌افزاری می‌سازیم که سکته‌ی قلبی را زودتر تشخیص بدهد و از آن پیشگیری کند. در این مسئله، چند دقیقه هشدارِ زودتر یعنی فاصله‌ی میان نجات یک نفر و از دست دادن او. من روی معماری محصول و پردازش سیگنال کار می‌کنم.",
  },
  admobify: {
    role: "هم‌بنیان‌گذار",
    what: "درآمدزایی توسعه‌دهندگان",
    text: "زیرساختی که به توسعه‌دهنده‌ها در بازارهای محدود اجازه می‌دهد AdMob را وصل کنند و درآمدشان را واقعاً دریافت کنند. بخش سخت ماجرا پرداخت بود، نه کد؛ و همین یک منطقه‌ی کامل از سازنده‌ها را از بازار جهانی بیرون نگه داشته بود.",
  },
  "startup-legend": {
    role: "گرداننده‌ی جامعه",
    what: "جامعه‌ی بنیان‌گذاران",
    text: "اداره‌ی یک جامعه‌ی بنیان‌گذار: برنامه‌ریزی، هماهنگی و رشد.",
  },
};

// How I work: one principle per line.
export const funFacts = [
  "Problem before stack. I open a problem down to its most basic parts, then take the tool it actually calls for: Rust for a native binary, Kotlin for Android, Flutter for cross-platform, TypeScript for the web.",
  "New tech is not a cost. Learning an unfamiliar language or framework mid-project is normal for me. Four different toolchains, all self-taught, all shipped and public.",
  "Speed to released. Idea to public release in weeks, working alone. I use AI tooling for speed; it never replaces understanding the code.",
  "Privacy from the architecture, not from a policy page. If a feature needs a server, an account or a tracker, it has to prove it.",
  "Send me a hard problem and I'll tell you within a day whether I can solve it and how I'd start.",
];

export const funFactsFa = [
  "مسئله، قبل از ابزار. هر مسئله را تا پایه‌ترین اجزایش باز می‌کنم، بعد ابزاری را برمی‌دارم که همان مسئله می‌طلبد: Rust برای باینری نیتیو، Kotlin برای اندروید، Flutter برای چندپلتفرمی، TypeScript برای وب.",
  "تکنولوژی جدید برایم هزینه نیست. یاد گرفتن یک زبان یا فریم‌ورک تازه وسط کار برایم عادی است. چهار ابزار متفاوت، همه خودآموخته، همه منتشرشده و عمومی.",
  "سرعت تا انتشار. از ایده تا انتشار عمومی، چند هفته و به‌تنهایی. از ابزارهای AI برای سرعت استفاده می‌کنم، اما جای فهمیدن کد را نمی‌گیرند.",
  "حریم خصوصی از دل معماری می‌آید، نه از متن سیاست‌نامه. اگر قابلیتی به سرور، حساب کاربری یا ردیاب نیاز داشته باشد، باید ثابتش کند.",
  "یک مسئله‌ی سخت برایم بفرستید؛ ظرف یک روز می‌گویم می‌توانم حلش کنم یا نه، و از کجا شروع می‌کنم.",
];
