"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Chrome-based browsers send audio to Google's speech service. Builds without
 * it (Brave, Electron apps, some Chromium forks) fail every session with a
 * "network" error even when online, so dictation is switched off for the visit.
 */
const UNAVAILABLE_MESSAGE =
  "Dictation doesn't work in this browser. Type instead, or try Chrome, Edge or Safari.";

const BLOCKED_MESSAGE =
  "Microphone access is blocked. Allow it in your browser to talk.";

/** A message worth showing for a recognition error; silence and aborts are ignored. */
const errorMessage = (code: string): string | undefined => {
  switch (code) {
    case "audio-capture": {
      return "No microphone was found.";
    }

    case "network": {
      return UNAVAILABLE_MESSAGE;
    }

    case "not-allowed":
    case "service-not-allowed": {
      return BLOCKED_MESSAGE;
    }

    default: {
      return undefined;
    }
  }
};

const recognitionConstructor = () =>
  typeof window === "undefined"
    ? undefined
    : (window.SpeechRecognition ?? window.webkitSpeechRecognition);

// Support only changes if the page is restored from the back/forward cache.
const subscribeToSupport = (onChange: () => void) => {
  window.addEventListener("pageshow", onChange);

  return () => window.removeEventListener("pageshow", onChange);
};

const isSupported = () => recognitionConstructor() !== undefined;
const isSupportedOnServer = () => false;

/** Root-mean-square loudness of one analyser frame, scaled to roughly 0..1. */
const loudness = (samples: Uint8Array<ArrayBuffer>): number => {
  let sum = 0;

  for (const sample of samples) {
    const centered = (sample - 128) / 128;
    sum += centered * centered;
  }

  return Math.min(1, Math.sqrt(sum / samples.length) * 4);
};

interface DictationCallbacks {
  /** The full transcript so far for this session (final + in-progress words). */
  onTranscript: (text: string) => void;
  /** Mic loudness from 0 to 1, once per animation frame while listening. */
  onLevel?: (level: number) => void;
}

/**
 * Browser dictation (Web Speech API): words appear live while the student
 * talks. Free and built into Chrome, Edge and Safari; `supported` is false in
 * browsers without it (Firefox), so the mic can be hidden there.
 */
export const useDictation = (callbacks: DictationCallbacks) => {
  const browserSupport = useSyncExternalStore(
    subscribeToSupport,
    isSupported,
    isSupportedOnServer
  );

  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [unavailable, setUnavailable] = useState(false);
  const supported = browserSupport && !unavailable;

  const recognition = useRef<SpeechRecognition>(null);
  const stopMeterRef = useRef<() => Promise<void>>(null);
  /** Removes the current recognition session's listeners. */
  const listeners = useRef<AbortController>(null);
  const latest = useRef(callbacks);

  useEffect(() => {
    latest.current = callbacks;
  });

  const stopMeter = () => {
    stopMeterRef.current?.();
    stopMeterRef.current = null;
    latest.current.onLevel?.(0);
  };

  /** Mic level for the orb. Optional: dictation still works if this fails. */
  const startMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      context.createMediaStreamSource(stream).connect(analyser);

      const samples = new Uint8Array(analyser.fftSize);
      let frame = 0;

      const tick = () => {
        analyser.getByteTimeDomainData(samples);
        latest.current.onLevel?.(loudness(samples));
        frame = requestAnimationFrame(tick);
      };

      tick();

      stopMeterRef.current = async () => {
        cancelAnimationFrame(frame);

        for (const track of stream.getTracks()) {
          track.stop();
        }

        try {
          await context.close();
        } catch {
          // Already closed.
        }
      };
    } catch {
      // No level meter (permission or device); the orb still shows "listening".
    }
  };

  const stop = () => {
    recognition.current?.stop();
  };

  const start = () => {
    const Recognition = recognitionConstructor();

    if (!Recognition || recognition.current) {
      return;
    }

    const instance = new Recognition();
    instance.continuous = true;
    instance.interimResults = true;
    instance.lang = navigator.language || "en-US";

    listeners.current = new AbortController();

    instance.addEventListener(
      "result",
      (event) => {
        let text = "";

        for (const result of event.results) {
          text += result[0]?.transcript ?? "";
        }

        latest.current.onTranscript(text.trim());
      },
      { signal: listeners.current.signal }
    );

    instance.addEventListener(
      "error",
      (event) => {
        const message = errorMessage(event.error);

        if (event.error === "network") {
          setUnavailable(true);
        }

        if (message) {
          setError(message);
        }
      },
      { signal: listeners.current.signal }
    );

    instance.addEventListener(
      "end",
      () => {
        listeners.current?.abort();
        recognition.current = null;
        setListening(false);
        stopMeter();
      },
      { signal: listeners.current.signal }
    );

    setError(undefined);
    recognition.current = instance;
    instance.start();
    setListening(true);
    startMeter();
  };

  const toggle = () => {
    if (recognition.current) {
      stop();
    } else {
      start();
    }
  };

  useEffect(
    () => () => {
      listeners.current?.abort();
      recognition.current?.abort();
      stopMeterRef.current?.();
    },
    []
  );

  return { error, listening, start, stop, supported, toggle };
};
