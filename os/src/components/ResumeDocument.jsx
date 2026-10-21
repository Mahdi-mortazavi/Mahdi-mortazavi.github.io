import { profile, projects, skills, socials, ventures } from "#constants";

// The resume, as a document. Rendered in the Resume window and when printing;
// the downloadable PDFs in /files/ are my own designed versions of the same text.
const STATS = [
  ["6", "Products shipped & released"],
  ["3", "Startups built or led"],
  ["4", "Toolchains: Dart, Rust, Kotlin, TS"],
  ["100%", "Solo: design → build → release"],
];

const PRINCIPLES = [
  [
    "Problem before stack",
    "I open a problem down to its most basic parts, then take the tool it actually calls for: Rust for a native binary, Kotlin for Android, Flutter for cross-platform, TypeScript for the web.",
  ],
  [
    "New tech is not a cost",
    "Learning an unfamiliar language or framework mid-project is normal for me. Four different toolchains, all self-taught, all shipped and public.",
  ],
  [
    "Speed to released",
    "Idea to public release in weeks, working alone. I use AI tooling for speed; it never replaces understanding the code.",
  ],
];

// The one-line "why" behind each product, as it reads on my resume.
const PRODUCTS = [
  ["nava", "Minimalist productivity app", "Everyone adds features to fix focus; I removed them. Squircle geometry, haptic feedback and calm breathing animations: interaction tuned to Apple-native fidelity, not framework defaults."],
  ["flow", "Persian/RTL focus & habit app", "Habit apps collapse the first day you miss, so I designed for failure instead of streaks. Fully offline and grounded in behavioral science: one priority a day, a timer that survives the app being killed, habits that come back after a missed day, and statistics that don't judge."],
  ["sooda", "Profit & pricing calculator", "A calculator needs no server, no account, and none of your data. Bilingual English/Persian app for sellers: profit, margin, discount and real profit in one tap. Fully offline, tracks nothing, perfect Lighthouse scores across all four categories, deployed by GitHub Actions."],
  ["mova", "AI anti-procrastination app", "Perfectionism isn't a time-management problem, so I stopped treating it like one. A psychology-based app for people who stall at the starting line, built on React 19 and Vite with Gemini in the loop."],
  ["purify", "Disk-cleanup utility for Windows", "Rust + Tauri instead of Electron, for a native-speed binary at a fraction of the size. The complexity stays behind the scenes; the user sees one simple, safe decision."],
  ["relay", "Android ↔ Windows connection sharing", "Every similar tool routes your data through a server; this problem never needed one. Local-only pairing between phone and PC: no cloud, no accounts, no telemetry. Privacy from the architecture, not from a policy page."],
];

const ResumeDocument = () => {
  const github = socials.find((s) => s.id === "github");
  const telegram = socials.find((s) => s.id === "telegram");

  return (
    <div className="resume-doc">
      <div className="resume-head">
        <div>
          <h1>{profile.name}</h1>
          <p className="resume-role">{profile.title}</p>
        </div>
        <ul className="resume-contact">
          <li>
            <a href={profile.phoneHref}>{profile.phone}</a> · WhatsApp · Telegram
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

      <p className="resume-lede">
        I solve the problem first and choose the technology second. Six products
        designed, built and released across four different toolchains, because
        each problem demanded a different one. Technology is an instrument, not
        an identity.
      </p>

      <dl className="resume-stats">
        {STATS.map(([value, label]) => (
          <div key={label}>
            <dt>{value}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h2>Ventures & leadership</h2>
        {ventures.map((v) => (
          <div key={v.id} className="resume-item">
            <div className="resume-item-head">
              <h3>
                {v.role} <span>· {v.name} · {v.what}</span>
              </h3>
              {v.href && v.href.includes("senagh") && (
                <a className="resume-year" href={v.href}>
                  senagh.ir
                </a>
              )}
            </div>
            <p>{v.text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>How I work</h2>
        <div className="resume-principles">
          {PRINCIPLES.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Open-source products: public, shipped, verifiable</h2>
        {PRODUCTS.map(([id, what, why]) => {
          const p = projects.find((x) => x.id === id);
          const source = p.links.find((l) => l.kind === "source");
          return (
            <div key={id} className="resume-item">
              <div className="resume-item-head">
                <h3>
                  {p.title} <span>· {what}</span>
                </h3>
                <span className="resume-year">{p.year}</span>
              </div>
              <p>{why}</p>
              <p className="resume-stack">
                {p.stack.join(" · ")} · <a href={source.href}>{source.href.replace("https://", "")}</a>
              </p>
            </div>
          );
        })}
      </section>

      <section>
        <h2>Technologies</h2>
        <dl className="resume-skills">
          {skills.map((group) => (
            <div key={group.category}>
              <dt>{group.category}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          Available now for remote work, full-time or contract. Fastest reply on
          Telegram or WhatsApp; phone calls welcome. Send me a hard problem and
          I&apos;ll tell you within a day whether I can solve it and how I&apos;d start.
        </p>
      </section>
    </div>
  );
};

export default ResumeDocument;
