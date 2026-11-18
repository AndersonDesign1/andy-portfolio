import type { APIRoute } from "astro";

import { getDatabaseEnv } from "@/lib/env";
import { plain, readCapped } from "@/lib/read-capped";
import { checkRateLimit, visitorId } from "@/lib/tutor-rate-limit";
import {
  createShare,
  SHARE_TTL_HOURS,
  shareRequestSchema,
  verifiedPairs,
} from "@/lib/tutor-share";
import { getTutorStore } from "@/lib/tutor-store";

export const prerender = false;

/**
 * 40 maximum-length messages is about 280k UTF-16 units, so up to ~840 KB
 * as UTF-8 before JSON escaping; 2 MB leaves room for escapes.
 */
const MAX_BODY_BYTES = 2 * 1024 * 1024;

const UNAVAILABLE_TEXT = "Couldn't create a link just now. Try again.";

const parseBody = (text: string) => {
  try {
    return shareRequestSchema.safeParse(JSON.parse(text));
  } catch {
    return shareRequestSchema.safeParse({});
  }
};

/**
 * Turns the visitor's chat into a read-only link that lasts 24 hours.
 * Only answers the tutor really sent are kept (see `verifiedPairs`).
 */
export const POST: APIRoute = async ({ clientAddress, request }) => {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return plain(403, "Forbidden");
  }

  let store: ReturnType<typeof getTutorStore>;
  let databaseUrl: string;

  try {
    databaseUrl = getDatabaseEnv().DATABASE_URL;
    store = getTutorStore(databaseUrl);
  } catch (error) {
    console.error("[share] database not configured", error);

    return plain(503, UNAVAILABLE_TEXT);
  }

  try {
    const limit = await checkRateLimit(
      store,
      visitorId(clientAddress, databaseUrl)
    );

    if (!limit.allowed) {
      return plain(
        429,
        `Too many requests. Try again in ${limit.retryAfterSeconds} seconds.`,
        { "Retry-After": String(limit.retryAfterSeconds) }
      );
    }
  } catch (error) {
    console.error("[share] rate limit unavailable", error);

    return plain(503, UNAVAILABLE_TEXT);
  }

  const body = await readCapped(request, MAX_BODY_BYTES);

  if (body === undefined) {
    return plain(413, "That chat is too long to share.");
  }

  const parsed = parseBody(body);

  if (!parsed.success) {
    return plain(400, "There's nothing to share yet.");
  }

  try {
    const messages = await verifiedPairs(store, parsed.data.messages);

    if (messages.length === 0) {
      return plain(
        422,
        "Only answers from Andy's AI can be shared. Ask again and share the new answer."
      );
    }

    const id = await createShare(store, messages);

    return Response.json(
      {
        expiresInHours: SHARE_TTL_HOURS,
        url: new URL(`/ai/s/${id}`, request.url).toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[share] failed", error);

    return plain(503, UNAVAILABLE_TEXT);
  }
};
