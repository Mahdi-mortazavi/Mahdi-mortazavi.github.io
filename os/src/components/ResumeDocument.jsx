import { ventures, venturesFa } from "#constants";
import { useContent } from "../i18n/content";
import { localizeDigits, useLocale } from "../i18n";
import { useLiveStats } from "../hooks/useLiveStats";

// The resume, as a document, in the site's language. Rendered in the Resume
// window and when printing; the downloadable PDFs in /files/ are my own
// designed versions of the same text. Star counts are live from data.json.
const TEXT = {
  en: {
    lede: "I solve the problem first and choose the technology second. Six products designed, built and released across four different toolchains, because each problem demanded a different one. Technology is an instrument, not an identity.",
    contactLine: "Call · WhatsApp · Telegram",
    stats: [
      ["6", "Products shipped & released"],
      ["3", "Startups built or led"],
      ["4", "Toolchains: Dart, Rust, Kotlin, TS"],
      ["stars", "GitHub stars, live"],
      ["100%", "Solo: design → build → release"],
    ],
    ventures: "Ventures & leadership",
    howIWork: "How I work",
    principles: [
      ["Problem before stack", "I open a problem down to its most basic parts, then take the tool it actually calls for: Rust for a native binary, Kotlin for Android, Flutter for cross-platform, TypeScript for the web."],
      ["New tech is not a cost", "Learning an unfamiliar language or framework mid-project is normal for me. Four different toolchains, all self-taught, all shipped and public."],
      ["Speed to released", "Idea to public release in weeks, working alone. I use AI tooling for speed; it never replaces understanding the code."],
    ],
    products: "Open-source products: public, shipped, verifiable",
    productList: [
      ["nava", "Minimalist productivity app", "Everyone adds features to fix focus; I removed them. Squircle geometry, haptic feedback and calm breathing animations: interaction tuned to Apple-native fidelity, not framework defaults."],
      ["flow", "Persian/RTL focus & habit app", "Habit apps collapse the first day you miss, so I designed for failure instead of streaks. Fully offline and grounded in behavioral science: one priority a day, a timer that survives the app being killed, habits that come back after a missed day, and statistics that don't judge."],
      ["sooda", "Profit & pricing calculator", "A calculator needs no server, no account, and none of your data. Bilingual English/Persian app for sellers: profit, margin, discount and real profit in one tap. Fully offline, tracks nothing, perfect Lighthouse scores across all four categories, deployed by GitHub Actions."],
      ["mova", "AI anti-procrastination app", "Perfectionism isn't a time-management problem, so I stopped treating it like one. A psychology-based app for people who stall at the starting line, built on React 19 and Vite with Gemini in the loop."],
      ["purify", "Disk-cleanup utility for Windows", "Rust + Tauri instead of Electron, for a native-speed binary at a fraction of the size. The complexity stays behind the scenes; the user sees one simple, safe decision."],
      ["relay", "Android ↔ Windows connection sharing", "Every similar tool routes your data through a server; this problem never needed one. Local-only pairing between phone and PC: no cloud, no accounts, no telemetry. Privacy from the architecture, not from a policy page."],
    ],
    technologies: "Technologies",
    availability: "Availability",
    availabilityText: "Available now for remote work, full-time or contract. Fastest reply on Telegram or WhatsApp; phone calls welcome. Send me a hard problem and I'll tell you within a day whether I can solve it and how I'd start.",
  },
  fa: {
    lede: "اول مسئله را حل می‌کنم، بعد ابزارش را انتخاب می‌کنم. تا امروز شش محصول ساخته‌ام و منتشر کرده‌ام، با چهار زبان و ابزار متفاوت، چون هر مسئله ابزار خودش را می‌خواست. تکنولوژی برای من ابزار است، نه هویت.",
    contactLine: "تماس · واتساپ · تلگرام",
    stats: [
      ["۶", "محصول ساخته و منتشرشده"],
      ["۳", "استارتاپ ساخته یا رهبری‌شده"],
      ["۴", "زبان و ابزار: Dart، Rust، Kotlin، TS"],
      ["stars", "ستاره در گیت‌هاب، زنده"],
      ["۱۰۰٪", "تنها: از طراحی تا انتشار"],
    ],
    ventures: "استارتاپ‌ها و نقش‌ها",
    howIWork: "روش کار من",
    principles: [
      ["مسئله، قبل از ابزار", "هر مسئله را تا پایه‌ترین اجزایش باز می‌کنم، بعد ابزاری را برمی‌دارم که همان مسئله می‌طلبد: Rust برای باینری نیتیو، Kotlin برای اندروید، Flutter برای چندپلتفرمی، TypeScript برای وب."],
      ["تکنولوژی جدید برایم هزینه نیست", "یاد گرفتن یک زبان یا فریم‌ورک تازه وسط کار برایم عادی است. چهار ابزار متفاوت، همه خودآموخته، همه منتشرشده و عمومی."],
      ["سرعت تا انتشار", "از ایده تا انتشار عمومی، چند هفته و به‌تنهایی. از ابزارهای AI برای سرعت استفاده می‌کنم، اما جای فهمیدن کد را نمی‌گیرند."],
    ],
    products: "محصولات متن‌باز: عمومی و قابل بررسی",
    productList: [
      ["nava", "اپ بهره‌وری مینیمال", "همه برای حل مسئله‌ی تمرکز امکانات اضافه می‌کنند؛ من حذفشان کردم. هندسه‌ی اسکوئرکل، بازخورد لمسی و انیمیشن‌های آرام: تعامل در حد نیتیو اپل، نه پیش‌فرض فریم‌ورک."],
      ["flow", "اپ تمرکز و عادت فارسی، راست‌به‌چپ", "اپ‌های عادت با اولین روزی که جا می‌افتد فرو می‌ریزند؛ من به‌جای زنجیره، برای شکست طراحی کردم. کاملاً آفلاین و بر پایه‌ی علم رفتار: یک اولویت در روز، تایمری که با بسته‌شدن برنامه از بین نمی‌رود، عادت‌هایی که بعد از یک روز جاافتاده برمی‌گردند، و آماری که قضاوت نمی‌کند."],
      ["sooda", "ماشین‌حساب سود و قیمت‌گذاری", "یک ماشین‌حساب نه سرور می‌خواهد، نه حساب کاربری، نه داده‌ی شما. اپ دوزبانه برای فروشنده‌ها: سود، حاشیه، تخفیف و سود واقعی با یک لمس. کاملاً آفلاین، بدون ردیابی، با نمره‌ی کامل Lighthouse در هر چهار معیار و انتشار خودکار با GitHub Actions."],
      ["mova", "اپ هوش مصنوعی ضد اهمال‌کاری", "کمال‌گرایی مسئله‌ی مدیریت زمان نیست، پس مثل آن با آن رفتار نکردم. اپی بر پایه‌ی روان‌شناسی برای کسانی که در شروع کردن گیر می‌کنند، ساخته‌شده با React 19 و Vite و Gemini."],
      ["purify", "ابزار پاک‌سازی دیسک ویندوز", "به‌جای Electron سراغ Rust و Tauri رفتم تا برنامه‌ای با سرعت نیتیو و کسری از حجم دربیاید. پیچیدگی پشت صحنه می‌ماند؛ کاربر فقط یک تصمیم ساده و امن می‌بیند."],
      ["relay", "اشتراک اینترنت اندروید ↔ ویندوز", "هر ابزار مشابهی داده را از سرور رد می‌کند؛ این مسئله اصلاً سرور نمی‌خواست. اتصال فقط محلی بین گوشی و کامپیوتر: بدون کلاد، بدون حساب، بدون تله‌متری. حریم خصوصی از دل معماری می‌آید، نه از متن سیاست‌نامه."],
    ],
    technologies: "تکنولوژی‌ها",
    availability: "آمادگی همکاری",
    availabilityText: "همین حالا برای همکاری دورکاری آماده‌ام، تمام‌وقت یا پروژه‌ای. سریع‌ترین راه ارتباط، تلگرام یا واتساپ است؛ تماس تلفنی هم پاسخ می‌دهم. یک مسئله‌ی سخت برایم بفرستید؛ ظرف یک روز می‌گویم می‌توانم حلش کنم یا نه، و از کجا شروع می‌کنم.",
  },
};

const ResumeDocument = () => {
  const locale = useLocale();
  const fa = locale === "fa";
  const L = TEXT[fa ? "fa" : "en"];
  const { profile, projects, skills, socials } = useContent();
  const live = useLiveStats();
  const github = socials.find((s) => s.id === "github");
  const telegram = socials.find((s) => s.id === "telegram");
  const roles = fa ? ventures.map((v) => ({ ...v, ...venturesFa[v.id] })) : ventures;
  const stars = (n) => `★ ${localizeDigits(String(n), locale)}`;
  // Without live data yet, the star tile simply doesn't show.
  const stats = L.stats.filter(([v]) => v !== "stars" || live?.totals?.stars != null);

  return (
    <div className="resume-doc" dir={fa ? "rtl" : "ltr"} lang={locale}>
      <div className="resume-head">
        <div>
          <h1>{profile.name}</h1>
          <p className="resume-role">{profile.title}</p>
        </div>
        <ul className="resume-contact ltr">
          <li>
            <a href={profile.phoneHref}>{profile.phone}</a>
          </li>
          <li className="resume-muted" dir={fa ? "rtl" : "ltr"}>
            {L.contactLine}
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <a href={telegram.href}>t.me/{telegram.handle.slice(1)}</a>
          </li>
          <li>
            <a href={github.href}>github.com/Mahdi-mortazavi</a>
          </li>
          <li>
            <a href={profile.website}>{profile.host}</a>
          </li>
        </ul>
      </div>

      <p className="resume-lede">{L.lede}</p>

      <dl className="resume-stats">
        {stats.map(([value, label]) => (
          <div key={label}>
            <dt className="tabular-nums">{value === "stars" ? stars(live.totals.stars) : value}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h2>{L.ventures}</h2>
        {roles.map((v) => (
          <div key={v.id} className="resume-item">
            <div className="resume-item-head">
              <h3>
                {v.role} <span>· {v.name} · {v.what}</span>
              </h3>
              {v.id === "senagh" && (
                <a className="resume-year ltr" href={v.href}>
                  senagh.ir
                </a>
              )}
            </div>
            <p>{v.text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>{L.howIWork}</h2>
        <div className="resume-principles">
          {L.principles.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>{L.products}</h2>
        {L.productList.map(([id, what, why]) => {
          const p = projects.find((x) => x.id === id);
          const source = p.links.find((l) => l.kind === "source");
          const s = live?.stats?.[id];
          return (
            <div key={id} className="resume-item">
              <div className="resume-item-head">
                <h3>
                  {p.title} <span>· {what}</span>
                </h3>
                {s && <span className="resume-year tabular-nums">{stars(s.stars)}</span>}
              </div>
              <p>{why}</p>
              <p className="resume-stack">
                <span className="ltr">{p.stack.join(" · ")}</span> ·{" "}
                <a className="ltr" href={source.href}>
                  {source.href.replace("https://", "")}
                </a>
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <h2>{L.technologies}</h2>
        <dl className="resume-skills">
          {skills.map((group) => (
            <div key={group.category}>
              <dt>{group.category}</dt>
              <dd className="ltr">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>{L.availability}</h2>
        <p>{L.availabilityText}</p>
      </section>
    </div>
  );
};

export default ResumeDocument;
