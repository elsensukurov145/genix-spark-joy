import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { GeniXLogo } from "./GeniXLogo";

export const PageLoader = ({ onDone }: { onDone: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      setTimeout(onDone, 600);
    }, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl"
          >
            <GeniXLogo className="text-3xl" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute bottom-1/3 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
