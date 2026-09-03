import { type NextRequest, NextResponse } from "next/server";
import { getSpotifyEnv } from "@/lib/env";

const HTTP_STATUS_NO_CONTENT = 204;
const HTTP_STATUS_BAD_REQUEST = 400;
const IDLE_PAYLOAD = { isPlaying: false } as const;

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    getSpotifyEnv();
  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  return response.json();
}

export async function GET(_req: NextRequest) {
  try {
    getSpotifyEnv();
  } catch {
    return NextResponse.json(IDLE_PAYLOAD);
  }

  const { access_token } = await getAccessToken();

  let res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 10 },
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
