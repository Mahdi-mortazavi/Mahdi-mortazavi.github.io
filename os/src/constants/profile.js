// Single source of truth for who I am and how to reach me.
// Everything else (Notes, Contact, Terminal, Resume, meta tags) reads from here.

export const profile = {
  name: "Mahdi Mortazavi",
  firstName: "Mahdi",
  initials: "MM",
  // Shown on the iPhone home screen (wallpaper + profile widget), in Contacts
  // and in the Control Center. Replace the file to change it everywhere.
  photo: "/images/me.webp",
  role: "Full-Stack Developer",
  headline: "Full-stack developer and product builder. I turn hard problems into shipped, private-by-design software",
  location: "Iran",
  timezone: "Asia/Tehran",
  email: "mahdi.mortazavi.135@gmail.com",
  website: "https://mahdi-mortazavi.github.io",
  host: "mahdi-mortazavi.github.io",
  resumeUrl: "/files/mahdi-mortazavi-resume.pdf",
  availability: "Available for collaborations and product partnerships",
  summary: [
    "I'm a full-stack developer and product builder from Iran. I take hard problems, break them down to first principles, and ship the answer as a real product people use every day: Android and Windows apps, Flutter apps, Rust desktop tools, PWAs and real-time games at the edge.",
    "Everything I make is open source, offline-first and private by design. No accounts, no trackers, nothing leaves your device unless it has to. My work has earned hundreds of stars on GitHub, led by relay, which shares a phone's internet with a PC over an encrypted WireGuard tunnel.",
  ],
};

// Persian overrides, merged over `profile` when the site is in Persian.
export const profileFa = {
  name: "مهدی مرتضوی",
  firstName: "مهدی",
  role: "توسعه‌دهنده فول‌استک",
  headline: "توسعه‌دهنده فول‌استک و سازنده محصول؛ مسئله‌های سخت را به نرم‌افزارهای منتشرشده و حریم‌خصوصی‌محور تبدیل می‌کنم",
  location: "ایران",
  availability: "آماده همکاری و شراکت در ساخت محصول",
  summary: [
    "توسعه‌دهنده فول‌استک و سازنده محصول از ایران هستم. مسئله‌های سخت را تا اصول پایه‌شان تجزیه می‌کنم و پاسخ را به محصولی واقعی تبدیل می‌کنم که آدم‌ها هر روز از آن استفاده می‌کنند: اپ‌های اندروید و ویندوز، اپ‌های فلاتر، ابزارهای دسکتاپ با Rust، وب‌اپ‌های PWA و بازی‌های بلادرنگ روی لبه شبکه.",
    "همه کارهایم متن‌باز، آفلاین‌محور و با حریم خصوصی از پایه‌اند: بدون حساب کاربری، بدون ردیاب، و هیچ داده‌ای بی‌دلیل از دستگاه شما بیرون نمی‌رود. کارهایم در گیت‌هاب صدها ستاره گرفته‌اند؛ در صدرشان ریلی، که اینترنت گوشی را از راه یک تونل رمزنگاری‌شده WireGuard با کامپیوتر به اشتراک می‌گذارد.",
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
  Desktop: "دسکتاپ",
  Web: "وب",
  "Edge & networking": "لبه شبکه و شبکه",
  Data: "داده",
  Design: "طراحی",
  Practice: "روش کار",
};

export const skills = [
  { category: "Mobile", items: ["Flutter", "Dart", "Riverpod", "Kotlin", "Jetpack Compose"] },
  { category: "Desktop", items: ["C#", ".NET 8", "WinUI 3", "Rust", "Tauri 2"] },
  { category: "Web", items: ["TypeScript", "JavaScript", "React", "Vite", "PWA", "WebGL"] },
  {
    category: "Edge & networking",
    items: ["Cloudflare Workers", "Durable Objects", "WebSockets", "WireGuard", "Go"],
  },
  { category: "Data", items: ["SQLite", "IndexedDB", "Offline-first sync"] },
  {
    category: "Design",
    items: ["Product design", "Liquid Glass UI", "Motion", "RTL & Persian typography"],
  },
  { category: "Practice", items: ["First-principles thinking", "Open source", "GitHub Actions CI/CD", "Privacy by design"] },
];

// How I work, in one line each.
export const funFacts = [
  "I start every project with one question: what is the actual problem, before anyone named a solution for it?",
  "relay exists because a laptop kept having no internet while the phone in my pocket did.",
  "If a feature needs a server, an account or a tracker, it has to prove it. Most of mine never do.",
  "Persian is never a translation in my apps. Right-to-left, Jalali dates and Persian digits are designed in from the first screen.",
  "I'd rather ship something real today than polish something imaginary for a month. That's what Mova is named after.",
];

export const funFactsFa = [
  "هر پروژه را با یک سؤال شروع می‌کنم: مسئله واقعی چیست، قبل از اینکه کسی برایش راه‌حلی اسم گذاشته باشد؟",
  "ریلی به این خاطر ساخته شد که لپ‌تاپم مدام اینترنت نداشت، در حالی که گوشی توی جیبم داشت.",
  "اگر قابلیتی به سرور، حساب کاربری یا ردیاب نیاز داشته باشد، باید ثابتش کند. بیشترِ قابلیت‌های من هیچ‌وقت نیاز ندارند.",
  "فارسی در اپ‌های من هیچ‌وقت ترجمه نیست. راست‌به‌چپ، تاریخ شمسی و ارقام فارسی از صفحه اول طراحی می‌شوند.",
  "ترجیح می‌دهم امروز چیزی واقعی منتشر کنم تا اینکه یک ماه چیزی خیالی را صیقل بدهم. اسم مووا از همین می‌آید.",
];
