"use client";

import dynamic from "next/dynamic";

const SpotifyNowPlaying = dynamic(
  () => import("@/components/spotify-now-playing"),
  { ssr: false }
);

export default function SpotifyLazy() {
  return <SpotifyNowPlaying />;
}
