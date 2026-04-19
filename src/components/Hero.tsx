import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowDown, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const LampScene = lazy(() => import("./three/LampScene"));

const CANVA_URL = "https://canva.link/xq4675rrx5sh73w";

export const Hero = () => {
  const [on, setOn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t, lang } = useI18n();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const HEADING_1 = t("hero_h1");
  const HEADING_2 = t("hero_h2");

  return (
    <section className="relative min-h-screen w-full overflow-hidden noise">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, hsl(0 70% 8% / 0.55) 100%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[8%] h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute bottom-1/4 right-[8%] h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[hsl(0,60%,25%)]/20 blur-[140px]" />
      </div>

      <AnimatePresence>
        {on && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, hsl(38 92% 60% / 0.45), transparent 55%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div className="container relative z-10 grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-screen pt-24 pb-12">
        <div className="relative h-[42vh] sm:h-[50vh] lg:h-[88vh] order-2 lg:order-1 -mt-4 sm:-mt-8 lg:-mt-24">
          {!isMobile ? (
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  {t("hero_loading")}
                </div>
              }
            >
              <LampScene on={on} onToggle={() => setOn((v) => !v)} />
            </Suspense>
          ) : (
            <MobileLamp on={on} onToggle={() => setOn((v) => !v)} hint={t("hero_lamp_tap")} />
          )}

          <AnimatePresence>
            {!on && !isMobile && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-muted-foreground"
              >
                <span className="tracking-wide">{t("hero_lamp_hint")}</span>
                <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative order-1 lg:order-2">
          <motion.div
            animate={{ opacity: on ? 1 : isMobile ? 0.95 : 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5 sm:space-y-6"
          >
            <h1 className="display-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              <AnimatedHeading text={HEADING_1} on={on || isMobile} startIndex={0} key={`h1-${lang}`} />
              <AnimatedHeading text={HEADING_2} on={on || isMobile} startIndex={HEADING_1.length} key={`h2-${lang}`} />
            </h1>

            <motion.p
              animate={{ y: on ? 0 : 8, opacity: on ? 1 : isMobile ? 0.9 : 0.4 }}
              transition={{ duration: 0.7, delay: on ? 0.6 : 0 }}
              className="text-base sm:text-lg text-muted-foreground max-w-md"
            >
              <span className="text-foreground/90">{t("hero_tag_finance")}</span>
              <span className="text-primary mx-2">·</span>
              <span className="text-foreground/90">{t("hero_tag_business")}</span>
              <span className="text-primary mx-2">·</span>
              <span className="text-foreground/90">{t("hero_tag_urban")}</span>
            </motion.p>

            <motion.div
              animate={{ opacity: on || isMobile ? 1 : 0, y: on || isMobile ? 0 : 8 }}
              transition={{ duration: 0.6, delay: on ? 0.9 : 0 }}
              className="flex flex-wrap gap-3 pt-2"
              style={{ pointerEvents: on || isMobile ? "auto" : "none" }}
            >
              <a
                href="#programs"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 sm:px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow transition-all glow-primary"
              >
                {t("hero_cta_program")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-full glass px-5 sm:px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-all"
              >
                {t("hero_cta_apply")}
              </a>
              <a
                href={CANVA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border-2 bg-transparent px-5 sm:px-6 py-3 text-sm font-semibold transition-all hover:bg-[#1D9E75]/10"
                style={{ borderColor: "#1D9E75", color: "#1D9E75" }}
              >
                {t("hero_cta_canva")}
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {(on || isMobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground"
          >
            <span>{t("hero_scroll")}</span>
            <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

function AnimatedHeading({
  text,
  on,
  startIndex,
}: {
  text: string;
  on: boolean;
  startIndex: number;
}) {
  return (
    <div>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{
            opacity: on ? 1 : 0.35,
            y: on ? 0 : 4,
            filter: on ? "blur(0px)" : "blur(2px)",
          }}
          transition={{
            delay: on ? (startIndex + i) * 0.025 : 0,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  );
}

function MobileLamp({
  on,
  onToggle,
  hint,
}: {
  on: boolean;
  onToggle: () => void;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={hint}
      className="relative w-full h-full flex items-center justify-center select-none focus:outline-none"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-[35%] bg-gradient-to-b from-white/20 to-white/5" />
      <div
        className={`absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/4 rounded-full transition-all duration-700 ${
          on
            ? "h-72 w-72 bg-accent/45 blur-[80px]"
            : "h-40 w-40 bg-muted/30 blur-3xl"
        }`}
      />
      <svg
        viewBox="0 0 100 120"
        className="relative h-56 w-56 sm:h-64 sm:w-64 drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        aria-hidden
      >
        <defs>
          <radialGradient id="bulbOn" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8d6" />
            <stop offset="100%" stopColor="#ffd580" />
          </radialGradient>
          <linearGradient id="shadeOn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b2615" />
            <stop offset="100%" stopColor="#1a110a" />
          </linearGradient>
        </defs>
        <line x1="50" y1="0" x2="50" y2="40" stroke="#2a2a35" strokeWidth="1" />
        <path
          d="M 28 45 A 22 16 0 0 0 72 45 L 72 52 L 28 52 Z"
          fill={on ? "url(#shadeOn)" : "#15151c"}
          stroke={on ? "#ffb648" : "#3a3a44"}
          strokeWidth="1"
        />
        <ellipse cx="50" cy="52" rx="22" ry="3" fill={on ? "#1a110a" : "#0d0d12"} />
        <circle
          cx="50"
          cy="62"
          r="6"
          fill={on ? "url(#bulbOn)" : "#222"}
          style={{
            filter: on ? "drop-shadow(0 0 12px #ffd580)" : "none",
            transition: "all 0.4s ease",
          }}
        />
        <line x1="62" y1="50" x2="62" y2="80" stroke={on ? "#c98a3a" : "#444"} strokeWidth="1" />
        <circle cx="62" cy="82" r="3" fill={on ? "#c98a3a" : "#5a3a1f"} />
      </svg>
      {!on && (
        <span className="absolute bottom-4 text-xs text-muted-foreground tracking-wide flex items-center gap-1">
          {hint}
          <ArrowDown className="w-3 h-3 text-primary animate-bounce" />
        </span>
      )}
    </button>
  );
}
