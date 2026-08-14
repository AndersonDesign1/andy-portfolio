import type { APIRoute } from "astro";
import { z } from "zod";

import { getSpotifyEnv } from "@/lib/env";
import {
  clearOAuthStateCookie,
  escapeHtml,
  readCookieValue,
  SPOTIFY_OAUTH_STATE_COOKIE,
  spotifyOAuthHtmlPage,
} from "@/lib/spotify-oauth";

export const prerender = false;

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1).optional(),
  scope: z.string().optional(),
  token_type: z.string().optional(),
});

/**
 * Spotify OAuth callback for Astro.
 * Must match the redirect_uri registered in the Spotify app and used by
 * `/api/spotify/authorize`. Apex vs www must match exactly — add both in the
 * dashboard if you use both hosts:
 *   https://www.andersonjoseph.com/api/spotify/callback
 *   https://andersonjoseph.com/api/spotify/callback
 *   http://127.0.0.1:3000/api/spotify/callback
 */
export const GET: APIRoute = async ({ request, url }) => {
  const secure = url.protocol === "https:";
  const clearStateCookie = clearOAuthStateCookie(secure);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");
  const returnedState = url.searchParams.get("state");
  const expectedState = readCookieValue(
    request.headers.get("cookie"),
    SPOTIFY_OAUTH_STATE_COOKIE
  );

  if (oauthError) {
    return spotifyOAuthHtmlPage(
      "Spotify auth failed",
      `<h1>Spotify auth failed</h1><p class="muted">${escapeHtml(oauthError)}</p>`,
      { setCookie: clearStateCookie }
    );
  }

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    return spotifyOAuthHtmlPage(
      "Spotify auth invalid",
      `<h1>Invalid OAuth state</h1>
       <p class="muted">Start again from <a href="/api/spotify/authorize"><code>/api/spotify/authorize</code></a> in the same browser.</p>`,
      { setCookie: clearStateCookie, status: 400 }
    );
  }

  if (!code) {
    return spotifyOAuthHtmlPage(
      "Spotify callback",
      `<h1>Missing code</h1>
       <p class="muted">Start from <a href="/api/spotify/authorize"><code>/api/spotify/authorize</code></a>.</p>`,
      { setCookie: clearStateCookie, status: 400 }
    );
  }

  try {
    const env = getSpotifyEnv();
    const redirectUri = new URL("/api/spotify/callback", url.origin).toString();
    const basic = Buffer.from(
      `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const raw: unknown = await tokenRes.json();
    if (!tokenRes.ok) {
      return spotifyOAuthHtmlPage(
        "Spotify token exchange failed",
        `<h1>Token exchange failed</h1>
         <p class="muted">Status ${tokenRes.status}. Confirm the Spotify redirect URI exactly matches:</p>
         <pre>${escapeHtml(redirectUri)}</pre>
         <pre>${escapeHtml(JSON.stringify(raw, null, 2))}</pre>`,
        { setCookie: clearStateCookie, status: 400 }
      );
    }

    const parsed = tokenResponseSchema.safeParse(raw);
    if (!parsed.success || !parsed.data.refresh_token) {
      return spotifyOAuthHtmlPage(
        "Spotify token incomplete",
        `<h1>No refresh token returned</h1>
         <p class="muted">Spotify only returns a refresh token on the first consent (or when <code>show_dialog=true</code>). Try authorize again.</p>
         <pre>${escapeHtml(JSON.stringify(raw, null, 2))}</pre>`,
        { setCookie: clearStateCookie, status: 400 }
      );
    }

    const refreshToken = parsed.data.refresh_token;

    return spotifyOAuthHtmlPage(
      "Spotify refresh token",
      `<h1>Spotify connected</h1>
       <p>Copy this value into Vercel + Cursor as <code>SPOTIFY_REFRESH_TOKEN</code>, then redeploy.</p>
       <pre>${escapeHtml(refreshToken)}</pre>
       <p class="muted">Do not share this page. Close it after copying.</p>`,
      { setCookie: clearStateCookie }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown callback error";
    return spotifyOAuthHtmlPage(
      "Spotify callback error",
      `<h1>Callback error</h1><pre>${escapeHtml(message)}</pre>`,
      { setCookie: clearStateCookie, status: 500 }
    );
  }
};
