import type { APIRoute } from "astro";

import { getServerEnv } from "@/lib/env";

export const prerender = false;

const HTTP_STATUS_NO_CONTENT = 204;

const getAccessToken = async (): Promise<string> => {
  const env = getServerEnv();
  const basic = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Spotify token request failed with ${response.status}`);
  }
  const data = await response.json();
  return data.access_token;
};

export const GET: APIRoute = async () => {
  const accessToken = await getAccessToken();

  let res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (res.status === HTTP_STATUS_NO_CONTENT || !res.ok) {
    res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      throw new Error(`Spotify history request failed with ${res.status}`);
    }
    const data = await res.json();
    const track = data.items?.[0]?.track;
    return Response.json({ isPlaying: false, ...track });
  }

  const data = await res.json();
  return Response.json({ isPlaying: data.is_playing, ...data.item });
};
