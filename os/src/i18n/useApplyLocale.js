import { useEffect } from "react";
import { useLocale } from "./locale";

const META = {
  en: {
    title: "Mahdi Mortazavi · مهدی مرتضوی — Full-Stack Developer",
    description:
      "Mahdi Mortazavi (مهدی مرتضوی) — Full-Stack Developer, Product Builder and Problem Solver from Iran. Open source: relay, Flow, sooda, Nava, purify, overrun.",
  },
  fa: {
    title: "مهدی مرتضوی · Mahdi Mortazavi — توسعه‌دهنده فول‌استک",
    description:
      "مهدی مرتضوی، توسعه‌دهنده فول‌استک و سازنده محصول از ایران. نرم‌افزارهای متن‌باز، آفلاین و حریم‌خصوصی‌محور: ریلی، تک‌نقطه، سودا، نوا، پیوریفای و اورران.",
  },
};

// Keeps <html lang/dir>, the title and the description in sync with the
// chosen language. Mount once.
export const useApplyLocale = () => {
  const locale = useLocale();
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";
    document.title = META[locale].title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", META[locale].description);
  }, [locale]);
};
