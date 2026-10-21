// Notes app content: the "about" lives in Notes.
// Inline syntax: [label](https://…) opens a link, [label](app:safari/relay)
// opens a window (app:<window>/<optional data id>).

import { profile, profileFa, skills, skillCategoriesFa, funFacts, funFactsFa } from "./profile";

export const notes = [
  {
    id: "about",
    title: "about me",
    emoji: "👋",
    pinned: true,
    date: "Oct 2026",
    blocks: [
      { type: "h1", text: `hey, I'm ${profile.firstName}` },
      {
        type: "p",
        text: "I'm a full-stack developer and product builder from Iran. My loop is simple: first-principles thinking → designing the solution → building a real product. I break hard problems down to their fundamentals and ship the answer as something people actually use.",
      },
      {
        type: "p",
        text: "I build across the whole stack and every screen: Android and Windows apps, Flutter apps, Rust desktop tools, offline-first PWAs and real-time games at the edge. Everything I make is open source and private by design.",
      },
      { type: "h2", text: "right now" },
      {
        type: "ul",
        items: [
          "Shipping [Relay](app:safari/relay): share your phone's internet with your PC over an encrypted WireGuard tunnel. No root, no server, no account.",
          "Growing [Flow (تک‌نقطه)](app:safari/flow), an offline focus and habit app built on behavioral science.",
          "Helping shopkeepers price honestly with [Sooda](app:safari/sooda), a bilingual, offline profit calculator.",
          "Building everything in public: [every release, as it ships](/timeline/).",
        ],
      },
      { type: "h2", text: "elsewhere" },
      {
        type: "ul",
        items: [
          "[GitHub](https://github.com/Mahdi-mortazavi)",
          "[Telegram](https://t.me/Mahdi_mortazavi1)",
          "[Startup Legend, my channel](https://t.me/Startup_legend)",
          `[${profile.email}](mailto:${profile.email})`,
        ],
      },
      {
        type: "p",
        text: `${profile.availability}. [Send me a message](app:mail) or [read my resume](app:resume).`,
      },
    ],
  },
  {
    id: "building",
    title: "what I'm building",
    emoji: "🛠️",
    pinned: true,
    date: "Oct 2026",
    blocks: [
      { type: "h1", text: "what I'm building" },
      {
        type: "p",
        text: "Small, sharp tools that solve one real problem completely. They work offline, need no account, and keep your data on your device. Most of them speak Persian natively: right-to-left, Jalali dates, Persian digits.",
      },
      { type: "h2", text: "Relay" },
      {
        type: "p",
        text: "Android → Windows reverse tethering over WireGuard. Every app on the PC gets online, TCP and UDP, and nothing leaves your two devices. My most-starred project. [Case study](app:safari/relay) · [Download](https://github.com/Mahdi-mortazavi/relay/releases/latest)",
      },
      { type: "h2", text: "Flow · تک‌نقطه" },
      {
        type: "p",
        text: "One decision a day. A daily Boulder, a crash-proof focus timer and habits that recover after a miss. [Case study](app:safari/flow) · [Source](https://github.com/Mahdi-mortazavi/flow)",
      },
      { type: "h2", text: "Sooda" },
      {
        type: "p",
        text: "Profit math, crystal clear: real profit after restocking, honest instalment pricing, fully offline. [Case study](app:safari/sooda) · [Open the app](https://mahdi-mortazavi.github.io/sooda/)",
      },
      { type: "h2", text: "everything else" },
      {
        type: "p",
        text: "A Rust disk cleaner you can trust, a minimalist Flutter to-do, an eight-player arena shooter on Cloudflare's edge, and more. [See all projects](app:safari).",
      },
    ],
  },
  {
    id: "stack",
    title: "stack & tools",
    emoji: "🧰",
    date: "Oct 2026",
    blocks: [
      { type: "h1", text: "stack & tools" },
      ...skills.map((group) => ({
        type: "row",
        label: group.category,
        text: group.items.join(", "),
      })),
      {
        type: "p",
        text: "Want the interactive version? Open the [Terminal](app:terminal) and type help.",
      },
    ],
  },
  {
    id: "facts",
    title: "how I work",
    emoji: "🧩",
    date: "Oct 2026",
    blocks: [
      { type: "h1", text: "how I work" },
      { type: "ul", items: funFacts },
    ],
  },
  {
    id: "roadmap",
    title: "site roadmap",
    emoji: "🗺️",
    date: "Oct 2026",
    blocks: [
      { type: "h1", text: "site roadmap" },
      {
        type: "todo",
        items: [
          { text: "macOS desktop with draggable windows", done: true },
          { text: "Projects in Safari, screenshots in Photos", done: true },
          { text: "Spotlight search and an interactive terminal", done: true },
          { text: "iOS home screen on phones", done: true },
          { text: "Persian (RTL) version with the Jalali calendar", done: true },
          { text: "Live GitHub activity and star counts", done: true },
          { text: "Build-in-public release timeline", done: true },
          { text: "Write-ups on how each project was designed", done: false },
          { text: "More wallpapers and color themes", done: false },
        ],
      },
    ],
  },
];

// ── Persian ────────────────────────────────────────────────────────────────

export const notesFa = [
  {
    id: "about",
    title: "درباره من",
    emoji: "👋",
    pinned: true,
    date: "مهر ۱۴۰۵",
    blocks: [
      { type: "h1", text: `سلام، من ${profileFa.firstName} هستم` },
      {
        type: "p",
        text: "توسعه‌دهنده فول‌استک و سازنده محصول از ایران هستم. چرخه کارم ساده است: تفکر بر پایه اصول ← طراحی راه‌حل ← ساختن محصول واقعی. مسئله‌های سخت را تا مبانی پایه تجزیه می‌کنم و پاسخ را به چیزی تبدیل می‌کنم که آدم‌ها واقعاً از آن استفاده می‌کنند.",
      },
      {
        type: "p",
        text: "روی همه لایه‌ها و همه صفحه‌ها کار می‌کنم: اپ‌های اندروید و ویندوز، اپ‌های فلاتر، ابزارهای دسکتاپ با Rust، وب‌اپ‌های آفلاین و بازی‌های بلادرنگ روی لبه شبکه. همه کارهایم متن‌باز و با حریم خصوصی از پایه‌اند.",
      },
      { type: "h2", text: "این روزها" },
      {
        type: "ul",
        items: [
          "[ریلی](app:safari/relay) را منتشر می‌کنم: اینترنت گوشی را از راه تونل رمزنگاری‌شده WireGuard با کامپیوتر به اشتراک بگذارید؛ بدون روت، بدون سرور، بدون حساب.",
          "[تک‌نقطه](app:safari/flow) را رشد می‌دهم؛ اپ آفلاین تمرکز و عادت، ساخته‌شده بر پایه علم رفتار.",
          "با [سودا](app:safari/sooda) به کسبه کمک می‌کنم صادقانه قیمت بگذارند؛ ماشین‌حساب سود دوزبانه و آفلاین.",
          "همه‌چیز را در ملأعام می‌سازم: [هر نسخه، همان لحظه که منتشر می‌شود](/timeline/).",
        ],
      },
      { type: "h2", text: "جاهای دیگر" },
      {
        type: "ul",
        items: [
          "[گیت‌هاب](https://github.com/Mahdi-mortazavi)",
          "[تلگرام](https://t.me/Mahdi_mortazavi1)",
          "[کانال استارتاپ لجند](https://t.me/Startup_legend)",
          `[${profile.email}](mailto:${profile.email})`,
        ],
      },
      {
        type: "p",
        text: `${profileFa.availability}. [برایم پیام بفرستید](app:mail) یا [رزومه‌ام را بخوانید](app:resume).`,
      },
    ],
  },
  {
    id: "building",
    title: "چه می‌سازم",
    emoji: "🛠️",
    pinned: true,
    date: "مهر ۱۴۰۵",
    blocks: [
      { type: "h1", text: "چه می‌سازم" },
      {
        type: "p",
        text: "ابزارهای کوچک و دقیق که یک مسئله واقعی را کامل حل می‌کنند. آفلاین کار می‌کنند، حساب کاربری نمی‌خواهند و داده‌تان را روی دستگاه خودتان نگه می‌دارند. بیشترشان از پایه فارسی‌اند: راست‌به‌چپ، تاریخ شمسی و ارقام فارسی.",
      },
      { type: "h2", text: "ریلی" },
      {
        type: "p",
        text: "اشتراک اینترنت اندروید با ویندوز روی WireGuard. همه برنامه‌های کامپیوتر آنلاین می‌شوند، TCP و UDP، و هیچ چیزی از دو دستگاه شما بیرون نمی‌رود. پرستاره‌ترین پروژه‌ام. [مطالعه موردی](app:safari/relay) · [دانلود](https://github.com/Mahdi-mortazavi/relay/releases/latest)",
      },
      { type: "h2", text: "تک‌نقطه" },
      {
        type: "p",
        text: "هر روز فقط یک تصمیم. یک تخته‌سنگ روزانه، تایمر تمرکز ضدضربه و عادت‌هایی که بعد از شکست بازیابی می‌شوند. [مطالعه موردی](app:safari/flow) · [سورس کد](https://github.com/Mahdi-mortazavi/flow)",
      },
      { type: "h2", text: "سودا" },
      {
        type: "p",
        text: "سود و قیمت، شفاف مثل شیشه: سود واقعی بعد از خرید دوباره، قیمت‌گذاری اقساطی صادقانه و کاملاً آفلاین. [مطالعه موردی](app:safari/sooda) · [باز کردن برنامه](https://mahdi-mortazavi.github.io/sooda/)",
      },
      { type: "h2", text: "بقیه کارها" },
      {
        type: "p",
        text: "یک پاک‌کننده دیسک قابل‌اعتماد با Rust، یک اپ مینیمال مدیریت کار با فلاتر، یک شوتر آرنای هشت‌نفره روی لبه شبکه کلادفلر و چیزهای دیگر. [همه پروژه‌ها را ببینید](app:safari).",
      },
    ],
  },
  {
    id: "stack",
    title: "ابزارها و تکنولوژی‌ها",
    emoji: "🧰",
    date: "مهر ۱۴۰۵",
    blocks: [
      { type: "h1", text: "ابزارها و تکنولوژی‌ها" },
      ...skills.map((group) => ({
        type: "row",
        label: skillCategoriesFa[group.category] ?? group.category,
        text: group.items.join("، "),
      })),
      {
        type: "p",
        text: "نسخه تعاملی‌اش را می‌خواهید؟ [ترمینال](app:terminal) را باز کنید و help را بزنید.",
      },
    ],
  },
  {
    id: "facts",
    title: "چطور کار می‌کنم",
    emoji: "🧩",
    date: "مهر ۱۴۰۵",
    blocks: [
      { type: "h1", text: "چطور کار می‌کنم" },
      { type: "ul", items: funFactsFa },
    ],
  },
  {
    id: "roadmap",
    title: "نقشه راه سایت",
    emoji: "🗺️",
    date: "مهر ۱۴۰۵",
    blocks: [
      { type: "h1", text: "نقشه راه سایت" },
      {
        type: "todo",
        items: [
          { text: "دسکتاپ macOS با پنجره‌های قابل جابه‌جایی", done: true },
          { text: "پروژه‌ها در سافاری و تصاویر در عکس‌ها", done: true },
          { text: "جستجوی Spotlight و ترمینال تعاملی", done: true },
          { text: "صفحه اصلی شبیه iOS روی گوشی", done: true },
          { text: "نسخه فارسی (راست‌به‌چپ) با تقویم شمسی", done: true },
          { text: "فعالیت زنده گیت‌هاب و تعداد ستاره‌ها", done: true },
          { text: "خط زمانی انتشارها، ساختن در ملأعام", done: true },
          { text: "نوشته‌هایی درباره طراحی هر پروژه", done: false },
          { text: "والپیپرها و پوسته‌های رنگی بیشتر", done: false },
        ],
      },
    ],
  },
];
