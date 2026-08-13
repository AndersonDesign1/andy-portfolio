import type { APIRoute } from "astro";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";

export const prerender = false;

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1).optional(),
  scope: z.string().optional(),
  token_type: z.string().optional(),
});

const htmlPage = (title: string, body: string) =>
  new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2rem; line-height: 1.5; max-width: 42rem; }
      code, pre { background: #111; color: #f5f5f5; border-radius: 0.375rem; }
      code { padding: 0.125rem 0.375rem; }
      pre { padding: 1rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
      .muted { color: #666; }
      a { color: inherit; }
    </style>
  </head>
  <body>${body}</body>
</html>`,
    {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 200,
    }
  );

/**
 * Spotify OAuth callback for Astro.
 * Must match the redirect_uri registered in the Spotify app and used by
 * `/api/spotify/authorize`. Apex vs www must match exactly — add both in the
 * dashboard if you use both hosts:
 *   https://www.andersonjoseph.com/api/spotify/callback
 *   https://andersonjoseph.com/api/spotify/callback
 *   http://127.0.0.1:3000/api/spotify/callback
 */
export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return htmlPage(
      "Spotify auth failed",
      `<h1>Spotify auth failed</h1><p class="muted">${oauthError}</p>`
    );
  }

  if (!code) {
    return htmlPage(
      "Spotify callback",
      `<h1>Missing code</h1>
       <p class="muted">Start from <a href="/api/spotify/authorize"><code>/api/spotify/authorize</code></a>.</p>`
    );
  }

  try {
    const env = getServerEnv();
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
      return htmlPage(
        "Spotify token exchange failed",
        `<h1>Token exchange failed</h1>
         <p class="muted">Status ${tokenRes.status}. Confirm the Spotify redirect URI exactly matches:</p>
         <pre>${redirectUri}</pre>
         <pre>${JSON.stringify(raw, null, 2)}</pre>`
      );
    }

    const parsed = tokenResponseSchema.safeParse(raw);
    if (!parsed.success || !parsed.data.refresh_token) {
      return htmlPage(
        "Spotify token incomplete",
        `<h1>No refresh token returned</h1>
         <p class="muted">Spotify only returns a refresh token on the first consent (or when <code>show_dialog=true</code>). Try authorize again.</p>
         <pre>${JSON.stringify(raw, null, 2)}</pre>`
      );
    }

    const refreshToken = parsed.data.refresh_token;

    return htmlPage(
      "Spotify refresh token",
      `<h1>Spotify connected</h1>
       <p>Copy this value into Vercel + Cursor as <code>SPOTIFY_REFRESH_TOKEN</code>, then redeploy.</p>
       <pre>${refreshToken}</pre>
       <p class="muted">Do not share this page. Close it after copying.</p>`
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown callback error";
    return htmlPage(
      "Spotify callback error",
      `<h1>Callback error</h1><pre>${message}</pre>`
    );
  }
};
