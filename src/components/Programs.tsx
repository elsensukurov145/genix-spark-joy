import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, Check, ExternalLink } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const CANVA_URL = "https://canva.link/xq4675rrx5sh73w";

type Program = {
  titleKey: TranslationKey;
  tagKey: TranslationKey;
  icon: typeof BarChart3;
  features: TranslationKey[];
  glow: "primary" | "secondary";
};

const programs: Program[] = [
  {
    titleKey: "prog_1_title",
    tagKey: "prog_1_tag",
    icon: BarChart3,
    features: ["prog_1_f1", "prog_1_f2", "prog_1_f3", "prog_1_f4", "prog_1_f5"],
    glow: "primary",
  },
  {
    titleKey: "prog_2_title",
    tagKey: "prog_2_tag",
    icon: Building2,
    features: ["prog_2_f1", "prog_2_f2", "prog_2_f3", "prog_2_f4", "prog_2_f5"],
    glow: "secondary",
  },
];

function ProgramCard({ p }: { p: Program }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { t } = useI18n();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 8 });
  };

  const isPrimary = p.glow === "primary";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.2s ease-out",
      }}
      className="group relative w-full md:w-[520px] md:shrink-0 preserve-3d"
    >
      <div
        className={`absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md ${
          isPrimary
            ? "bg-gradient-to-br from-primary via-primary-glow to-transparent"
            : "bg-gradient-to-br from-secondary via-secondary-glow to-transparent"
        }`}
      />
      <div className="relative glass-strong rounded-3xl p-6 sm:p-8 md:p-10 h-full">
        <div
          className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl mb-5 sm:mb-6 ${
            isPrimary ? "bg-primary/15 text-primary" : "bg-secondary/15 text-secondary"
          }`}
        >
          <p.icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          {t(p.tagKey)}
        </div>
        <h3 className="display-font text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6 leading-tight">
          {t(p.titleKey)}
        </h3>
        <ul className="space-y-3 mb-8">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check
                className={`h-4 w-4 mt-0.5 shrink-0 ${
                  isPrimary ? "text-primary" : "text-secondary"
                }`}
              />
              <span>{t(f)}</span>
            </li>
          ))}
        </ul>
        <a
          href="#apply"
          className={`group/btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
            isPrimary
              ? "bg-primary text-primary-foreground hover:bg-primary-glow glow-primary"
              : "bg-secondary text-secondary-foreground hover:bg-secondary-glow glow-secondary"
          }`}
        >
          {t("prog_more")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}

export const Programs = () => {
  const { t } = useI18n();
  return (
    <section id="programs" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12 md:mb-16 flex flex-col gap-6"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary/80">
              {t("prog_kicker")}
            </span>
            <h2 className="display-font text-3xl sm:text-4xl md:text-5xl font-bold mt-4">
              {t("prog_title_a")} <span className="text-gradient">{t("prog_title_b")}</span>
            </h2>
          </div>
          <a
            href={CANVA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start group inline-flex items-center gap-2 rounded-full border-2 bg-transparent px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold transition-all hover:bg-[#1D9E75]/10"
            style={{ borderColor: "#1D9E75", color: "#1D9E75" }}
          >
            {t("prog_canva")}
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>

      {/* Cards: single column on mobile, horizontal scroll on md+ */}
      <div className="container md:hidden flex flex-col gap-6">
        {programs.map((p) => (
          <ProgramCard key={p.titleKey} p={p} />
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto scrollbar-hide pb-8">
        <div className="flex gap-6 px-6 md:px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]">
          {programs.map((p) => (
            <ProgramCard key={p.titleKey} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
