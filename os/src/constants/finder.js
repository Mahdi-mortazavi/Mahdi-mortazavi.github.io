// Finder tree, generated from the (localized) project data so it never drifts.
// `l` holds the folder and file labels for the current language.

export const finderLabels = {
  en: {
    projects: "Projects",
    archive: "On this site",
    about: "About me",
    resume: "Resume",
    trash: "Trash",
    caseStudy: "Case study",
    sourceCode: "Source code",
    aboutFile: "about-me.txt",
    notes: "Notes",
    resumeFile: "Resume.pdf",
    trashReadme: "why-is-it-empty.txt",
    trashTitle: "Why the Trash is empty",
    trashSubtitle: "Shipped, not deleted",
    trashBody: [
      "Nothing I've built ended up here. Unfinished ideas don't get thrown away: they get published in the state they're in and keep moving, which is the whole idea behind Mova.",
      "If you're looking for something that isn't on the desktop, every repository is on GitHub, and every release is on the Build in Public timeline.",
    ],
  },
  fa: {
    projects: "پروژه‌ها",
    archive: "در همین سایت",
    about: "درباره من",
    resume: "رزومه",
    trash: "سطل زباله",
    caseStudy: "مطالعه موردی",
    sourceCode: "سورس کد",
    aboutFile: "درباره-من.txt",
    notes: "یادداشت‌ها",
    resumeFile: "رزومه.pdf",
    trashReadme: "چرا-خالی-است.txt",
    trashTitle: "چرا سطل زباله خالی است",
    trashSubtitle: "منتشر شده، نه حذف شده",
    trashBody: [
      "هیچ‌کدام از چیزهایی که ساخته‌ام به اینجا نرسیده. ایده‌های ناتمام دور ریخته نمی‌شوند: در همان وضعیتی که هستند منتشر می‌شوند و جلو می‌روند؛ این همان فکری است که مووا بر پایه‌اش ساخته شده.",
      "اگر دنبال چیزی هستید که روی دسکتاپ نیست، همه مخزن‌ها در گیت‌هاب هستند و همه نسخه‌ها در خط زمانی «ساختن در ملأعام».",
    ],
  },
};

const projectFolder = (project, l) => ({
  id: project.id,
  name: project.title,
  kind: "folder",
  icon: "/images/folder.png",
  children: [
    {
      id: `${project.id}-txt`,
      name: `${project.title}.txt`,
      kind: "file",
      fileType: "txt",
      icon: "/images/txt.png",
      title: project.title,
      subtitle: project.tagline,
      description: [project.summary, ...project.description.slice(1)],
    },
    {
      id: `${project.id}-case`,
      name: l.caseStudy,
      kind: "file",
      fileType: "app",
      icon: "/images/safari.png",
      target: { window: "safari", data: { projectId: project.id } },
    },
    ...project.links.map((link, i) => ({
      id: `${project.id}-link-${i}`,
      name: link.kind === "source" ? l.sourceCode : link.label,
      kind: "file",
      fileType: "url",
      icon: link.kind === "source" ? "/images/github.webp" : "/images/safari.png",
      href: link.href,
    })),
    ...project.screenshots.slice(0, 3).map((src, i) => ({
      id: `${project.id}-img-${i}`,
      name: `${project.slug}-${i + 1}.webp`,
      kind: "file",
      fileType: "img",
      icon: "/images/image.png",
      imageUrl: src,
    })),
  ],
});

export const buildLocations = ({ profile, projects, archive, trashedProjects }, locale = "en") => {
  const l = finderLabels[locale] ?? finderLabels.en;
  return {
    work: {
      id: "work",
      name: l.projects,
      icon: "/icons/work.svg",
      kind: "folder",
      children: [
        ...projects.map((p) => projectFolder(p, l)),
        {
          id: "archive",
          name: l.archive,
          kind: "folder",
          icon: "/images/folder.png",
          children: archive.map((item) => ({
            id: `archive-${item.id}`,
            name: item.title,
            kind: "file",
            fileType: "url",
            icon: "/images/safari.png",
            href: item.live,
          })),
        },
      ],
    },
    about: {
      id: "about",
      name: l.about,
      icon: "/icons/info.svg",
      kind: "folder",
      children: [
        {
          id: "about-txt",
          name: l.aboutFile,
          kind: "file",
          fileType: "txt",
          icon: "/images/txt.png",
          title: profile.name,
          subtitle: profile.headline,
          description: profile.summary,
        },
        {
          id: "about-notes",
          name: l.notes,
          kind: "file",
          fileType: "app",
          icon: "/images/Notes.png",
          target: { window: "notes" },
        },
        {
          id: "about-contact",
          name: "mahdi.vcf",
          kind: "file",
          fileType: "app",
          icon: "/images/contact.webp",
          target: { window: "contact" },
        },
        {
          id: "about-resume",
          name: l.resumeFile,
          kind: "file",
          fileType: "app",
          icon: "/images/pdf.png",
          target: { window: "resume" },
        },
      ],
    },
    resume: {
      id: "resume",
      name: l.resume,
      icon: "/icons/file.svg",
      kind: "folder",
      children: [
        {
          id: "resume-pdf",
          name: l.resumeFile,
          kind: "file",
          fileType: "app",
          icon: "/images/pdf.png",
          target: { window: "resume" },
        },
      ],
    },
    trash: {
      id: "trash",
      name: l.trash,
      icon: "/icons/trash.svg",
      kind: "folder",
      children: [
        {
          id: "trash-readme",
          name: l.trashReadme,
          kind: "file",
          fileType: "txt",
          icon: "/images/txt.png",
          title: l.trashTitle,
          subtitle: l.trashSubtitle,
          description: l.trashBody,
        },
        ...trashedProjects.map((item) => ({
          id: `trash-${item.name}`,
          name: item.name,
          kind: "file",
          fileType: "url",
          icon: "/images/folder.png",
          href: item.href,
        })),
      ],
    },
  };
};
