"use client";
import React, { useEffect, useState } from "react";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string; release_date: string };
  external_urls: { spotify: string };
  isPlaying?: boolean;
}

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    async function fetchTrack() {
      const res = await fetch("/api/spotify/now-playing");
      if (res.ok) {
        const data = await res.json();
        setTrack(data);
      }
    }
    fetchTrack();
    const interval = setInterval(fetchTrack, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!track) {
    return (
      <button
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50
          bg-light-bg text-dark-bg border border-light-mini/30
          dark:bg-dark-bg dark:text-light-bg dark:border-dark-mini/30
          px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-400
          opacity-100 translate-y-0 text-xs sm:text-sm"
        aria-label="Spotify Now Playing"
        title="Spotify Now Playing"
        disabled
      >
        Loading Spotify...
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
    >
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`
          flex items-center gap-2 sm:gap-3
          bg-light-bg text-dark-bg border border-light-mini/30
          dark:bg-dark-bg dark:text-light-bg dark:border-dark-mini/30
          px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow transition-all duration-200
          hover:bg-light-mini/10 dark:hover:bg-dark-mini/10
          focus:outline-none focus:ring-2 focus:ring-blue-400
          text-xs sm:text-sm max-w-[90vw] sm:max-w-xs
        `}
        aria-label={track.isPlaying ? `Now playing: ${track.name} by ${track.artists.map((a) => a.name).join(", ")}` : `Last played: ${track.name} by ${track.artists.map((a) => a.name).join(", ")}`}
        title={track.isPlaying ? `Now playing: ${track.name} by ${track.artists.map((a) => a.name).join(", ")}` : `Last played: ${track.name} by ${track.artists.map((a) => a.name).join(", ")}`}
      >
        <img
          src={track.album.images[2]?.url || track.album.images[0]?.url}
          alt={track.name}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded"
        />
        <div className="flex flex-col items-start min-w-0">
          <span className="font-medium text-[11px] sm:text-xs truncate w-full">
            {track.isPlaying ? "Now Playing" : "Last Played"}
          </span>
          <span className="text-[11px] sm:text-xs text-light-mini dark:text-dark-mini truncate w-full">
            {track.name} — {track.artists.map((a) => a.name).join(", ")}
          </span>
        </div>
      </button>
      {/* Tooltip/Modal */}
      <div
        className={`
          absolute bottom-14 right-0 w-64 max-w-[90vw]
          ${
            showTooltip
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }
          transition-all duration-200
        `}
        style={{ zIndex: 100 }}
      >
        <div
          className={`
            bg-light-bg border border-light-mini/20
            dark:bg-dark-bg dark:border-dark-mini/20
            rounded-xl shadow-lg p-3 sm:p-4
            flex flex-col gap-2
            transition-colors duration-200
          `}
        >
          <div className="flex items-center gap-2">
            <img
              src={track.album.images[1]?.url || track.album.images[0]?.url}
              alt={track.album.name}
              className="w-10 h-10 rounded"
            />
            <div className="min-w-0">
              <div className="font-semibold text-xs sm:text-sm text-light-heading dark:text-dark-heading truncate">
                {track.name}
              </div>
              <div className="text-[11px] sm:text-xs text-light-mini dark:text-dark-mini truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </div>
          <div className="text-[11px] sm:text-xs text-light-mini dark:text-dark-mini">
            <span className="font-medium">Album:</span> {track.album.name}
            <br />
            <span className="font-medium">Released:</span>{" "}
            {track.album.release_date}
          </div>
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Open in Spotify ↗
          </a>
        </div>
      </div>
    </div>
  );
}
