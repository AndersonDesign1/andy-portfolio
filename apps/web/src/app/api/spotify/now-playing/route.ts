import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const HTTP_STATUS_NO_CONTENT = 204;
const HTTP_STATUS_BAD_REQUEST = 400;

const client_id = env.SPOTIFY_CLIENT_ID;
const client_secret = env.SPOTIFY_CLIENT_SECRET;
const refresh_token = env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  return response.json();
}

export async function GET(_req: NextRequest) {
  const { access_token } = await getAccessToken();

  let res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 30 },
    }
  );

  if (
    res.status === HTTP_STATUS_NO_CONTENT ||
    res.status > HTTP_STATUS_BAD_REQUEST
  ) {
    res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const data = await res.json();
    const track = data.items?.[0]?.track;
    return NextResponse.json({
      isPlaying: false,
      ...track,
    });
  }

  const data = await res.json();
  return NextResponse.json({
    isPlaying: data.is_playing,
    ...data.item,
  });
}
