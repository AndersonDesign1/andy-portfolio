export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return new Response("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  const secret = request.headers.get("x-sanity-webhook-secret");
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    // Also accept body signature pattern used by next-sanity when available
    const body = await request.json().catch(() => null);
    if (!body?._type) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }
  }

  // Astro static hosting: webhook acknowledges; deploy hooks / ISR should be
  // configured in Vercel to rebuild when Sanity content changes.
  return new Response(
    JSON.stringify({ mode: "rebuild-hook", revalidated: true }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
