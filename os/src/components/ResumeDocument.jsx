import { profile, projects, skills, socials } from "#constants";

// The resume, as a document. Rendered in the Resume window and as the
// print/PDF version. Only facts that appear elsewhere on this site.
const RESUME_PROJECTS = ["relay", "flow", "sooda", "purify", "overrun", "nava"];

const ResumeDocument = () => {
  const items = RESUME_PROJECTS.map((id) => projects.find((p) => p.id === id));
  const github = socials.find((s) => s.id === "github");
  const telegram = socials.find((s) => s.id === "telegram");

  return (
    <div className="resume-doc">
      <div className="resume-head">
        <div>
          <h1>{profile.name}</h1>
          <p className="resume-role">{profile.role} · Product Builder</p>
        </div>
        <ul className="resume-contact">
          <li>{profile.location}</li>
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <a href={profile.website}>{profile.host}</a>
          </li>
          <li>
            <a href={github.href}>github.com/Mahdi-mortazavi</a>
          </li>
          <li>
            <a href={telegram.href}>t.me/{telegram.handle.slice(1)}</a>
          </li>
        </ul>
      </div>

      <section>
        <h2>Profile</h2>
        <p>
          Full-stack developer and product builder who takes problems apart
          from first principles and ships the answer as a real product. Builds
          across Android, Windows, Flutter, Rust, the web and Cloudflare&apos;s
          edge, with a consistent standard: open source, offline-first,
          private by design, and Persian (RTL) treated as a first-class
          language. Every project is built in public, with automated CI
          releases.
        </p>
      </section>

      <section>
        <h2>Selected projects</h2>
        {items.map((p) => (
          <div key={p.id} className="resume-item">
            <div className="resume-item-head">
              <h3>
                {p.title} <span>· {p.kind}</span>
              </h3>
              <span className="resume-year">{p.year}</span>
            </div>
            <p>{p.summary}</p>
            <ul>
              {p.highlights.slice(0, 2).map((h) => (
                <li key={h.slice(0, 20)}>{h}</li>
              ))}
            </ul>
            <p className="resume-stack">{p.stack.join(" · ")}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Skills</h2>
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
        <h2>Languages</h2>
        <p>Persian (native) · English</p>
      </section>
    </div>
  );
};

export default ResumeDocument;
