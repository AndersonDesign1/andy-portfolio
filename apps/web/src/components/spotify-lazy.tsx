"use client";

import { lazy, Suspense } from "react";

const SpotifyNowPlaying = lazy(
  () => import("@/components/spotify-now-playing")
);

const SpotifyLazy = () => (
  <Suspense fallback={null}>
    <SpotifyNowPlaying />
  </Suspense>
);

export default SpotifyLazy;
