import { currentPeriod, DEFAULT_CAPS } from "@andy-portfolio/ai-tutor/budget";
import type { Provider } from "@andy-portfolio/ai-tutor/models";
import type { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import type { APIRoute } from "astro";
import { z } from "zod";

import { audioSeconds } from "@/lib/audio-duration";
import { getTutorEnv } from "@/lib/env";
import { plain, readCappedBytes } from "@/lib/read-capped";
import { checkRateLimit, visitorId } from "@/lib/tutor-rate-limit";
import { getTutorStore } from "@/lib/tutor-store";

export const prerender = false;

/**
 * Speech-to-text for the /ai orb. Gemini Flash-Lite on the Neon AI Gateway
 * transcribes clips for well under $0.001 a minute out of the Neon credit
 * (a 3 s question cost ~$0.00004 in testing). Whisper Large v3 Turbo on
 * OpenRouter (~$0.00018/min) is the last resort and needs OpenRouter credit.
 *
 * Every attempt reserves its worst-case cost against the same monthly
 * provider caps as the chat (DEFAULT_CAPS) before it runs, then settles to
 * the real cost, so no number of callers can spend past those caps.
 */
const NEON_MODELS = ["gemini-3-1-flash-lite", "gemini-3-5-flash-lite"];
const OPENROUTER_MODEL = "openai/whisper-large-v3-turbo";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/audio/transcriptions";

/**
 * Told "output nothing", Flash-Lite invented a sentence for 30 s of silence
 * in testing; an explicit marker is easier for it to follow, and is mapped
 * back to an empty transcript ("didn't catch any words").
 */
const NO_SPEECH = "[no speech]";

const INSTRUCTION = `Transcribe the speech in this audio exactly. Output only the words actually spoken, with normal punctuation. Never guess or invent words. If the audio is silent, is only noise, or has no clearly spoken words, output exactly ${NO_SPEECH} and nothing else.`;

/**
 * Whisper invents text for silence too. Its verbose output scores each
 * segment's chance of being non-speech; segments above this are dropped.
 */
const WHISPER_NO_SPEECH_THRESHOLD = 0.6;

/** The transcript, or empty when the model reported no speech. */
const cleanTranscript = (text: string) => {
  const trimmed = text.trim();

  // Only the bare marker (allowing a stray period) means silence; real speech
  // that happens to contain it is kept.
  return trimmed.toLowerCase().replace(/\.$/u, "") === NO_SPEECH ? "" : trimmed;
};

/** A stalled provider gives up after this, so the next fallback still gets a turn. */
const ATTEMPT_TIMEOUT_MS = 20_000;

/** About a minute of speech is ~200 words; this leaves room without paying for runaway output. */
const MAX_TRANSCRIPT_TOKENS = 400;

/**
 * Billing follows audio length, which a size cap can't bound (Opus sends
 * almost nothing during silence). The server reads the length from the file
 * (see audio-duration.ts) and refuses clips over this. The page stops at
 * 60 s; WebM's estimate can run ~33 s long, hence the margin.
 */
const MAX_CLIP_SECONDS = 120;

/**
 * When a format's length can't be read (MP4/AAC/MP3), reserve for the
 * longest audio one Gemini request accepts (~9.5 hours). Settlement then
 * records what was really billed.
 */
const UNKNOWN_LENGTH_SECONDS = 9.5 * 60 * 60;

/** Gemini bills about 32 tokens per second of audio. */
const AUDIO_TOKENS_PER_SECOND = 32;

/** USD per token, set at or above Gemini Flash-Lite list prices (audio input costs more than text). */
const GEMINI_AUDIO_USD = 1 / 1e6;
const GEMINI_TEXT_USD = 0.5 / 1e6;
const GEMINI_OUTPUT_USD = 2.5 / 1e6;

/** Whisper Turbo on its priciest OpenRouter host. */
const WHISPER_USD_PER_SECOND = 0.000011;

const neonWorstCaseUsd = (seconds: number) =>
  seconds * AUDIO_TOKENS_PER_SECOND * GEMINI_AUDIO_USD +
  500 * GEMINI_TEXT_USD +
  MAX_TRANSCRIPT_TOKENS * GEMINI_OUTPUT_USD;

const openrouterWorstCaseUsd = (seconds: number) =>
  seconds * WHISPER_USD_PER_SECOND;

/**
 * The page records at 32 kbps and stops at 60 s (~250 KB); 1 MB leaves room
 * for browsers that ignore the bitrate hint. Cost is bounded by duration,
 * not size: see MAX_CLIP_SECONDS.
 */
const MAX_AUDIO_BYTES = 1024 * 1024;

/** MediaRecorder container → OpenRouter `format`. */
const FORMATS = new Map([
  ["audio/aac", "aac"],
  ["audio/m4a", "m4a"],
  ["audio/mp4", "m4a"],
  ["audio/mpeg", "mp3"],
  ["audio/ogg", "ogg"],
  ["audio/wav", "wav"],
  ["audio/webm", "webm"],
  ["audio/x-m4a", "m4a"],
]);

const chatSchema = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string().nullable() }) }))
    .min(1),
  usage: z
    .object({
      audio_input_tokens: z.number().nonnegative().optional(),
      completion_tokens: z.number().nonnegative(),
      prompt_tokens: z.number().nonnegative(),
    })
    .optional(),
});

const whisperSchema = z.object({
  segments: z
    .array(
      z.object({
        no_speech_prob: z.number().optional(),
        text: z.string(),
      })
    )
    .optional(),
  text: z.string(),
  usage: z.object({ cost: z.number().nonnegative().optional() }).optional(),
});

/**
 * How a provider call ended. "notSent" (aborted before dispatch) and
 * "rejected" (a 4xx: the request was refused) are known to be unbilled;
 * anything else, including 5xx, may have been billed.
 */
type Outcome<T> =
  | { kind: "ok"; data: T }
  | { kind: "notSent" }
  | { kind: "rejected" }
  | { kind: "unknown" };

/** A transcription attempt: the text and its cost when the provider reported usage. */
type Attempt =
  | { kind: "ok"; text: string; costUsd: number | undefined }
  | { kind: "notSent" }
  | { kind: "rejected" }
  | { kind: "unknown" };

interface Clip {
  base64: string;
  /** Upper bound on how long the clip plays, for the cost reservation. */
  seconds: number;
  format: string;
  mime: string;
}

const UNAVAILABLE_TEXT =
  "Andy's AI couldn't connect just now. Try again in a moment.";

/** POSTs JSON; says whether it succeeded, was rejected (unbilled) or ended unknown. */
const postJson = async <T>({
  body,
  label,
  schema,
  signal,
  token,
  url,
}: {
  body: unknown;
  label: string;
  schema: z.ZodType<T>;
  signal: AbortSignal;
  token: string;
  url: string;
}): Promise<Outcome<T>> => {
  // The visitor left before this attempt started: nothing was sent.
  if (signal.aborted) {
    return { kind: "notSent" };
  }

  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: AbortSignal.any([
        signal,
        AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      ]),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(
        `[transcribe] ${label}: ${response.status} ${detail.slice(0, 200)}`
      );

      // A 4xx was refused up front; a 5xx may have failed after billing.
      return response.status < 500 ? { kind: "rejected" } : { kind: "unknown" };
    }

    const parsed = schema.safeParse(await response.json());

    return parsed.success
      ? { data: parsed.data, kind: "ok" }
      : { kind: "unknown" };
  } catch (error) {
    if (!signal.aborted) {
      console.error(`[transcribe] ${label} errored`, error);
    }

    return { kind: "unknown" };
  }
};

type Run = (clip: Clip, signal: AbortSignal) => Promise<Attempt>;

type Transcriber = (
  clip: Clip,
  signal: AbortSignal
) => Promise<string | undefined>;

/**
 * What to settle a reservation to: 0 when nothing was billed, the full
 * reported cost when known (even above the reservation, so the cap sees it),
 * otherwise the whole reservation.
 */
const settledCost = (attempt: Attempt, reservedUsd: number) => {
  if (attempt.kind === "rejected" || attempt.kind === "notSent") {
    return 0;
  }

  if (attempt.kind === "ok" && attempt.costUsd !== undefined) {
    return attempt.costUsd;
  }

  return reservedUsd;
};

/** Wraps a provider call in a reservation against that provider's monthly cap. */
const budgeted =
  ({
    onCapReached,
    provider,
    run,
    store,
    worstCaseUsd,
  }: {
    onCapReached: () => void;
    provider: Provider;
    run: Run;
    store: PostgresBudgetStore;
    worstCaseUsd: (seconds: number) => number;
  }): Transcriber =>
  async (clip, signal) => {
    if (signal.aborted) {
      return;
    }

    const period = currentPeriod();
    const reservedUsd = worstCaseUsd(clip.seconds);
    let reserved = false;

    try {
      reserved = await store.reserve(
        provider,
        period,
        reservedUsd,
        DEFAULT_CAPS[provider]
      );
    } catch (error) {
      console.error(`[transcribe] ${provider} budget unavailable`, error);

      return;
    }

    if (!reserved) {
      console.warn(`[transcribe] ${provider} monthly cap reached`);
      onCapReached();

      return;
    }

    const attempt = await run(clip, signal);

    try {
      await store.settle(
        provider,
        period,
        reservedUsd,
        settledCost(attempt, reservedUsd)
      );
    } catch (error) {
      // The full reservation stays counted, which errs on the safe side.
      console.error(`[transcribe] ${provider} settle failed`, error);
    }

    return attempt.kind === "ok" ? attempt.text : undefined;
  };

const neonRun =
  (model: string, baseUrl: string, token: string): Run =>
  async (clip, signal) => {
    const result = await postJson({
      body: {
        max_tokens: MAX_TRANSCRIPT_TOKENS,
        messages: [
          {
            content: [
              { text: INSTRUCTION, type: "text" },
              {
                audio_url: { url: `data:${clip.mime};base64,${clip.base64}` },
                type: "audio_url",
              },
            ],
            role: "user",
          },
        ],
        model,
        temperature: 0,
      },
      label: model,
      schema: chatSchema,
      signal,
      token,
      url: `${baseUrl.replace(/\/+$/u, "")}/v1/chat/completions`,
    });

    if (result.kind !== "ok") {
      return result;
    }

    const { usage } = result.data;
    const audioTokens = usage?.audio_input_tokens;

    // Without an audio token count the cost is unknown: keep the reservation.
    const costUsd =
      usage && audioTokens !== undefined
        ? audioTokens * GEMINI_AUDIO_USD +
          Math.max(0, usage.prompt_tokens - audioTokens) * GEMINI_TEXT_USD +
          usage.completion_tokens * GEMINI_OUTPUT_USD
        : undefined;

    return {
      costUsd,
      kind: "ok",
      text: cleanTranscript(result.data.choices[0]?.message.content ?? ""),
    };
  };

/** Whisper's transcript without segments it flags as likely non-speech. */
const whisperText = ({
  segments,
  text,
}: {
  segments?: { no_speech_prob?: number; text: string }[];
  text: string;
}) => {
  if (!segments) {
    return cleanTranscript(text);
  }

  return cleanTranscript(
    segments
      .flatMap((segment) =>
        (segment.no_speech_prob ?? 0) <= WHISPER_NO_SPEECH_THRESHOLD
          ? [segment.text.trim()]
          : []
      )
      .join(" ")
  );
};

const openrouterRun =
  (apiKey: string): Run =>
  async (clip, signal) => {
    const result = await postJson({
      body: {
        input_audio: { data: clip.base64, format: clip.format },
        model: OPENROUTER_MODEL,
        response_format: "verbose_json",
      },
      label: OPENROUTER_MODEL,
      schema: whisperSchema,
      signal,
      token: apiKey,
      url: OPENROUTER_URL,
    });

    if (result.kind !== "ok") {
      return result;
    }

    return {
      costUsd: result.data.usage?.cost,
      kind: "ok",
      text: whisperText(result.data),
    };
  };

export const POST: APIRoute = async ({ clientAddress, request }) => {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return plain(403, "Forbidden");
  }

  const env = getTutorEnv();
  const budget = getTutorStore(env.DATABASE_URL);

  // Counted separately from questions, with the same per-visitor limits.
  let limit: Awaited<ReturnType<typeof checkRateLimit>>;

  try {
    limit = await checkRateLimit(
      budget,
      `${visitorId(clientAddress, env.DATABASE_URL)}:stt`
    );
  } catch (error) {
    console.error("[transcribe] rate limit unavailable", error);

    return plain(503, UNAVAILABLE_TEXT);
  }

  if (!limit.allowed) {
    return plain(
      429,
      `You're recording quickly. Try again in ${limit.retryAfterSeconds} seconds.`,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const mime = (request.headers.get("content-type") ?? "")
    .split(";")[0]
    ?.trim()
    .toLowerCase();

  const format = mime ? FORMATS.get(mime) : undefined;

  if (!(mime && format)) {
    return plain(415, "That audio format isn't supported.");
  }

  const audio = await readCappedBytes(request, MAX_AUDIO_BYTES);

  if (audio === undefined) {
    return plain(413, "That recording is too long. Keep it under a minute.");
  }

  if (audio.byteLength === 0) {
    return plain(400, "No audio was received.");
  }

  let seconds: number | undefined;

  try {
    seconds = audioSeconds(audio, format);
  } catch {
    // A malformed header (e.g. a truncated WAV chunk) isn't playable audio.
    return plain(400, "That audio file couldn't be read.");
  }

  if (seconds !== undefined && seconds > MAX_CLIP_SECONDS) {
    return plain(413, "That recording is too long. Keep it under a minute.");
  }

  const clip: Clip = {
    base64: audio.toString("base64"),
    format,
    mime,
    seconds: seconds ?? UNKNOWN_LENGTH_SECONDS,
  };

  const store = budget;
  let capReached = false;

  const onCapReached = () => {
    capReached = true;
  };

  const transcribers: Transcriber[] = [
    ...NEON_MODELS.map((model) =>
      budgeted({
        onCapReached,
        provider: "neon",
        run: neonRun(
          model,
          env.NEON_AI_GATEWAY_BASE_URL,
          env.NEON_AI_GATEWAY_TOKEN
        ),
        store,
        worstCaseUsd: neonWorstCaseUsd,
      })
    ),
    budgeted({
      onCapReached,
      provider: "openrouter",
      run: openrouterRun(env.OPENROUTER_API_KEY),
      store,
      worstCaseUsd: openrouterWorstCaseUsd,
    }),
  ];

  const firstWorking = async (index: number): Promise<string | undefined> => {
    const transcribe = transcribers[index];

    // Stop trying (and reserving) once the visitor has gone.
    if (!transcribe || request.signal.aborted) {
      return undefined;
    }

    const text = await transcribe(clip, request.signal);

    return text ?? firstWorking(index + 1);
  };

  const text = await firstWorking(0);

  if (text === undefined && capReached) {
    return plain(
      503,
      "Voice is paused for now. Please type your question instead."
    );
  }

  if (text === undefined) {
    return plain(502, "Couldn't transcribe that. Try again, or type instead.");
  }

  return Response.json({ text });
};
