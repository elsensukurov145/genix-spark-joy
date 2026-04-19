import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileText, UsersRound, BookOpen, Briefcase, Trophy } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const steps: { icon: typeof FileText; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: FileText, titleKey: "tl_1_t", descKey: "tl_1_d" },
  { icon: UsersRound, titleKey: "tl_2_t", descKey: "tl_2_d" },
  { icon: BookOpen, titleKey: "tl_3_t", descKey: "tl_3_d" },
  { icon: Briefcase, titleKey: "tl_4_t", descKey: "tl_4_d" },
  { icon: Trophy, titleKey: "tl_5_t", descKey: "tl_5_d" },
];

export const Timeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const { t } = useI18n();

  return (
    <section id="timeline" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20 max-w-2xl mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/80">
            {t("tl_kicker")}
          </span>
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
            {t("tl_title_a")} <span className="text-gradient">{t("tl_title_b")}</span>
          </h2>
        </motion.div>

        <div ref={ref} className="relative max-w-3xl mx-auto">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-5 md:left-1/2 top-0 w-px bg-gradient-to-b from-primary via-primary-glow to-secondary -translate-x-1/2 shadow-[0_0_12px_hsl(var(--primary))]"
          />

          <div className="space-y-10 md:space-y-16">
            {steps.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={s.titleKey}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex items-center gap-6 md:gap-12 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="relative h-4 w-4">
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                      <div className="relative h-4 w-4 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary))]" />
                    </div>
                  </div>

                  <div className={`flex-1 pl-14 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="glass rounded-2xl p-5 sm:p-6"
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <div className="text-xs text-muted-foreground tabular-nums">0{i + 1}</div>
                        <div className="h-px flex-1 bg-white/10" />
                        <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                          <s.icon className="h-4 w-4" />
                        </div>
                      </div>
                      <h3 className="display-font text-xl sm:text-2xl font-bold mb-2">
                        {t(s.titleKey)}
                      </h3>
                      <p className="text-sm text-muted-foreground">{t(s.descKey)}</p>
                    </motion.div>
                  </div>
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
