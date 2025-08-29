"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

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
    } catch (error) {
      console.error("Failed to fetch Spotify track:", error);
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
        const interval = track?.isPlaying ? 5000 : 15000; // 5s if playing, 15s if not
        intervalRef.current = setInterval(fetchTrack, interval);
      }
    };

    const handleUserActivity = () => {
      if (isActive && !intervalRef.current) {
        fetchTrack();
        const interval = track?.isPlaying ? 5000 : 15000;
        intervalRef.current = setInterval(fetchTrack, interval);
      }
    };

    // Initial fetch
    fetchTrack();

    // Set up adaptive polling based on current playback state
    const interval = track?.isPlaying ? 5000 : 15000;
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
      const interval = track?.isPlaying ? 5000 : 15000;
      intervalRef.current = setInterval(fetchTrack, interval);
    }
  }, [track?.isPlaying, fetchTrack]);

  if (isLoading) {
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

  if (!track) {
    return (
      <button
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50
          bg-light-bg text-dark-bg border border-light-mini/30
          dark:bg-dark-bg dark:text-light-bg dark:border-dark-mini/30
          px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-400
          opacity-100 translate-y-0 text-xs sm:text-sm"
        aria-label="Spotify Not Playing"
        title="Spotify Not Playing"
        disabled
      >
        Not Playing
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
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
      onFocus={() => {
        // Only show tooltip on desktop focus
        if (window.innerWidth >= 640) {
          setShowTooltip(true);
        }
      }}
      onBlur={() => {
        // Only hide tooltip on desktop blur
        if (window.innerWidth >= 640) {
          setShowTooltip(false);
        }
      }}
      tabIndex={0}
    >
      {/* Mobile: Small circular button, Desktop: Full button */}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-400
          shadow hover:shadow-lg
          
          /* Mobile styles */
          w-12 h-12 rounded-full
          bg-light-bg text-dark-bg border border-light-mini/30
          dark:bg-dark-bg dark:text-light-bg dark:border-dark-mini/30
          flex items-center justify-center
          
          /* Desktop styles */
          sm:w-auto sm:h-auto sm:px-4 sm:py-2 sm:gap-3 sm:rounded-full
          sm:hover:bg-light-mini/10 sm:dark:hover:bg-dark-mini/10
        `}
        aria-label={
          track.isPlaying
            ? `Now playing: ${track.name} by ${track.artists
                .map((a) => a.name)
                .join(", ")}`
            : `Last played: ${track.name} by ${track.artists
                .map((a) => a.name)
                .join(", ")}`
        }
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
          src={track.album.images[2]?.url || track.album.images[0]?.url}
          alt={track.name}
          width={32}
          height={32}
          className="w-6 h-6 sm:w-8 sm:h-8 rounded"
        />

        {/* Desktop: Full text info */}
        <div className="hidden sm:flex sm:flex-col sm:items-start sm:min-w-0">
          <span className="font-medium text-xs truncate w-full">
            {track.isPlaying ? "Now Playing" : "Last Played"}
          </span>
          <span className="text-xs text-light-mini dark:text-dark-mini truncate w-full">
            {track.name} — {track.artists.map((a) => a.name).join(", ")}
          </span>
        </div>
      </button>

      {/* Tooltip/Modal - Mobile: Bottom sheet style, Desktop: Tooltip */}
      <div
        className={`
          transition-all duration-200
          ${
            showTooltip
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }
          
          /* Mobile: Always visible on mobile, tooltip on desktop */
          absolute bottom-16 right-0 w-72 max-w-[85vw]
          sm:bottom-14 sm:w-64 sm:max-w-[90vw]
          
          /* Show on mobile when clicked, show/hide on desktop based on hover */
          ${showTooltip ? "block" : "hidden sm:block"}
        `}
        style={{ zIndex: 100 }}
      >
        <div
          className={`
            bg-light-bg border border-light-mini/20
            dark:bg-dark-bg dark:border-dark-mini/20
            rounded-xl shadow-lg p-4
            flex flex-col gap-3
            transition-colors duration-200
            
            /* Desktop: Smaller padding */
            sm:p-3 sm:gap-2
          `}
        >
          <div className="flex items-center gap-3 sm:gap-2">
            <Image
              src={track.album.images[1]?.url || track.album.images[0]?.url}
              alt={track.album.name}
              width={48}
              height={48}
              className="w-12 h-12 sm:w-10 sm:h-10 rounded"
            />
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-sm sm:text-xs text-light-heading dark:text-dark-heading truncate">
                {track.name}
              </div>
              <div className="text-xs sm:text-[11px] text-light-mini dark:text-dark-mini truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-[11px] text-light-mini dark:text-dark-mini space-y-1">
            <div>
              <span className="font-medium">Album:</span> {track.album.name}
            </div>
            <div>
              <span className="font-medium">Released:</span>{" "}
              {track.album.release_date}
            </div>
          </div>

          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 sm:mt-1 inline-block text-sm sm:text-xs text-blue-600 dark:text-blue-400 hover:underline py-2 sm:py-1"
          >
            Open in Spotify ↗
          </a>
        </div>
      </div>
    </div>
  );
}
