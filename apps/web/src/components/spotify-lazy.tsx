"use client";

import { lazy, Suspense } from "react";

const SpotifyNowPlaying = lazy(
  () => import("@/components/spotify-now-playing")
);

export default function SpotifyLazy() {
  return (
    <Suspense fallback={null}>
      <SpotifyNowPlaying />
    </Suspense>
  );
}
