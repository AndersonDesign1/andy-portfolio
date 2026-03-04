"use client";

import type Lenis from "lenis";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  SCROLL_DURATION,
  SCROLL_EASING_CONSTANT,
  SCROLL_EASING_EXPONENT,
} from "@/lib/constants";

const LENIS_IDLE_TIMEOUT_MS = 900;
const LENIS_FALLBACK_DELAY_MS = 180;

interface ScrollContextType {
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
}

const ScrollContext = createContext<ScrollContextType>({
  lenis: null,
  prefersReducedMotion: false,
});

interface ScrollProviderProps {
  children: React.ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldEnableLenis, setShouldEnableLenis] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Defer Lenis setup until browser is idle to reduce work on initial paint
  useEffect(() => {
    if (prefersReducedMotion) {
      setShouldEnableLenis(false);
      return;
    }

    const requestIdle = globalThis.requestIdleCallback;
    const cancelIdle = globalThis.cancelIdleCallback;

    const enableLenis = () => {
      setShouldEnableLenis(true);
    };

    const interactionEvents: Array<keyof WindowEventMap> = [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
    ];

    for (const eventName of interactionEvents) {
      window.addEventListener(eventName, enableLenis, {
        once: true,
        passive: eventName !== "keydown",
      });
    }

    const timeoutId = globalThis.setTimeout(
      enableLenis,
      LENIS_FALLBACK_DELAY_MS
    );

    if (requestIdle && cancelIdle) {
      const idleId = requestIdle(enableLenis, {
        timeout: LENIS_IDLE_TIMEOUT_MS,
      });

      return () => {
        cancelIdle(idleId);
        globalThis.clearTimeout(timeoutId);
        for (const eventName of interactionEvents) {
          window.removeEventListener(eventName, enableLenis);
        }
      };
    }

    return () => {
      globalThis.clearTimeout(timeoutId);
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, enableLenis);
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!shouldEnableLenis) {
      return;
    }

    let mounted = true;
    let removeVisibilityListener: (() => void) | null = null;

    const initLenis = async () => {
      const { default: Lenis } = await import("lenis");
      if (!mounted) {
        return;
      }

      const lenisInstance = new Lenis({
        duration: SCROLL_DURATION * 1.35,
        easing: (t) =>
          Math.min(
            1,
            SCROLL_EASING_CONSTANT - 2 ** (SCROLL_EASING_EXPONENT * t)
          ),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.6,
        infinite: false,
      });

      lenisRef.current = lenisInstance;
      setLenis(lenisInstance);

      let lastTime = 0;
      const targetFps = 60;
      const frameInterval = 1000 / targetFps;

      function raf(time: number) {
        // Throttle RAF to 60fps max to save battery
        if (time - lastTime >= frameInterval) {
          lenisRef.current?.raf(time);
          lastTime = time;
        }
        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);

      // Pause when tab is hidden
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
          }
        } else if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(raf);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      removeVisibilityListener = () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    };

    initLenis();

    return () => {
      mounted = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      setLenis(null);
      if (removeVisibilityListener) {
        removeVisibilityListener();
      }
    };
  }, [shouldEnableLenis]);

  return (
    <ScrollContext.Provider value={{ lenis, prefersReducedMotion }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useLenis = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useLenis must be used within a ScrollProvider");
  }
  return context.lenis;
};

// Hook to get reduced motion preference
export const useReducedMotion = () => {
  const { prefersReducedMotion } = useContext(ScrollContext);
  return prefersReducedMotion;
};
