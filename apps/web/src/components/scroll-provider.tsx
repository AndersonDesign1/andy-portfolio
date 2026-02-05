"use client";

import Lenis from "lenis";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  SCROLL_DURATION,
  SCROLL_EASING_CONSTANT,
  SCROLL_EASING_EXPONENT,
} from "@/lib/constants";

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  // Initialize Lenis
  useEffect(() => {
    // Skip Lenis if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    lenisRef.current = new Lenis({
      duration: SCROLL_DURATION,
      easing: (t) =>
        Math.min(1, SCROLL_EASING_CONSTANT - 2 ** (SCROLL_EASING_EXPONENT * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

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

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  return (
    <ScrollContext.Provider
      value={{ lenis: lenisRef.current, prefersReducedMotion }}
    >
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
