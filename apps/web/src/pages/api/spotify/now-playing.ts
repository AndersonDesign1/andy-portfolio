import type { APIRoute } from "astro";
import { z } from "zod";

import { getSpotifyEnv } from "@/lib/env";

export const prerender = false;

const HTTP_STATUS_NO_CONTENT = 204;
const IDLE_PAYLOAD = { isPlaying: false } as const;

const spotifyImageSchema = z.object({
  height: z.number().optional(),
  url: z.string().min(1),
  width: z.number().optional(),
});

const spotifyTrackSchema = z.object({
  album: z
    .object({
      images: z.array(spotifyImageSchema).optional(),
      name: z.string().optional(),
      release_date: z.string().optional(),
    })
    .optional(),
  artists: z
    .array(
      z.object({
        name: z.string().optional(),
      })
    )
    .optional(),
  external_urls: z
    .object({
      spotify: z.string().optional(),
    })
    .optional(),
  name: z.string().min(1),
});

interface SpotifyTrack {
  album?: {
    images?: { height?: number; url: string; width?: number }[];
    name?: string;
    release_date?: string;
  };
  artists?: { name?: string }[];
  external_urls?: { spotify?: string };
  name: string;
}

interface SpotifyImage {
  height?: number;
  url: string;
  width?: number;
}

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
});

const currentlyPlayingSchema = z.object({
  is_playing: z.boolean().optional(),
  item: z.unknown().optional(),
});

const recentlyPlayedSchema = z.object({
  items: z
    .array(
      z.object({
        track: z.unknown().optional(),
      })
    )
    .optional(),
});

const getAccessToken = async (): Promise<string | null> => {
  try {
    const env = getSpotifyEnv();
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
      return null;
    }

    const parsed = tokenResponseSchema.safeParse(await response.json());
    return parsed.success ? parsed.data.access_token : null;
  } catch {
    return null;
  }
};

const pickAlbumArtUrl = (images: SpotifyImage[] | undefined): string | null => {
  if (!images || images.length === 0) {
    return null;
  }
  // Spotify returns largest → smallest; prefer mid-size, then largest, then any.
  const mid = images[1]?.url;
  const largest = images[0]?.url;
  const smallest = images.at(-1)?.url;
  return mid || largest || smallest || null;
};

const toNowPlayingPayload = (
  track: SpotifyTrack | null,
  isPlaying: boolean
) => {
  if (!track) {
    return IDLE_PAYLOAD;
  }

  return {
    album: track.album,
    albumArtUrl: pickAlbumArtUrl(track.album?.images),
    artists: track.artists,
    external_urls: track.external_urls,
    isPlaying,
    name: track.name,
  };
};

const fetchRecentlyPlayed = async (accessToken: string) => {
  try {
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      return IDLE_PAYLOAD;
    }

    const parsed = recentlyPlayedSchema.safeParse(await res.json());
    if (!parsed.success) {
      return IDLE_PAYLOAD;
    }

    const trackParsed = spotifyTrackSchema.safeParse(
      parsed.data.items?.[0]?.track
    );
    return toNowPlayingPayload(
      trackParsed.success ? trackParsed.data : null,
      false
    );
  } catch {
    return IDLE_PAYLOAD;
  }
};

export const GET: APIRoute = async () => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return Response.json(IDLE_PAYLOAD, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const currentRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (currentRes.status === HTTP_STATUS_NO_CONTENT || !currentRes.ok) {
      return Response.json(await fetchRecentlyPlayed(accessToken), {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const parsed = currentlyPlayingSchema.safeParse(await currentRes.json());
    if (!parsed.success) {
      return Response.json(await fetchRecentlyPlayed(accessToken), {
        headers: { "Cache-Control": "no-store" },
      });
    }

    const itemParsed = spotifyTrackSchema.safeParse(parsed.data.item);
    if (!itemParsed.success) {
      return Response.json(await fetchRecentlyPlayed(accessToken), {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return Response.json(
      toNowPlayingPayload(itemParsed.data, Boolean(parsed.data.is_playing)),
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    // Never 500 the widget — idle payload hides cleanly on the client.
    return Response.json(IDLE_PAYLOAD, {
      headers: { "Cache-Control": "no-store" },
    });
  }
};
