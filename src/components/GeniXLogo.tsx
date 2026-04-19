import { motion } from "framer-motion";

export const GeniXLogo = ({ className = "" }: { className?: string }) => (
  <div className={`inline-flex items-center gap-2 font-display font-bold ${className}`}>
    <motion.div
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative h-8 w-8"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary" />
      <div className="absolute inset-[2px] rounded-[6px] bg-background flex items-center justify-center">
        <span className="text-primary text-sm">G</span>
      </div>
    </motion.div>
    <span className="tracking-tight">
      Geni<span className="text-primary">X</span>
    </span>
  </div>
);
