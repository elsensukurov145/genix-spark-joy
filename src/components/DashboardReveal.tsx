import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Award, BookOpen, MessageSquare, TrendingUp, CheckCircle2, Calendar } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

export const DashboardReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.05]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.3, 1, 1]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const { t } = useI18n();

  const modules: { tKey: TranslationKey; dKey: TranslationKey; done: boolean }[] = [
    { tKey: "dash_mod_1", dKey: "dash_mod_1_d", done: false },
    { tKey: "dash_mod_2", dKey: "dash_mod_2_d", done: false },
    { tKey: "dash_mod_3", dKey: "dash_mod_3_d", done: true },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/80">
            {t("dash_kicker")}
          </span>
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
            {t("dash_title_a")} <span className="text-gradient">{t("dash_title_b")}</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-4">{t("dash_subtitle")}</p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary/60"
                style={{ left: `${(i * 73) % 100}%`, top: `${(i * 41) % 100}%` }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>

          <motion.div style={{ scale, opacity, y, filter }} className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl overflow-hidden glass-strong shadow-[0_40px_120px_-30px_rgba(29,158,117,0.4)]">
              <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-white/10 bg-black/40">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-2 sm:mx-4 min-w-0">
                  <div className="bg-white/5 rounded-md px-3 py-1 text-[11px] text-muted-foreground inline-flex items-center gap-2 max-w-full truncate">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="truncate">app.genix.az/dashboard</span>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-background to-[#0d0d14]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground">{t("dash_welcome")}</div>
                    <div className="text-base sm:text-lg font-semibold">Aysel M.</div>
                  </div>
                  <div className="glass rounded-full px-3 py-1 text-xs">{t("dash_module")}</div>
                </div>

                <div className="glass rounded-2xl p-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" /> {t("dash_progress")}
                    </span>
                    <span className="text-sm text-primary font-semibold">68%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "68%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow shadow-[0_0_20px_hsl(var(--primary))]"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="glass rounded-2xl p-5 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                      <BookOpen className="h-4 w-4 text-primary" /> {t("dash_next_modules")}
                    </div>
                    <ul className="space-y-3">
                      {modules.map((m) => (
                        <li key={m.tKey} className="flex items-center justify-between gap-3 text-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`h-2 w-2 rounded-full shrink-0 ${
                                m.done ? "bg-primary" : "bg-secondary animate-pulse"
                              }`}
                            />
                            <span className={`truncate ${m.done ? "text-muted-foreground line-through" : ""}`}>
                              {t(m.tKey)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                            <Calendar className="h-3 w-3" />
                            {t(m.dKey)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                      <MessageSquare className="h-4 w-4 text-secondary" /> {t("dash_mentor_chat")}
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white/5 rounded-lg rounded-tl-sm p-2.5 text-xs">
                        {t("dash_msg_1")}
                      </div>
                      <div className="bg-primary/15 border border-primary/20 rounded-lg rounded-tr-sm p-2.5 text-xs ml-6 text-right">
                        {t("dash_msg_2")}
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-5 md:col-span-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{t("dash_cert_progress")}</div>
                        <div className="text-xs text-muted-foreground">{t("dash_modules_left")}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <CheckCircle2 className="h-4 w-4" /> {t("dash_on_track")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
