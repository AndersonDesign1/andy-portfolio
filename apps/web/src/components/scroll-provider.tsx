"use client";

import Lenis from "lenis";
import type React from "react";
import {
  createContext,
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
const LENIS_START_EVENTS: (keyof WindowEventMap)[] = [
  "wheel",
  "touchstart",
  "pointerdown",
  "keydown",
];

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

const subscribeReducedMotion = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getReducedMotionServerSnapshot = () => false;

const createScrollContextValue = (
  lenis: Lenis | null,
  prefersReducedMotion: boolean
): ScrollContextType => ({ lenis, prefersReducedMotion });

const subscribeLenisStart = (
  startLenis: () => void,
  handleVisibilityChange: () => void
) => {
  for (const eventName of LENIS_START_EVENTS) {
    window.addEventListener(eventName, startLenis, {
      once: true,
      passive: eventName !== "keydown",
    });
  }
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    for (const eventName of LENIS_START_EVENTS) {
      window.removeEventListener(eventName, startLenis);
    }
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};

const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    let started = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;
    let removeStartListeners: (() => void) | null = null;
    const requestIdle =
      "requestIdleCallback" in globalThis
        ? globalThis.requestIdleCallback.bind(globalThis)
        : null;
    const cancelIdle =
      "cancelIdleCallback" in globalThis
        ? globalThis.cancelIdleCallback.bind(globalThis)
        : null;

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

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    const startLenis = () => {
      if (started || prefersReducedMotion) {
        return;
      }
      started = true;

      const lenisInstance = new Lenis({
        duration: SCROLL_DURATION,
        easing: (t) =>
          Math.min(
            1,
            SCROLL_EASING_CONSTANT - 2 ** (SCROLL_EASING_EXPONENT * t)
          ),
        gestureOrientation: "vertical",
        infinite: false,
        orientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 1.6,
        wheelMultiplier: 1,
      });

      syncLenis(lenisInstance);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      } else if (started && !rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(raf);
      }
    };

    if (prefersReducedMotion) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      destroyLenis();
    } else {
      timeoutId = globalThis.setTimeout(startLenis, LENIS_FALLBACK_DELAY_MS);
      if (requestIdle && cancelIdle) {
        idleId = requestIdle(startLenis, { timeout: LENIS_IDLE_TIMEOUT_MS });
      }
      removeStartListeners = subscribeLenisStart(
        startLenis,
        handleVisibilityChange
      );
    }

    return () => {
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
      if (idleId !== null && cancelIdle) {
        cancelIdle(idleId);
      }
      removeStartListeners?.();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      destroyLenis();
    };
  }, [prefersReducedMotion]);

  const contextValue = createScrollContextValue(lenis, prefersReducedMotion);

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
};

export default ScrollProvider;
