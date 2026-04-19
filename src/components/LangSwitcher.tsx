import { useI18n, type Lang } from "@/lib/i18n";

const langs: { code: Lang; label: string }[] = [
  { code: "az", label: "AZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export const LangSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur p-0.5 ${
        compact ? "text-[11px]" : "text-xs"
      }`}
      role="group"
      aria-label="Language"
    >
      {langs.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 font-semibold tracking-wide transition-all ${
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.55)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
};
