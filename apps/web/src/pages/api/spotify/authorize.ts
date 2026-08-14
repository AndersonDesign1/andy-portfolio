import type { APIRoute } from "astro";

import { getServerEnv } from "@/lib/env";
import { buildOAuthStateCookie, createOAuthState } from "@/lib/spotify-oauth";

export const prerender = false;

const SPOTIFY_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ");

/**
 * Starts the Spotify Authorization Code flow for minting a refresh token.
 * Register the matching redirect URI in the Spotify Developer Dashboard:
 *   {origin}/api/spotify/callback
 * Prefer the www origin used by this site (https://www.andersonjoseph.com).
 */
export const GET: APIRoute = ({ url }) => {
  const env = getServerEnv();
  const secure = url.protocol === "https:";
  const state = createOAuthState();
  const redirectUri = new URL("/api/spotify/callback", url.origin).toString();
  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
  authorizeUrl.searchParams.set("client_id", env.SPOTIFY_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", SPOTIFY_SCOPES);
  authorizeUrl.searchParams.set("show_dialog", "true");
  authorizeUrl.searchParams.set("state", state);

  return new Response(null, {
    headers: {
      Location: authorizeUrl.toString(),
      "Set-Cookie": buildOAuthStateCookie(state, secure),
    },
    status: 302,
  });
};
