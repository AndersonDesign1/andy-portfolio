"use client";

import Lenis from "lenis";
import type React from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import {
  SCROLL_DURATION,
  SCROLL_EASING_CONSTANT,
  SCROLL_EASING_EXPONENT,
} from "@/lib/constants";

interface ScrollContextType {
  lenis: Lenis | null;
}

const ScrollContext = createContext<ScrollContextType>({ lenis: null });

interface ScrollProviderProps {
  children: React.ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
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

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

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

export const useLenis = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useLenis must be used within a ScrollProvider");
  }
  return context.lenis;
};
