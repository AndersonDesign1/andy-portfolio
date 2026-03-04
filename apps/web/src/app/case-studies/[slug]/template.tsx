"use client";

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

  return <div className="min-h-screen">{children}</div>;
}
