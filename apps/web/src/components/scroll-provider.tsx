"use client";

import Lenis from "lenis";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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

function subscribeReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    let removeVisibilityListener: (() => void) | null = null;
    let cleanupEnableTriggers: (() => void) | null = null;
    let started = false;

    const syncLenis = (nextLenis: Lenis | null) => {
      lenisRef.current = nextLenis;
      setLenis((currentLenis) =>
        currentLenis === nextLenis ? currentLenis : nextLenis
      );
    };

    const destroyLenis = () => {
      lenisRef.current?.destroy();
      syncLenis(null);
    };

    const startLenis = () => {
      if (started || prefersReducedMotion) {
        return;
      }
      started = true;

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

      syncLenis(lenisInstance);

      let lastTime = 0;
      const targetFps = 60;
      const frameInterval = 1000 / targetFps;

      const raf = (time: number) => {
        if (time - lastTime >= frameInterval) {
          lenisRef.current?.raf(time);
          lastTime = time;
        }
        rafIdRef.current = requestAnimationFrame(raf);
      };

      rafIdRef.current = requestAnimationFrame(raf);

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

      cleanupEnableTriggers?.();
    };

    if (prefersReducedMotion) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      destroyLenis();
      return;
    }

    const interactionEvents: Array<keyof WindowEventMap> = [
      "wheel",
      "touchstart",
      "pointerdown",
      "keydown",
    ];

    const timeoutId = globalThis.setTimeout(
      startLenis,
      LENIS_FALLBACK_DELAY_MS
    );
    const requestIdle =
      "requestIdleCallback" in globalThis
        ? globalThis.requestIdleCallback.bind(globalThis)
        : null;
    const cancelIdle =
      "cancelIdleCallback" in globalThis
        ? globalThis.cancelIdleCallback.bind(globalThis)
        : null;
    let idleId: number | null = null;

    if (requestIdle && cancelIdle) {
      idleId = requestIdle(startLenis, { timeout: LENIS_IDLE_TIMEOUT_MS });
    }

    for (const eventName of interactionEvents) {
      window.addEventListener(eventName, startLenis, {
        once: true,
        passive: eventName !== "keydown",
      });
    }

    cleanupEnableTriggers = () => {
      globalThis.clearTimeout(timeoutId);
      if (idleId !== null && cancelIdle) {
        cancelIdle(idleId);
      }
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, startLenis);
      }
    };

    return () => {
      cleanupEnableTriggers?.();

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (removeVisibilityListener) {
        removeVisibilityListener();
      }

      destroyLenis();
    };
  }, [prefersReducedMotion]);

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
