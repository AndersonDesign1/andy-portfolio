export const prerender = false;

import type { APIRoute } from "astro";
import { getServerEnv } from "@/lib/env";

const HTTP_STATUS_NO_CONTENT = 204;
const HTTP_STATUS_BAD_REQUEST = 400;

async function getAccessToken() {
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
  return response.json();
}

export const GET: APIRoute = async () => {
  const { access_token } = await getAccessToken();

  let res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${access_token}` },
    }
  );

  if (
    res.status === HTTP_STATUS_NO_CONTENT ||
    res.status > HTTP_STATUS_BAD_REQUEST
  ) {
    res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const data = await res.json();
    const track = data.items?.[0]?.track;
    return new Response(JSON.stringify({ isPlaying: false, ...track }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  return new Response(
    JSON.stringify({ isPlaying: data.is_playing, ...data.item }),
    { headers: { "Content-Type": "application/json" } }
  );
};
