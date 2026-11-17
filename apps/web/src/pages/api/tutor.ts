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
const MAX_HISTORY_MESSAGES = 40;

/** Text-only chat history from the /ai page, ending with the student's turn. */
const requestSchema = z.object({
  messages: z
    .array(
      z.discriminatedUnion("role", [
        z.object({
          content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
          role: z.literal("user"),
        }),
        z.object({
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

/** The validated body; invalid JSON fails the same way as a wrong shape. */
const parseBody = async (request: Request) => {
  try {
    return requestSchema.safeParse(await request.json());
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

  const parsed = await parseBody(request);

  if (!parsed.success) {
    return plain(
      400,
      `Messages must be text, up to ${MAX_MESSAGE_CHARS} characters each.`
    );
  }

  const env = getTutorEnv();
  budget ??= new PostgresBudgetStore(env.DATABASE_URL);

  const limit = await checkRateLimit(budget, visitorId(clientAddress));

  if (!limit.allowed) {
    return plain(
      429,
      `You're sending messages quickly. Try again in ${limit.retryAfterSeconds} seconds.`,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  return tutorTextResponse({
    budget,
    course: SITE_COURSE,
    messages: parsed.data.messages,
    signal: request.signal,
  });
};
