"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SPOTIFY_POLLING_INTERVAL_PLAYING,
  SPOTIFY_POLLING_INTERVAL_PAUSED,
} from "@/lib/constants";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string; release_date: string };
  external_urls: { spotify: string };
  isPlaying?: boolean;
};

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastTrackRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Only update state if track actually changed
  const updateTrack = useCallback((newTrack: SpotifyTrack | null) => {
    if (!newTrack) {
      setTrack(null);
      setIsLoading(false);
      return;
    }

    const newTrackKey = `${newTrack.name}-${newTrack.artists
      .map((a) => a.name)
      .join(",")}-${newTrack.isPlaying}`;

    if (newTrackKey !== lastTrackRef.current) {
      setTrack(newTrack);
      lastTrackRef.current = newTrackKey;
    }
    setIsLoading(false);
  }, []);

  // Fetch track data
  const fetchTrack = useCallback(async () => {
    try {
      const res = await fetch("/api/spotify/now-playing");
      if (res.ok) {
        const data = await res.json();
        updateTrack(data);
      } else {
        updateTrack(null);
      }
    } catch (_error) {
      updateTrack(null);
    }
  }, [updateTrack]);

  // Smart polling - adaptive intervals based on playback state
  useEffect(() => {
    let isActive = true;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Clear interval when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
      } else if (isActive) {
        // Restart polling when tab becomes visible
        fetchTrack();
        const interval = track?.isPlaying ? SPOTIFY_POLLING_INTERVAL_PLAYING : SPOTIFY_POLLING_INTERVAL_PAUSED;
        intervalRef.current = setInterval(fetchTrack, interval);
      }
    };

    const handleUserActivity = () => {
      if (isActive && !intervalRef.current) {
        fetchTrack();
        const interval = track?.isPlaying ? SPOTIFY_POLLING_INTERVAL_PLAYING : SPOTIFY_POLLING_INTERVAL_PAUSED;
        intervalRef.current = setInterval(fetchTrack, interval);
      }
    };

    // Initial fetch
    fetchTrack();

    // Set up adaptive polling based on current playback state
    const interval = track?.isPlaying ? SPOTIFY_POLLING_INTERVAL_PLAYING : SPOTIFY_POLLING_INTERVAL_PAUSED;
    intervalRef.current = setInterval(fetchTrack, interval);

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for user activity to restart polling if needed
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);
    document.addEventListener("click", handleUserActivity);

    return () => {
      isActive = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      document.removeEventListener("click", handleUserActivity);
    };
  }, [fetchTrack, track?.isPlaying]); // Re-run when playback state changes

  // Update polling interval when track playback state changes
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      const interval = track?.isPlaying ? SPOTIFY_POLLING_INTERVAL_PLAYING : SPOTIFY_POLLING_INTERVAL_PAUSED;
      intervalRef.current = setInterval(fetchTrack, interval);
    }
  }, [track?.isPlaying, fetchTrack]);

  if (isLoading) {
    return (
      <button
        aria-label="Spotify Now Playing"
        className="fixed right-4 bottom-4 z-50 translate-y-0 rounded-full border border-light-mini/30 bg-light-bg px-3 py-2 text-dark-bg text-xs opacity-100 shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:right-8 sm:bottom-8 sm:px-4 sm:py-2 sm:text-sm dark:border-dark-mini/30 dark:bg-dark-bg dark:text-light-bg"
        disabled
        title="Spotify Now Playing"
      >
        Loading Spotify...
      </button>
    );
  }

  if (!track) {
    return (
      <button
        aria-label="Spotify Not Playing"
        className="fixed right-4 bottom-4 z-50 translate-y-0 rounded-full border border-light-mini/30 bg-light-bg px-3 py-2 text-dark-bg text-xs opacity-100 shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:right-8 sm:bottom-8 sm:px-4 sm:py-2 sm:text-sm dark:border-dark-mini/30 dark:bg-dark-bg dark:text-light-bg"
        disabled
        title="Spotify Not Playing"
      >
        Not Playing
      </button>
    );
  }

  return (
    <div
      className="fixed right-4 bottom-4 z-50 sm:right-8 sm:bottom-8"
      onBlur={() => {
        // Only hide tooltip on desktop blur
        if (window.innerWidth >= 640) {
          setShowTooltip(false);
        }
      }}
      onFocus={() => {
        // Only show tooltip on desktop focus
        if (window.innerWidth >= 640) {
          setShowTooltip(true);
        }
      }}
      onMouseEnter={() => {
        // Only show tooltip on desktop (non-touch devices)
        if (window.innerWidth >= 640) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => {
        // Only hide tooltip on desktop (non-touch devices)
        if (window.innerWidth >= 640) {
          setShowTooltip(false);
        }
      }}
    >
      {/* Mobile: Small circular button, Desktop: Full button */}
      <button
        aria-label={
          track.isPlaying
            ? `Now playing: ${track.name} by ${track.artists
                .map((a) => a.name)
                .join(", ")}`
            : `Last played: ${track.name} by ${track.artists
                .map((a) => a.name)
                .join(", ")}`
        }
        className={
          "/* Mobile styles */ /* Desktop styles */ flex h-12 w-12 items-center justify-center rounded-full border border-light-mini/30 bg-light-bg text-dark-bg shadow transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 sm:h-auto sm:w-auto sm:gap-3 sm:rounded-full sm:px-4 sm:py-2 sm:hover:bg-light-mini/10 dark:border-dark-mini/30 dark:bg-dark-bg dark:text-light-bg sm:dark:hover:bg-dark-mini/10"
        }
        onClick={() => setShowTooltip(!showTooltip)}
        title={
          track.isPlaying
            ? `Now playing: ${track.name} by ${track.artists
                .map((a) => a.name)
                .join(", ")}`
            : `Last played: ${track.name} by ${track.artists
                .map((a) => a.name)
                .join(", ")}`
        }
      >
        {/* Mobile: Just album art, Desktop: Album art + text */}
        <Image
          alt={track.name}
          className="h-6 w-6 rounded sm:h-8 sm:w-8"
          height={32}
          src={track.album.images[2]?.url || track.album.images[0]?.url}
          width={32}
        />

        {/* Desktop: Full text info */}
        <div className="hidden sm:flex sm:min-w-0 sm:flex-col sm:items-start">
          <span className="w-full truncate font-medium text-xs">
            {track.isPlaying ? "Now Playing" : "Last Played"}
          </span>
          <span className="w-full truncate text-light-mini text-xs dark:text-dark-mini">
            {track.name} — {track.artists.map((a) => a.name).join(", ")}
          </span>
        </div>
      </button>

      {/* Tooltip/Modal - Mobile: Bottom sheet style, Desktop: Tooltip */}
      <div
        className={`transition-all duration-200 ${
          showTooltip
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        } absolute right-0 bottom-16 w-72 max-w-[85vw] sm:bottom-14 sm:w-64 sm:max-w-[90vw] ${
          showTooltip ? "block" : "hidden"
        }`}
        style={{ zIndex: 100 }}
      >
        <div
          className={
            "/* Desktop: Smaller padding */ flex flex-col gap-3 rounded-xl border border-light-mini/20 bg-light-bg p-4 shadow-lg transition-colors duration-200 sm:gap-2 sm:p-3 dark:border-dark-mini/20 dark:bg-dark-bg"
          }
        >
          <div className="flex items-center gap-3 sm:gap-2">
            <Image
              alt={track.album.name}
              className="h-12 w-12 rounded sm:h-10 sm:w-10"
              height={48}
              src={track.album.images[1]?.url || track.album.images[0]?.url}
              width={48}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-light-heading text-sm sm:text-xs dark:text-dark-heading">
                {track.name}
              </div>
              <div className="truncate text-light-mini text-xs sm:text-[11px] dark:text-dark-mini">
                {track.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </div>

          <div className="space-y-1 text-light-mini text-xs sm:text-[11px] dark:text-dark-mini">
            <div>
              <span className="font-medium">Album:</span> {track.album.name}
            </div>
            <div>
              <span className="font-medium">Released:</span>{" "}
              {track.album.release_date}
            </div>
          </div>

          <a
            className="mt-2 inline-block py-2 text-blue-600 text-sm hover:underline sm:mt-1 sm:py-1 sm:text-xs dark:text-blue-400"
            href={track.external_urls.spotify}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in Spotify ↗
          </a>
        </div>
      </div>
    </div>
  );
}
