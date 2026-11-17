"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Chrome-based browsers send audio to Google's speech service. Builds without
 * it (Brave, Electron apps, some Chromium forks) fail every session with a
 * "network" error even when online. One failure may just be a blip, so the mic
 * stays; a second in a row (with no words heard between) turns it off.
 */
const NETWORK_RETRY_MESSAGE =
  "Dictation couldn't reach the speech service. Tap the mic to try again.";

const NETWORK_FAILURES_BEFORE_OFF = 2;

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
      return NETWORK_RETRY_MESSAGE;
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

const stopTracks = (stream: MediaStream) => {
  for (const track of stream.getTracks()) {
    track.stop();
  }
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
  /** Bumped whenever the meter stops, so a mic grant that lands late is released. */
  const meterSession = useRef(0);
  /** Consecutive "network" failures; reset whenever words come through. */
  const networkFailures = useRef(0);
  const latest = useRef(callbacks);

  useEffect(() => {
    latest.current = callbacks;
  });

  const stopMeter = () => {
    meterSession.current += 1;
    stopMeterRef.current?.();
    stopMeterRef.current = null;
    latest.current.onLevel?.(0);
  };

  /** Mic level for the orb. Optional: dictation still works if this fails. */
  const startMeter = async () => {
    const session = meterSession.current;
    let stream: MediaStream | undefined;
    let context: AudioContext | undefined;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Dictation ended (or the page unmounted) while permission was pending.
      if (session !== meterSession.current) {
        stopTracks(stream);

        return;
      }

      context = new AudioContext();
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

      const active = stream;
      const activeContext = context;

      stopMeterRef.current = async () => {
        cancelAnimationFrame(frame);
        stopTracks(active);

        try {
          await activeContext.close();
        } catch {
          // Already closed.
        }
      };
    } catch {
      // No level meter (permission or device); the orb still shows "listening".
      if (stream) {
        stopTracks(stream);
      }

      try {
        await context?.close();
      } catch {
        // Never opened, or already closed.
      }
    }
  };

  const stop = () => {
    recognition.current?.stop();
  };

  /** Ends the session now and drops any words still arriving (after send or reset). */
  const cancel = () => {
    listeners.current?.abort();
    listeners.current = null;
    recognition.current?.abort();
    recognition.current = null;
    setListening(false);
    stopMeter();
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

        networkFailures.current = 0;
        latest.current.onTranscript(text.trim());
      },
      { signal: listeners.current.signal }
    );

    instance.addEventListener(
      "error",
      (event) => {
        let message = errorMessage(event.error);

        if (event.error === "network") {
          networkFailures.current += 1;

          if (networkFailures.current >= NETWORK_FAILURES_BEFORE_OFF) {
            setUnavailable(true);
            message = UNAVAILABLE_MESSAGE;
          }
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
      meterSession.current += 1;
      listeners.current?.abort();
      recognition.current?.abort();
      stopMeterRef.current?.();
    },
    []
  );

  return { cancel, error, listening, start, stop, supported, toggle };
};
