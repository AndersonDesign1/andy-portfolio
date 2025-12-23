"use client";

import Lenis from "lenis";
import type React from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import {
  SCROLL_DURATION,
  SCROLL_EASING_CONSTANT,
  SCROLL_EASING_EXPONENT,
} from "@/lib/constants";

type ScrollContextType = {
  lenis: Lenis | null;
};

const ScrollContext = createContext<ScrollContextType>({ lenis: null });

type ScrollProviderProps = {
  children: React.ReactNode;
};

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Always initialize Lenis, but use CSS media queries to control behavior
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

    // RAF loop for smooth animations
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </ScrollContext.Provider>
  );
}

// Hook to access Lenis instance
export const useLenis = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useLenis must be used within a ScrollProvider");
  }
  return context.lenis;
};
