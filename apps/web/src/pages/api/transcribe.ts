import { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import type { APIRoute } from "astro";
import { z } from "zod";

import { getTutorEnv } from "@/lib/env";
import { checkRateLimit, visitorId } from "@/lib/tutor-rate-limit";

export const prerender = false;

/**
 * Speech-to-text for the /ai orb. Gemini Flash-Lite on the Neon AI Gateway
 * transcribes clips for well under $0.001 a minute out of the Neon credit
 * (a 3 s question cost ~$0.00004 in testing). Whisper Large v3 Turbo on
 * OpenRouter (~$0.00018/min) is the last resort and needs OpenRouter credit.
 */
const NEON_MODELS = ["gemini-3-1-flash-lite", "gemini-3-5-flash-lite"];
const OPENROUTER_MODEL = "openai/whisper-large-v3-turbo";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/audio/transcriptions";

const INSTRUCTION =
  "Transcribe the speech in this audio exactly. Output only the words spoken, with normal punctuation. If there is no speech, output nothing.";

/** About a minute of speech is ~200 words; this leaves room without paying for runaway output. */
const MAX_TRANSCRIPT_TOKENS = 400;

/** The page stops recording at 60 s; 4 MB covers that in any browser codec. */
const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

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
});

const whisperSchema = z.object({ text: z.string() });

interface Clip {
  base64: string;
  format: string;
  mime: string;
}

const UNAVAILABLE_TEXT =
  "Andy's AI couldn't connect just now. Try again in a moment.";

let budget: PostgresBudgetStore | undefined;

const plain = (status: number, message: string, headers: HeadersInit = {}) =>
  new Response(message, {
    headers: { "Content-Type": "text/plain; charset=utf-8", ...headers },
    status,
  });

/** The audio bytes, or undefined once they pass MAX_AUDIO_BYTES. */
const readAudio = async (request: Request): Promise<Buffer | undefined> => {
  const declared = Number(request.headers.get("content-length") ?? 0);

  if (declared > MAX_AUDIO_BYTES || !request.body) {
    return declared > MAX_AUDIO_BYTES ? undefined : Buffer.alloc(0);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];

  const pump = async (bytes: number): Promise<Buffer | undefined> => {
    const chunk = await reader.read();

    if (chunk.done) {
      return Buffer.concat(chunks);
    }

    const total = bytes + chunk.value.byteLength;

    if (total > MAX_AUDIO_BYTES) {
      await reader.cancel();

      return undefined;
    }

    chunks.push(chunk.value);

    return pump(total);
  };

  try {
    return await pump(0);
  } catch {
    return Buffer.alloc(0);
  }
};

/** POSTs JSON and returns the parsed body, or undefined (logged) on any failure. */
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
}): Promise<T | undefined> => {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal,
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(
        `[transcribe] ${label}: ${response.status} ${detail.slice(0, 200)}`
      );

      return undefined;
    }

    const parsed = schema.safeParse(await response.json());

    return parsed.success ? parsed.data : undefined;
  } catch (error) {
    if (!signal.aborted) {
      console.error(`[transcribe] ${label} errored`, error);
    }

    return undefined;
  }
};

type Transcriber = (
  clip: Clip,
  signal: AbortSignal
) => Promise<string | undefined>;

const neonTranscriber =
  (model: string, baseUrl: string, token: string): Transcriber =>
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

    return result?.choices[0]?.message.content?.trim();
  };

const openrouterTranscriber =
  (apiKey: string): Transcriber =>
  async (clip, signal) => {
    const result = await postJson({
      body: {
        input_audio: { data: clip.base64, format: clip.format },
        model: OPENROUTER_MODEL,
      },
      label: OPENROUTER_MODEL,
      schema: whisperSchema,
      signal,
      token: apiKey,
      url: OPENROUTER_URL,
    });

    return result?.text.trim();
  };

export const POST: APIRoute = async ({ clientAddress, request }) => {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return plain(403, "Forbidden");
  }

  const env = getTutorEnv();
  budget ??= new PostgresBudgetStore(env.DATABASE_URL);

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

  const audio = await readAudio(request);

  if (audio === undefined) {
    return plain(413, "That recording is too long. Keep it under a minute.");
  }

  if (audio.byteLength === 0) {
    return plain(400, "No audio was received.");
  }

  const clip: Clip = { base64: audio.toString("base64"), format, mime };

  const transcribers: Transcriber[] = [
    ...NEON_MODELS.map((model) =>
      neonTranscriber(
        model,
        env.NEON_AI_GATEWAY_BASE_URL,
        env.NEON_AI_GATEWAY_TOKEN
      )
    ),
    openrouterTranscriber(env.OPENROUTER_API_KEY),
  ];

  const firstWorking = async (index: number): Promise<string | undefined> => {
    const transcribe = transcribers[index];

    if (!transcribe) {
      return undefined;
    }

    const text = await transcribe(clip, request.signal);

    return text ?? firstWorking(index + 1);
  };

  const text = await firstWorking(0);

  if (text === undefined) {
    return plain(502, "Couldn't transcribe that. Try again, or type instead.");
  }

  return Response.json({ text });
};
