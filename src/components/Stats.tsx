import { motion } from "framer-motion";
import { Clock, GraduationCap, Sparkles } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const stats: { icon: typeof Clock; valueKey: TranslationKey; labelKey: TranslationKey; accent: "primary" | "secondary" }[] = [
  { icon: Clock, valueKey: "stats_1_value", labelKey: "stats_1_label", accent: "primary" },
  { icon: GraduationCap, valueKey: "stats_2_value", labelKey: "stats_2_label", accent: "secondary" },
  { icon: Sparkles, valueKey: "stats_3_value", labelKey: "stats_3_label", accent: "primary" },
];

export const Stats = () => {
  const { t } = useI18n();
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/80">
            {t("stats_kicker")}
          </span>
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
            {t("stats_title_a")} <span className="text-gradient">{t("stats_title_b")}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.labelKey}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.12, type: "spring", stiffness: 90, damping: 14 }}
              className="group relative glass rounded-3xl p-6 sm:p-8 hover:bg-white/[0.06] transition-all"
            >
              <div
                className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm ${
                  s.accent === "primary"
                    ? "bg-gradient-to-br from-primary/40 to-transparent"
                    : "bg-gradient-to-br from-secondary/40 to-transparent"
                }`}
              />
              <div className="relative">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-5 sm:mb-6 ${
                    s.accent === "primary"
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary/15 text-secondary"
                  }`}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="display-font text-4xl sm:text-5xl font-bold mb-2">
                  {t(s.valueKey)}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">{t(s.labelKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
