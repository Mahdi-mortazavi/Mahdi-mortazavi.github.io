import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLiveStats } from "../../hooks/useLiveStats";
import { useNow } from "../../hooks/useNow";
import { monthGrid } from "../../lib/calendar";
import { openProject } from "../../lib/actions";
import { formatDate, localizeDigits, useLocale, useT } from "../../i18n";
import { useContent } from "../../i18n/content";

export const CalendarWidget = () => {
  const today = useNow();
  const t = useT();
  const locale = useLocale();
  const [offset, setOffset] = useState(0);
  const grid = monthGrid(today, offset, locale);

  return (
    <section className="widget calendar-widget" aria-label={t("calendar.label")}>
      <div className="calendar-head">
        <h2>
          {formatDate(grid.first, { month: "long" }, locale)}
          {grid.showYear && (
            <span className="calendar-year"> {formatDate(grid.first, { year: "numeric" }, locale)}</span>
          )}
        </h2>
        <div className="flex">
          <button type="button" onClick={() => setOffset((o) => o - 1)} aria-label={t("calendar.prev")}>
            <ChevronLeft aria-hidden="true" className="rtl-flip" />
          </button>
          <button type="button" onClick={() => setOffset((o) => o + 1)} aria-label={t("calendar.next")}>
            <ChevronRight aria-hidden="true" className="rtl-flip" />
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        {grid.weekdays.map((d, i) => (
          <span key={i} className="calendar-weekday" data-weekend={(locale === "fa" && i === 6) || undefined} aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: grid.leading }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {grid.days.map((day) => (
          <span
            key={day.n}
            className="calendar-day"
            data-today={day.isToday || undefined}
            data-weekend={day.weekend || undefined}
            aria-current={day.isToday ? "date" : undefined}
          >
            {localizeDigits(day.n, locale)}
          </span>
        ))}
      </div>
    </section>
  );
};

// Featured project card; stars come from data.json (hidden until it loads).
export const FeaturedWidget = () => {
  const t = useT();
  const stars = useLiveStats()?.stats?.relay?.stars;
  const { projects } = useContent();
  const relay = projects.find((p) => p.id === "relay");
  return (
    <section className="widget featured-widget" aria-label={t("featured.label")}>
      <p className="featured-label">{t("featured.label")}</p>
      <h2 className="featured-title">
        {relay.title}
        {stars != null && <span className="featured-stars tabular-nums">★ {localizeDigits(String(stars))}</span>}
      </h2>
      <p className="featured-desc">{t("featured.relay")}</p>
      <div className="featured-links">
        <button type="button" onClick={() => openProject("relay")}>
          {t("featured.caseStudy")}
        </button>
        <a href="https://github.com/Mahdi-mortazavi/relay" target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight aria-hidden="true" className="rtl-flip" />
        </a>
      </div>
    </section>
  );
};
