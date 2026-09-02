import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = ({ request }) => {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;
  if (!expectedSecret) {
    return new Response("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  const providedSecret = request.headers.get("x-sanity-webhook-secret");
  if (providedSecret !== expectedSecret) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  // Live Astro blog content is MDX in git (Graft). Freshness is git push →
  // Vercel rebuild, not this webhook. Kept so an existing Sanity webhook
  // still authenticates until it is disconnected.
  return Response.json({ mode: "rebuild-hook", revalidated: true });
};
