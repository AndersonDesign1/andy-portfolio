/**
 * Minimal Web Speech API types for browser dictation on /ai.
 * TypeScript's DOM lib doesn't ship SpeechRecognition yet; Chrome and Edge
 * expose it as `webkitSpeechRecognition`, Safari as both.
 */

interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognitionEventMap {
  end: Event;
  error: SpeechRecognitionErrorEvent;
  result: SpeechRecognitionEvent;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  abort: () => void;
  start: () => void;
  stop: () => void;
  addEventListener: <K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (event: SpeechRecognitionEventMap[K]) => void,
    options?: { signal?: AbortSignal }
  ) => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

interface Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}
