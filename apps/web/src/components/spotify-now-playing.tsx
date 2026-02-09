"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  SPOTIFY_POLLING_INTERVAL_PAUSED,
  SPOTIFY_POLLING_INTERVAL_PLAYING,
} from "@/lib/constants";

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string; release_date: string };
  external_urls: { spotify: string };
  isPlaying?: boolean;
}

const fetcher = async (url: string): Promise<SpotifyTrack | null> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
};

// Placeholder image when no album art is available
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%23333' width='64' height='64'/%3E%3C/svg%3E";

// Helper to safely get album image URL
function getAlbumImageUrl(
  images: { url: string }[] | undefined,
  preferredIndex = 0
): string {
  if (!images || images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }
  return images[preferredIndex]?.url || images[0]?.url || PLACEHOLDER_IMAGE;
}

// Music bars animation component
function MusicBars({
  isPlaying,
  variant = "light",
}: {
  isPlaying: boolean;
  variant?: "light" | "dark";
}) {
  const bgColor = variant === "light" ? "bg-white" : "bg-foreground";
  return (
    <div className="flex h-3 items-end gap-0.5">
      <div
        className={`w-0.5 ${bgColor} ${isPlaying ? "h-full animate-[music-bar_0.5s_ease-in-out_infinite]" : "h-1/3"}`}
      />
      <div
        className={`w-0.5 ${bgColor} ${isPlaying ? "h-1/2 animate-[music-bar_0.75s_ease-in-out_infinite] delay-75" : "h-2/3"}`}
      />
      <div
        className={`w-0.5 ${bgColor} ${isPlaying ? "h-3/4 animate-[music-bar_0.6s_ease-in-out_infinite] delay-150" : "h-1/2"}`}
      />
    </div>
  );
}

// Skeleton component for loading state
function SpotifySkeleton() {
  return (
    <div className="fixed right-6 bottom-6 z-50">
      <button
        className="group flex animate-pulse items-center gap-3 rounded-full border border-subtle bg-background/95 py-2 pr-4 pl-2 shadow-sm backdrop-blur-[10px]"
        disabled
        type="button"
      >
        <div className="size-8 rounded-full bg-muted" />
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-16 rounded bg-muted" />
          <div className="h-2.5 w-24 rounded bg-muted" />
        </div>
      </button>
    </div>
  );
}

// Expanded card component
function SpotifyExpandedCard({ track }: { track: SpotifyTrack }) {
  const albumImage = getAlbumImageUrl(track.album.images, 1);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute right-0 bottom-full mb-4 w-72 rounded-sm border border-subtle bg-primary p-6 shadow-2xl"
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
    >
      <div className="mb-4 flex gap-4">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={albumImage}
              transition={{ duration: 0.3 }}
            >
              <Image
                alt={track.album.name}
                className="size-16 rounded-sm object-cover grayscale"
                height={64}
                src={albumImage}
                width={64}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute -right-2 -bottom-2 flex size-4 items-end justify-center gap-0.5 rounded-full border border-white/10 bg-black/40 p-0.5 backdrop-blur-sm">
            <MusicBars isPlaying={track.isPlaying ?? false} variant="light" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key={track.name}
              transition={{ duration: 0.2 }}
            >
              <h4 className="truncate font-semibold text-primary">
                {track.name}
              </h4>
              <p className="truncate text-secondary text-sm">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-2 font-mono text-muted text-xs uppercase tracking-wider">
        <div className="flex justify-between">
          <span>Album</span>
          <span className="max-w-[120px] truncate text-right">
            {track.album.name}
          </span>
        </div>
      </div>

      <Button
        asChild
        className="h-auto w-full py-3 font-mono text-xs uppercase tracking-widest"
        variant="outline"
      >
        <a
          href={track.external_urls.spotify}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open Spotify
        </a>
      </Button>
    </motion.div>
  );
}

// Mini player button component
function SpotifyMiniPlayer({
  track,
  onClick,
}: {
  track: SpotifyTrack;
  onClick: () => void;
}) {
  const thumbnailImage = getAlbumImageUrl(track.album.images, 2);

  return (
    <button
      className="group flex items-center gap-3 rounded-full border border-subtle bg-background/95 py-2 pr-4 pl-2 shadow-sm backdrop-blur-[10px] transition-all duration-300 hover:border-primary focus:outline-none focus:ring-0"
      onClick={onClick}
      type="button"
    >
      <div
        className={`relative size-8 overflow-hidden rounded-full ${track.isPlaying ? "" : "grayscale"}`}
      >
        <Image
          alt={track.name}
          className={`size-full object-cover ${track.isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
          height={32}
          src={thumbnailImage}
          width={32}
        />
        <div className="absolute inset-0 z-10 m-auto size-2 rounded-full border border-subtle bg-primary" />
      </div>

      <div className="flex flex-col items-start gap-1 overflow-hidden text-left">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted uppercase leading-tight tracking-widest">
            {track.isPlaying ? "Now Playing" : "Last Played"}
          </span>
          <MusicBars isPlaying={track.isPlaying ?? false} variant="dark" />
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="block max-w-[140px] truncate font-medium text-primary text-xs leading-tight transition-colors group-hover:text-accent"
            exit={{ opacity: 0, y: -5 }}
            initial={{ opacity: 0, y: 5 }}
            key={track.name}
            transition={{ duration: 0.2 }}
          >
            {track.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </button>
  );
}

export default function SpotifyNowPlaying() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: track, error } = useSWR<SpotifyTrack | null>(
    "/api/spotify/now-playing",
    fetcher,
    {
      refreshInterval: (latestData) =>
        latestData?.isPlaying
          ? SPOTIFY_POLLING_INTERVAL_PLAYING
          : SPOTIFY_POLLING_INTERVAL_PAUSED,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      dedupingInterval: 2000,
      suspense: false,
    }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!(track || error)) {
    return <SpotifySkeleton />;
  }

  if (!track) {
    return null;
  }

  return (
    <div className="fixed right-6 bottom-6 z-50" ref={wrapperRef}>
      <AnimatePresence>
        {isOpen && <SpotifyExpandedCard track={track} />}
      </AnimatePresence>
      <SpotifyMiniPlayer onClick={() => setIsOpen(!isOpen)} track={track} />
    </div>
  );
}
