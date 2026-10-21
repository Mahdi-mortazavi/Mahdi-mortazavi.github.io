// VS Code window content. Files are plain strings; the editor highlights them.

import { profile, skills, socials } from "./profile";
import { projects } from "./projects";

export const FILE_TREE = [
  {
    name: "mahdi-mortazavi.github.io",
    type: "folder",
    open: true,
    children: [
      {
        name: "src",
        type: "folder",
        open: true,
        children: [
          { name: "about.tsx", type: "file", lang: "tsx" },
          { name: "skills.ts", type: "file", lang: "ts" },
          { name: "projects.ts", type: "file", lang: "ts" },
          { name: "contact.tsx", type: "file", lang: "tsx" },
        ],
      },
      { name: "README.md", type: "file", lang: "md" },
      { name: "package.json", type: "file", lang: "json" },
    ],
  },
];

const q = (s) => JSON.stringify(s);

export const FILE_CONTENTS = {
  "about.tsx": {
    lang: "tsx",
    code: `const Developer = () => ({
  name: ${q(profile.name)},
  role: ${q(profile.role)},
  location: ${q(profile.location)},
  thinking: "first principles",
  ships: ["Android", "Windows", "Flutter", "Rust", "Web", "Edge"],
  principles: ["open source", "offline-first", "private by design"],
  available: true,
});

// Problem → first principles → design → a real, shipped product.

export default Developer;`,
  },
  "skills.ts": {
    lang: "ts",
    code: `type Category = ${skills.map((s) => q(s.category)).join(" | ")};

export const skills: Record<Category, string[]> = {
${skills.map((s) => `  ${q(s.category)}: [${s.items.map(q).join(", ")}],`).join("\n")}
};`,
  },
  "projects.ts": {
    lang: "ts",
    code: `interface Project {
  name: string;
  stack: string[];
  status: "Live" | "Open source";
  source: string;
}

export const projects: Project[] = [
${projects
  .map(
    (p) => `  {
    name: ${q(p.title)},
    stack: [${p.stack.slice(0, 4).map(q).join(", ")}],
    status: ${q(p.status)},
    source: ${q(`github.com/Mahdi-mortazavi/${p.repo}`)},
  },`,
  )
  .join("\n")}
];`,
  },
  "contact.tsx": {
    lang: "tsx",
    code: `export const contact = {
${socials.map((s) => `  ${s.id}: ${q(s.href.replace("mailto:", ""))},`).join("\n")}
  openTo: "collaborations & product partnerships",
};

// Fastest reply: Telegram.`,
  },
  "README.md": {
    lang: "md",
    code: `# Hey, I'm ${profile.name}

${profile.headline}.

## Building
${projects.map((p) => `- ${p.title}: ${p.tagline}`).join("\n")}

## Stack
- Flutter / Dart / Kotlin / Jetpack Compose
- C# / .NET 8 / WinUI 3 / Rust / Tauri
- TypeScript / React / Cloudflare Workers / WireGuard

## Principles
- Open source, offline-first, private by design
- Persian (RTL) is a first-class language, never a translation

## Get in touch
[Email](mailto:${profile.email})`,
  },
  "package.json": {
    lang: "json",
    code: `{
  "name": "mahdi-mortazavi.github.io",
  "author": ${q(profile.name)},
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "gsap": "^3.14.2",
    "react": "^19.2.0",
    "tailwindcss": "^4.1.18",
    "zustand": "^5.0.10"
  }
}`,
  },
};

export const TERMINAL_LINES = [
  { type: "dir", text: "mahdi-mortazavi.github.io on  main" },
  { type: "cmd", text: "npm run dev" },
  { type: "info", text: "" },
  { type: "info", text: "  VITE v7.3.1  ready in 284 ms" },
  { type: "info", text: "" },
  { type: "success", text: "  ➜  Local:   http://localhost:5173/" },
  { type: "info", text: "  ➜  Network: use --host to expose" },
  { type: "info", text: "" },
  { type: "dir", text: "mahdi-mortazavi.github.io on  main" },
  { type: "cmd", text: "git log --oneline -5" },
  { type: "info", text: "54fc787 🔄 Sync with GitHub" },
  { type: "info", text: "b8e1d02 feat: macOS desktop, iOS home screen" },
  { type: "info", text: "3a71c4e feat: build-in-public release timeline" },
  { type: "info", text: "9f02b5d feat: one page per project with FAQ" },
  { type: "info", text: "c1d7a90 feat: live star counts from GitHub" },
];
