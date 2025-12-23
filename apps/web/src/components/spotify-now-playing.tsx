
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SPOTIFY_POLLING_INTERVAL_PAUSED,
  SPOTIFY_POLLING_INTERVAL_PLAYING,
} from "@/lib/constants";
import { motion, AnimatePresence } from "motion/react";

type SpotifyTrack = {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string; release_date: string };
  external_urls: { spotify: string };
  isPlaying?: boolean;
};

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lastTrackRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  useEffect(() => {
    let isActive = true;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = undefined;
        }
      } else if (isActive) {
        fetchTrack();
        const interval = track?.isPlaying
          ? SPOTIFY_POLLING_INTERVAL_PLAYING
          : SPOTIFY_POLLING_INTERVAL_PAUSED;
        intervalRef.current = setInterval(fetchTrack, interval);
      }
    };

    fetchTrack();
    const interval = track?.isPlaying
      ? SPOTIFY_POLLING_INTERVAL_PLAYING
      : SPOTIFY_POLLING_INTERVAL_PAUSED;
    intervalRef.current = setInterval(fetchTrack, interval);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isActive = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchTrack, track?.isPlaying]);

  if (isLoading || !track) return null;

  return (
    <div ref={wrapperRef} className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-4 w-72 rounded-sm border border-subtle bg-primary p-6 shadow-2xl"
          >
            <div className="flex gap-4 mb-4">
              <div className="relative">
                <Image
                  alt={track.album.name}
                  className="h-16 w-16 grayscale object-cover rounded-sm"
                  height={64}
                  src={track.album.images[1]?.url || track.album.images[0]?.url}
                  width={64}
                />
                 <div className="absolute -bottom-2 -right-2 flex gap-0.5 items-end justify-center h-4 w-4 bg-black/40 backdrop-blur-sm rounded-full p-0.5 border border-white/10">
                    <div className={`w-0.5 bg-white ${track.isPlaying ? "animate-[music-bar_0.8s_ease-in-out_infinite] h-full" : "h-1/2"}`} />
                    <div className={`w-0.5 bg-white ${track.isPlaying ? "animate-[music-bar_0.6s_ease-in-out_infinite] delay-75 h-2/3" : "h-3/4"}`} />
                    <div className={`w-0.5 bg-white ${track.isPlaying ? "animate-[music-bar_1s_ease-in-out_infinite] delay-150 h-1/2" : "h-1/3"}`} />
                 </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="font-semibold text-primary truncate">
                   {track.name}
                </h4>
                <p className="text-secondary text-sm truncate">
                   {track.artists.map((a) => a.name).join(", ")}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-xs font-mono text-muted uppercase tracking-wider mb-6">
               <div className="flex justify-between">
                 <span>Album</span>
                 <span className="text-right truncate max-w-[120px]">{track.album.name}</span>
               </div>
            </div>

            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 border border-subtle text-xs font-mono uppercase tracking-widest hover:bg-secondary/10 transition-colors text-primary"
            >
              Open Spotify
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 bg-primary/80 backdrop-blur-md border border-subtle pr-4 pl-2 py-2 rounded-full hover:border-primary transition-all duration-300 shadow-sm"
      >
        <div className={`relative h-8 w-8 overflow-hidden rounded-full ${!track.isPlaying ? "grayscale" : ""}`}>
           <Image
            alt={track.name}
            className={`h-full w-full object-cover ${track.isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
            height={32}
            src={track.album.images[2]?.url || track.album.images[0]?.url}
            width={32}
          />
           {/* Center dot to make it look like vinyl record */}
           <div className="absolute inset-0 m-auto h-2 w-2 bg-primary rounded-full border border-subtle z-10" />
        </div>

        <div className="flex flex-col items-start text-left">
           <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-mono text-muted leading-tight">
                {track.isPlaying ? "Now Playing" : "Last Played"}
            </span>
             <div className="flex gap-0.5 items-end h-3">
                <div className={`w-0.5 bg-[var(--text-primary)] ${track.isPlaying ? "animate-[music-bar_0.5s_ease-in-out_infinite] h-full" : "h-1/3"}`} />
                <div className={`w-0.5 bg-[var(--text-primary)] ${track.isPlaying ? "animate-[music-bar_0.75s_ease-in-out_infinite] delay-75 h-1/2" : "h-2/3"}`} />
                <div className={`w-0.5 bg-[var(--text-primary)] ${track.isPlaying ? "animate-[music-bar_0.6s_ease-in-out_infinite] delay-150 h-3/4" : "h-1/2"}`} />
             </div>
           </div>
          <span className="text-xs font-medium text-primary truncate max-w-[140px] leading-tight group-hover:text-accent transition-colors">
            {track.name}
          </span>
        </div>
      </button>
    </div>
  );
}
