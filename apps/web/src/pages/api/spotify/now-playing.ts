import type { APIRoute } from "astro";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";

export const prerender = false;

const HTTP_STATUS_NO_CONTENT = 204;

const spotifyImageSchema = z.object({
  height: z.number().optional(),
  url: z.url(),
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
      spotify: z.url().optional(),
    })
    .optional(),
  name: z.string().min(1),
});

type SpotifyTrack = z.infer<typeof spotifyTrackSchema>;
type SpotifyImage = z.infer<typeof spotifyImageSchema>;

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
});

const currentlyPlayingSchema = z.object({
  is_playing: z.boolean().optional(),
  item: spotifyTrackSchema.nullable().optional(),
});

const recentlyPlayedSchema = z.object({
  items: z
    .array(
      z.object({
        track: spotifyTrackSchema.nullable().optional(),
      })
    )
    .optional(),
});

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
  const data = tokenResponseSchema.parse(await response.json());
  return data.access_token;
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
    return { isPlaying: false };
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
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) {
    throw new Error(`Spotify history request failed with ${res.status}`);
  }
  const data = recentlyPlayedSchema.parse(await res.json());
  const track = data.items?.[0]?.track ?? null;
  return toNowPlayingPayload(track, false);
};

export const GET: APIRoute = async () => {
  const accessToken = await getAccessToken();

  const currentRes = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (currentRes.status === HTTP_STATUS_NO_CONTENT || !currentRes.ok) {
    return Response.json(await fetchRecentlyPlayed(accessToken));
  }

  const data = currentlyPlayingSchema.parse(await currentRes.json());
  const item = data.item ?? null;
  if (!item) {
    return Response.json(await fetchRecentlyPlayed(accessToken));
  }

  return Response.json(toNowPlayingPayload(item, Boolean(data.is_playing)));
};
