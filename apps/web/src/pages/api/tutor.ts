import { tutorTextResponse } from "@andy-portfolio/ai-tutor";
import type { APIRoute } from "astro";
import { z } from "zod";

import { getTutorEnv } from "@/lib/env";
import { plain, readCapped } from "@/lib/read-capped";
import { SITE_COURSE } from "@/lib/tutor-course";
import { chatMessageSchema, MAX_MESSAGE_CHARS } from "@/lib/tutor-messages";
import { checkRateLimit, visitorId } from "@/lib/tutor-rate-limit";
import { recordingReply } from "@/lib/tutor-share";
import { getTutorStore } from "@/lib/tutor-store";

export const prerender = false;

/** The page sends its last 20 messages. */
const MAX_HISTORY_MESSAGES = 20;

/** Comfortably above 20 maximum-length messages; bigger bodies are refused. */
const MAX_BODY_BYTES = 512 * 1024;

/** Text-only chat history from the /ai page, ending with the student's turn. */
const requestSchema = z.strictObject({
  messages: z
    .array(chatMessageSchema)
    .min(1)
    .max(MAX_HISTORY_MESSAGES)
    .refine((messages) => messages.at(-1)?.role === "user", {
      message: "The last message must be the student's",
    }),
});

const UNAVAILABLE_TEXT =
  "Andy's AI couldn't connect just now. Try again in a moment.";

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
  const budget = getTutorStore(env.DATABASE_URL);

  let limit: Awaited<ReturnType<typeof checkRateLimit>>;

  try {
    limit = await checkRateLimit(
      budget,
      visitorId(clientAddress, env.DATABASE_URL)
    );
  } catch (error) {
    console.error("[tutor] rate limit unavailable", error);

    return plain(503, UNAVAILABLE_TEXT);
  }

  if (!limit.allowed) {
    return plain(
      429,
      `You're sending messages quickly. Try again in ${limit.retryAfterSeconds} seconds.`,
      { "Retry-After": String(limit.retryAfterSeconds) }
    );
  }

  const body = await readCapped(request, MAX_BODY_BYTES);

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

  try {
    const { messages } = parsed.data;

    // The finished reply is fingerprinted so the visitor can share it later.
    return recordingReply(
      tutorTextResponse({
        budget,
        course: SITE_COURSE,
        messages,
        signal: request.signal,
      }),
      budget,
      messages.at(-1)?.content ?? ""
    );
  } catch (error) {
    console.error("[tutor] failed before streaming", error);

    return plain(503, UNAVAILABLE_TEXT);
  }
};
