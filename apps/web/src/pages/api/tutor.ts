import { tutorTextResponse } from "@andy-portfolio/ai-tutor";
import { PostgresBudgetStore } from "@andy-portfolio/ai-tutor/postgres-budget";
import type { APIRoute } from "astro";
import { z } from "zod";

import { getTutorEnv } from "@/lib/env";
import { SITE_COURSE } from "@/lib/tutor-course";
import { checkRateLimit, visitorId } from "@/lib/tutor-rate-limit";

export const prerender = false;

const MAX_MESSAGE_CHARS = 2000;

/** Tutor replies are capped at 1,500 output tokens; this leaves room for code-heavy answers. */
const MAX_REPLY_CHARS = 12_000;

/** The page sends its last 20 messages. */
const MAX_HISTORY_MESSAGES = 20;

/** Comfortably above 20 maximum-length messages; bigger bodies are refused. */
const MAX_BODY_BYTES = 512 * 1024;

/** Text-only chat history from the /ai page, ending with the student's turn. */
const requestSchema = z.strictObject({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.strictObject({
          content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
          role: z.literal("user"),
        }),
        z.strictObject({
          content: z.string().trim().min(1).max(MAX_REPLY_CHARS),
          role: z.literal("assistant"),
        }),
      ])
    )
    .min(1)
    .max(MAX_HISTORY_MESSAGES)
    .refine((messages) => messages.at(-1)?.role === "user", {
      message: "The last message must be the student's",
    }),
});

let budget: PostgresBudgetStore | undefined;

const plain = (status: number, message: string, headers: HeadersInit = {}) =>
  new Response(message, {
    headers: { "Content-Type": "text/plain; charset=utf-8", ...headers },
    status,
  });

/**
 * The body as text, or undefined once it passes MAX_BODY_BYTES (read no
 * further). A stream that fails mid-read comes back empty, so it fails
 * validation with the usual 400.
 */
const readCapped = async (request: Request): Promise<string | undefined> => {
  const declared = Number(request.headers.get("content-length") ?? 0);

  if (declared > MAX_BODY_BYTES || !request.body) {
    return declared > MAX_BODY_BYTES ? undefined : "";
  }

  const reader = request.body.getReader();
  // Raw chunks are collected and decoded once, so tiny chunks cost no copying.
  const chunks: Uint8Array[] = [];

  const pump = async (bytes: number): Promise<string | undefined> => {
    const chunk = await reader.read();

    if (chunk.done) {
      return Buffer.concat(chunks).toString("utf-8");
    }

    const total = bytes + chunk.value.byteLength;

    if (total > MAX_BODY_BYTES) {
      await reader.cancel();

      return undefined;
    }

    chunks.push(chunk.value);

    return pump(total);
  };

  try {
    return await pump(0);
  } catch {
    return "";
  }
};

/** The validated body; invalid JSON fails the same way as a wrong shape. */
const parseBody = (text: string) => {
  try {
    return requestSchema.safeParse(JSON.parse(text));
  } catch {
    return requestSchema.safeParse({});
  }
};

export const POST: APIRoute = async ({ clientAddress, request }) => {
  // Only the site's own page may call this (blocks other sites spending the caps).
  const origin = request.headers.get("origin");

  if (origin !== new URL(request.url).origin) {
    return plain(403, "Forbidden");
  }

  // Count every request (even malformed ones) before doing any parsing work.
  const env = getTutorEnv();
  budget ??= new PostgresBudgetStore(env.DATABASE_URL);

  const limit = await checkRateLimit(
    budget,
    visitorId(clientAddress, env.DATABASE_URL)
  );

  if (!limit.allowed) {
    return plain(
      429,
      `You're sending messages quickly. Try again in ${limit.retryAfterSeconds} seconds.`,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const body = await readCapped(request);

  if (body === undefined) {
    return plain(413, "That conversation is too long. Start a new chat.");
  }

  const parsed = parseBody(body);

  if (!parsed.success) {
    return plain(
      400,
      `Messages must be text, up to ${MAX_MESSAGE_CHARS} characters each.`
    );
  }

  return tutorTextResponse({
    budget,
    course: SITE_COURSE,
    messages: parsed.data.messages,
    signal: request.signal,
  });
};
