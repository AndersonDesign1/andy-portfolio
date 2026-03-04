"use client";

import { useLayoutEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div className="min-h-screen">{children}</div>;
}
