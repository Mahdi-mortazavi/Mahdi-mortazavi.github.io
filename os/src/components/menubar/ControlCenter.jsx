import clsx from "clsx";
import { ArrowUpRight, Languages, Moon, Sun, Volume2, Wifi } from "lucide-react";
import useUiStore from "#store/ui";
import useSoundStore from "#store/music";
import { profile, socials } from "#constants";
import { useIsDark, useToggleDark } from "../../hooks/useTheme";
import { toggleLocale, useLocale, useT } from "../../i18n";

const Slider = ({ label, icon: Icon, value, min = 0, onChange }) => (
  <div className="cc-tile cc-slider">
    <p className="cc-label">{label}</p>
    <label className="cc-range" dir="ltr">
      <Icon aria-hidden="true" />
      <input
        type="range"
        min={min}
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={{ "--value": `${((value - min) / (100 - min)) * 100}%` }}
      />
    </label>
  </div>
);

// macOS-style Control Center. Shared by the desktop menu bar and the
// phone home screen.
const ControlCenter = ({ className }) => {
  const isDark = useIsDark();
  const toggleDark = useToggleDark();
  const { brightness, setBrightness } = useUiStore();
  const { volume, setVolume } = useSoundStore();
  const channel = socials.find((s) => s.id === "channel");
  const t = useT();
  const locale = useLocale();

  return (
    <div className={clsx("control-center", className)} role="dialog" aria-label={t("menu.controlCenter")}>
      <div className="cc-grid">
        <div className="cc-tile cc-toggles">
          <div className="cc-toggle">
            <span className="cc-icon is-on" aria-hidden="true">
              <Wifi />
            </span>
            <span>
              <span className="cc-toggle-title">{t("cc.wifi")}</span>
              <span className="cc-toggle-sub">{t("cc.home")}</span>
            </span>
          </div>
          <button
            type="button"
            className="cc-toggle"
            onClick={toggleDark}
            aria-pressed={isDark}
          >
            <span className={clsx("cc-icon", isDark && "is-on")} aria-hidden="true">
              {isDark ? <Moon /> : <Sun />}
            </span>
            <span>
              <span className="cc-toggle-title">{t("cc.darkMode")}</span>
              <span className="cc-toggle-sub">{t(isDark ? "cc.on" : "cc.off")}</span>
            </span>
          </button>
          <button
            type="button"
            className="cc-toggle"
            onClick={toggleLocale}
            aria-label={t("menu.languageAria")}
          >
            <span className="cc-icon is-on" aria-hidden="true">
              <Languages />
            </span>
            <span>
              <span className="cc-toggle-title">{t("cc.language")}</span>
              <span className="cc-toggle-sub">{locale === "fa" ? "فارسی" : "English"}</span>
            </span>
          </button>
        </div>

        <div className="cc-tile cc-music">
          <img src={profile.photo} alt="" className="cc-cover" width="44" height="44" />
          <div className="min-w-0">
            <p className="cc-track truncate">{t("cc.channel")}</p>
            <p className="cc-artist truncate">{t("cc.channelSub")}</p>
          </div>
          <a
            className="cc-join"
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cc.join")} <ArrowUpRight aria-hidden="true" className="rtl-flip" />
          </a>
        </div>
      </div>

      <Slider label={t("cc.display")} icon={Sun} value={brightness} min={30} onChange={setBrightness} />
      <Slider label={t("cc.sound")} icon={Volume2} value={volume} onChange={setVolume} />
    </div>
  );
};

export default ControlCenter;
