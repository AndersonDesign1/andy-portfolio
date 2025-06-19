import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

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

export async function GET(req: NextRequest) {
  const { access_token } = await getAccessToken();

  // Try now playing first
  let res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      next: { revalidate: 30 },
    }
  );

  if (res.status === 204 || res.status > 400) {
    // Fallback to recently played
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
