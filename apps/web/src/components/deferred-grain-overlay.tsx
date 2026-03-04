"use client";

import { useEffect, useState } from "react";

export default function DeferredGrainOverlay() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const requestIdle = globalThis.requestIdleCallback;
    const cancelIdle = globalThis.cancelIdleCallback;

    if (requestIdle && cancelIdle) {
      const idleId = requestIdle(() => {
        setShowOverlay(true);
      });

      return () => cancelIdle(idleId);
    }

    const timeoutId = globalThis.setTimeout(() => {
      setShowOverlay(true);
    }, 350);

    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  if (!showOverlay) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] [contain:strict] [transform:translateZ(0)]"
      style={{
        opacity: "var(--grain-opacity)",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}
