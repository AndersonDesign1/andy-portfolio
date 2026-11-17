"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { object, string } from "zod/mini";

import { failureText } from "@/components/ai/chat-stream";

/** Recording stops on its own here; Gemini bills ~32 audio tokens a second. */
const MAX_RECORDING_MS = 60_000;

/** Plenty for speech; keeps a full minute under ~250 KB so the server's size cap stays tight. */
const AUDIO_BITS_PER_SECOND = 32_000;

/** Shorter than this is a tap, not speech; nothing is sent. */
const MIN_RECORDING_MS = 400;

/** First the recorder supports wins: Chrome/Edge/Firefox take WebM, Safari MP4. */
const MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

const RECORDING_FAILED_MESSAGE =
  "Recording didn't work. Try again, or type your question instead.";

const BLOCKED_MESSAGE =
  "Microphone access is blocked. Allow it in your browser to talk.";

const transcriptSchema = object({ text: string() });

/** A getUserMedia failure (by DOMException name) as a message for the student. */
const micErrorMessage = (name: string): string => {
  if (name === "NotAllowedError" || name === "SecurityError") {
    return BLOCKED_MESSAGE;
  }

  if (name === "NotFoundError") {
    return "No microphone was found.";
  }

  return "Couldn't start the microphone. Type your question instead.";
};

// Support only changes if the page is restored from the back/forward cache.
const subscribeToSupport = (onChange: () => void) => {
  window.addEventListener("pageshow", onChange);

  return () => window.removeEventListener("pageshow", onChange);
};

const isSupported = () =>
  "MediaRecorder" in window && "mediaDevices" in navigator;

const isSupportedOnServer = () => false;

const pickMimeType = () =>
  MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";

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
  /** The transcript of one recording, once the server returns it. */
  onTranscript: (text: string) => void;
  /** Mic loudness from 0 to 1, once per animation frame while recording. */
  onLevel?: (level: number) => void;
}

/**
 * Voice input that works in every modern browser: record with MediaRecorder,
 * then transcribe the clip on the server (/api/transcribe). Recording stops
 * on release (or at one minute); `transcribing` covers the wait for text.
 */
export const useDictation = (callbacks: DictationCallbacks) => {
  const supported = useSyncExternalStore(
    subscribeToSupport,
    isSupported,
    isSupportedOnServer
  );

  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  /** When the current recording started (ms since epoch); 0 when not recording. */
  const [recordingSince, setRecordingSince] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  /** Bumped on every start and cancel; late results from an old session are dropped. */
  const session = useRef(0);
  const recorder = useRef<MediaRecorder>(null);
  /** Stops the mic, level meter and auto-stop timer for the current recording. */
  const release = useRef<() => void>(null);
  /** Removes the current recorder's listeners. */
  const listeners = useRef<AbortController>(null);
  /** Cancels an in-flight transcription request. */
  const upload = useRef<AbortController>(null);
  const latest = useRef(callbacks);

  useEffect(() => {
    latest.current = callbacks;
  });

  const releaseMic = () => {
    release.current?.();
    release.current = null;
    latest.current.onLevel?.(0);
  };

  const transcribe = async (clip: Blob, id: number) => {
    const controller = new AbortController();
    upload.current = controller;
    setTranscribing(true);

    try {
      const response = await fetch("/api/transcribe", {
        body: clip,
        headers: { "Content-Type": clip.type.split(";")[0] ?? "audio/webm" },
        method: "POST",
        signal: controller.signal,
      });

      if (id !== session.current) {
        return;
      }

      if (!response.ok) {
        setErrorMessage(await failureText(response));

        return;
      }

      // zod/mini keeps this island small; the response only needs one field.
      const parsed = transcriptSchema.safeParse(await response.json());
      const text = parsed.success ? parsed.data.text.trim() : "";

      if (id !== session.current) {
        return;
      }

      if (text) {
        latest.current.onTranscript(text);
      } else {
        setErrorMessage("Didn't catch any words. Try again a little closer.");
      }
    } catch {
      if (!controller.signal.aborted && id === session.current) {
        setErrorMessage("Couldn't reach the server. Check your connection.");
      }
    } finally {
      if (upload.current === controller) {
        upload.current = null;
        setTranscribing(false);
      }
    }
  };

  /** Mic level for the orb; optional, so a failure here never stops recording. */
  const startMeter = (stream: MediaStream) => {
    try {
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

      return async () => {
        cancelAnimationFrame(frame);

        try {
          await context.close();
        } catch {
          // Already closed.
        }
      };
    } catch {
      // No meter (e.g. AudioContext blocked); recording carries on without it.
      return () => Promise.resolve();
    }
  };

  const start = async () => {
    if (recorder.current || listening) {
      return;
    }

    session.current += 1;
    const id = session.current;
    upload.current?.abort();
    setErrorMessage(undefined);
    setListening(true);

    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      if (id === session.current) {
        setErrorMessage(
          micErrorMessage(error instanceof DOMException ? error.name : "")
        );
        setListening(false);
        setRecordingSince(0);
      }

      return;
    }

    // Released (or cancelled) while the permission prompt was open.
    if (id !== session.current) {
      stopTracks(stream);

      return;
    }

    const failSetup = () => {
      stopTracks(stream);
      setListening(false);
      setRecordingSince(0);
      setErrorMessage(RECORDING_FAILED_MESSAGE);
    };

    const mimeType = pickMimeType();
    let instance: MediaRecorder;

    try {
      const options: MediaRecorderOptions = {
        audioBitsPerSecond: AUDIO_BITS_PER_SECOND,
      };

      if (mimeType) {
        options.mimeType = mimeType;
      }

      instance = new MediaRecorder(stream, options);
    } catch {
      failSetup();

      return;
    }

    const chunks: Blob[] = [];
    const startedAt = performance.now();

    listeners.current = new AbortController();

    instance.addEventListener(
      "dataavailable",
      (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      },
      { signal: listeners.current.signal }
    );

    // A mid-recording failure drops the clip (it may be partial) and says so;
    // the "stop" that follows only releases the mic.
    instance.addEventListener(
      "error",
      () => {
        if (id === session.current) {
          session.current += 1;
          setErrorMessage(RECORDING_FAILED_MESSAGE);
        }
      },
      { signal: listeners.current.signal }
    );

    instance.addEventListener(
      "stop",
      () => {
        listeners.current?.abort();
        listeners.current = null;
        recorder.current = null;
        releaseMic();
        setListening(false);
        setRecordingSince(0);

        const long = performance.now() - startedAt >= MIN_RECORDING_MS;

        if (id === session.current && long && chunks.length > 0) {
          const clip = new Blob(chunks, {
            type: instance.mimeType || mimeType || "audio/webm",
          });

          transcribe(clip, id);
        } else if (id === session.current && !long) {
          setErrorMessage("Hold the orb (or the mic) while you talk.");
        }
      },
      { signal: listeners.current.signal }
    );

    const stopMeter = startMeter(stream);

    const autoStop = setTimeout(() => {
      if (instance.state === "recording") {
        instance.stop();
      }
    }, MAX_RECORDING_MS);

    release.current = () => {
      clearTimeout(autoStop);
      stopMeter();
      stopTracks(stream);
    };

    try {
      instance.start();
    } catch {
      listeners.current?.abort();
      listeners.current = null;
      release.current();
      release.current = null;
      failSetup();

      return;
    }

    recorder.current = instance;
    setRecordingSince(Date.now());
  };

  const stop = () => {
    const instance = recorder.current;

    if (instance?.state === "recording") {
      instance.stop();

      return;
    }

    // Released before the mic was ready: drop the pending start.
    if (listening) {
      session.current += 1;
      setListening(false);
      setRecordingSince(0);
    }
  };

  /** Ends everything now and drops any pending text (after send or reset). */
  const cancel = () => {
    session.current += 1;
    upload.current?.abort();
    upload.current = null;
    setTranscribing(false);

    if (recorder.current?.state === "recording") {
      recorder.current.stop();
    } else {
      releaseMic();
      setListening(false);
      setRecordingSince(0);
    }
  };

  const toggle = () => {
    if (listening) {
      stop();
    } else {
      start();
    }
  };

  useEffect(
    () => () => {
      session.current += 1;
      upload.current?.abort();
      listeners.current?.abort();

      if (recorder.current?.state === "recording") {
        recorder.current.stop();
      }

      release.current?.();
    },
    []
  );

  return {
    cancel,
    error: errorMessage,
    listening,
    recordingSince,
    start,
    stop,
    supported,
    toggle,
    transcribing,
  };
};
