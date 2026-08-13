import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Compatibility shim for Spotify redirect URIs registered as `/callback`
 * (common during the Next.js era). Forwards to the Astro callback route.
 */
export const GET: APIRoute = ({ url }) => {
  const target = new URL("/api/spotify/callback", url.origin);
  target.search = url.search;
  return Response.redirect(target.toString(), 302);
};
