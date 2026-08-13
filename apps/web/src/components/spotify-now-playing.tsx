"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  SPOTIFY_POLLING_INTERVAL_PAUSED,
  SPOTIFY_POLLING_INTERVAL_PLAYING,
} from "@/lib/constants";

interface SpotifyTrack {
  album?: { images?: { url?: string }[]; name?: string; release_date?: string };
  albumArtUrl?: string | null;
  artists?: { name?: string }[];
  external_urls?: { spotify?: string };
  isPlaying?: boolean;
  name?: string;
}

const fetcher = async (url: string): Promise<SpotifyTrack | null> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return null;
  }
  return res.json();
};

// Placeholder when Spotify returns no album art (valid SVG fill)
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect fill='%23333333' width='64' height='64'/%3E%3C/svg%3E";

const getAlbumImageUrl = (track: SpotifyTrack, preferredIndex = 0): string => {
  if (track.albumArtUrl) {
    return track.albumArtUrl;
  }

  const images = track.album?.images;
  if (!images || images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }

  return images[preferredIndex]?.url || images[0]?.url || PLACEHOLDER_IMAGE;
};

const getArtistNames = (artists: { name?: string }[] | undefined): string => {
  if (!artists || artists.length === 0) {
    return "Unknown artist";
  }

  const names = artists.flatMap((artist) => (artist.name ? [artist.name] : []));
  return names.length > 0 ? names.join(", ") : "Unknown artist";
};

const MusicBars = ({
  isPlaying,
  variant = "light",
}: {
  isPlaying: boolean;
  variant?: "light" | "dark";
}) => {
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
};

const SpotifySkeleton = () => (
  <div className="fixed right-6 bottom-6 z-50">
    <button
      aria-label="Loading Spotify player"
      className="group border-subtle bg-background/95 flex animate-pulse items-center gap-3 rounded-full border py-2 pr-4 pl-2 shadow-sm backdrop-blur-[10px]"
      disabled
      type="button"
    >
      <div className="bg-muted size-8 rounded-full" />
      <div className="flex flex-col gap-1.5">
        <div className="bg-muted h-2 w-16 rounded" />
        <div className="bg-muted h-2.5 w-24 rounded" />
      </div>
    </button>
  </div>
);

const AlbumArt = ({
  alt,
  className,
  src,
  size,
}: {
  alt: string;
  className?: string;
  size: number;
  src: string;
}) => (
  <img
    alt={alt}
    className={className}
    decoding="async"
    height={size}
    // Spotify CDNs are more reliable without a document referrer.
    referrerPolicy="no-referrer"
    src={src}
    width={size}
  />
);

const SpotifyExpandedCard = ({ track }: { track: SpotifyTrack }) => {
  const albumImage = getAlbumImageUrl(track, 1);
  const albumName = track.album?.name || "Unknown album";
  const trackName = track.name || "Unknown track";
  const artistNames = getArtistNames(track.artists);
  const spotifyUrl = track.external_urls?.spotify || "#";

  return (
    <m.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="border-subtle bg-primary absolute right-0 bottom-full mb-4 w-72 rounded-sm border p-6 shadow-2xl"
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
    >
      <div className="mb-4 flex gap-4">
        <div className="relative">
          <AnimatePresence mode="wait">
            <m.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              key={albumImage}
              transition={{ duration: 0.3 }}
            >
              <AlbumArt
                alt={albumName}
                className={`size-16 rounded-sm object-cover ${track.isPlaying ? "" : "grayscale"}`}
                size={64}
                src={albumImage}
              />
            </m.div>
          </AnimatePresence>
          <div className="absolute -right-2 -bottom-2 flex size-4 items-end justify-center gap-0.5 rounded-full border border-white/10 bg-black/40 p-0.5 backdrop-blur-sm">
            <MusicBars isPlaying={track.isPlaying ?? false} variant="light" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <m.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key={trackName}
              transition={{ duration: 0.2 }}
            >
              <h4 className="text-primary truncate font-semibold">
                {trackName}
              </h4>
              <p className="text-secondary truncate text-sm">{artistNames}</p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-muted mb-6 flex flex-col gap-2 font-mono text-xs tracking-wider uppercase">
        <div className="flex justify-between">
          <span>Album</span>
          <span className="max-w-[120px] truncate text-right">{albumName}</span>
        </div>
      </div>

      <Button
        asChild
        className="h-auto w-full py-3 font-mono text-xs tracking-widest uppercase"
        variant="outline"
      >
        <a href={spotifyUrl} rel="noopener noreferrer" target="_blank">
          Open Spotify
        </a>
      </Button>
    </m.div>
  );
};

const SpotifyMiniPlayer = ({
  track,
  onClick,
}: {
  track: SpotifyTrack;
  onClick: () => void;
}) => {
  const thumbnailImage = getAlbumImageUrl(track, 2);
  const trackName = track.name || "Unknown track";

  return (
    <button
      className="group border-subtle bg-background/95 hover:border-primary flex items-center gap-3 rounded-full border py-2 pr-4 pl-2 shadow-sm backdrop-blur-[10px] transition-all duration-300 focus:ring-0 focus:outline-none"
      onClick={onClick}
      type="button"
    >
      <div
        className={`relative size-8 overflow-hidden rounded-full ${track.isPlaying ? "" : "grayscale"}`}
      >
        <AlbumArt
          alt={trackName}
          className={`size-full object-cover ${track.isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
          size={32}
          src={thumbnailImage}
        />
        <div className="border-subtle bg-primary absolute inset-0 z-10 m-auto size-2 rounded-full border" />
      </div>

      <div className="flex flex-col items-start gap-1 overflow-hidden text-left">
        <div className="flex items-center gap-2">
          <span className="text-muted font-mono text-[10px] leading-tight tracking-widest uppercase">
            {track.isPlaying ? "Now Playing" : "Last Played"}
          </span>
          <MusicBars isPlaying={track.isPlaying ?? false} variant="dark" />
        </div>
        <AnimatePresence mode="wait">
          <m.span
            animate={{ opacity: 1, y: 0 }}
            className="text-primary group-hover:text-accent block max-w-[140px] truncate text-xs leading-tight font-medium transition-colors"
            exit={{ opacity: 0, y: -5 }}
            initial={{ opacity: 0, y: 5 }}
            key={trackName}
            transition={{ duration: 0.2 }}
          >
            {trackName}
          </m.span>
        </AnimatePresence>
      </div>
    </button>
  );
};

const SpotifyNowPlaying = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: track, error } = useSWR<SpotifyTrack | null>(
    "/api/spotify/now-playing",
    fetcher,
    {
      dedupingInterval: 2000,
      refreshInterval: (latestData) =>
        latestData?.isPlaying
          ? SPOTIFY_POLLING_INTERVAL_PLAYING
          : SPOTIFY_POLLING_INTERVAL_PAUSED,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      suspense: false,
    }
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!(track || error)) {
    return <SpotifySkeleton />;
  }

  // Idle payload with no track metadata (e.g. `{ isPlaying: false }`) — hide widget.
  if (!track?.name) {
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
};

export default SpotifyNowPlaying;
