"use client";

import { motion } from "motion/react";
import { useLayoutEffect } from "react";
import { useLenis } from "@/components/scroll-provider";

export default function Template({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [lenis]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
