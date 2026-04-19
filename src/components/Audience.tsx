import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { GraduationCap, HeartHandshake, Rocket } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const audience: { icon: typeof GraduationCap; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { icon: GraduationCap, titleKey: "aud_1_t", descKey: "aud_1_d" },
  { icon: HeartHandshake, titleKey: "aud_2_t", descKey: "aud_2_d" },
  { icon: Rocket, titleKey: "aud_3_t", descKey: "aud_3_d" },
];

function AudienceCard({ a, i }: { a: typeof audience[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { t } = useI18n();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 10 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.25s ease-out",
      }}
      className="group relative glass rounded-3xl p-6 sm:p-8 hover:bg-white/[0.07] preserve-3d"
    >
      <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur bg-gradient-to-br from-primary/30 via-transparent to-secondary/30" />
      <div className="relative">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-5 sm:mb-6">
          <a.icon className="h-6 w-6" />
        </div>
        <h3 className="display-font text-xl sm:text-2xl font-bold mb-3">{t(a.titleKey)}</h3>
        <p className="text-sm sm:text-base text-muted-foreground">{t(a.descKey)}</p>
      </div>
    </motion.div>
  );
}

export const Audience = () => {
  const { t } = useI18n();
  return (
    <section id="audience" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/80">
            {t("aud_kicker")}
          </span>
          <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
            {t("aud_title_a")} <span className="text-gradient">{t("aud_title_b")}</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {audience.map((a, i) => (
            <AudienceCard key={a.titleKey} a={a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
