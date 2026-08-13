"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

const usePathname = () => globalThis.window?.location.pathname ?? "";

// Giveaway: Jan 2, 2026 12:00 PM Nigeria Time (WAT = UTC+1) to Jan 9, 2026 12:00 PM
const GIVEAWAY_START = new Date("2026-01-02T12:00:00+01:00").getTime();
const GIVEAWAY_END = new Date("2026-01-09T12:00:00+01:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface GiveawayState {
  status: "pending" | "active" | "ended";
  timeLeft: TimeLeft | null;
}

const calculateTimeLeft = (targetTime: number): TimeLeft | null => {
  const now = Date.now();
  const difference = targetTime - now;

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const getGiveawayState = (now = Date.now()): GiveawayState => {
  if (now < GIVEAWAY_START) {
    return {
      status: "pending",
      timeLeft: calculateTimeLeft(GIVEAWAY_START),
    };
  }

  if (now < GIVEAWAY_END) {
    return {
      status: "active",
      timeLeft: calculateTimeLeft(GIVEAWAY_END),
    };
  }

  return {
    status: "ended",
    timeLeft: null,
  };
};

export const useGiveawayStatus = () => {
  const [state, setState] = useState<GiveawayState>(() => getGiveawayState());

  useEffect(() => {
    const updateStatus = () => setState(getGiveawayState());

    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return state;
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-primary font-mono text-base font-bold md:text-lg">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-muted font-mono text-[9px] tracking-wider uppercase">
      {label}
    </span>
  </div>
);

export const CountdownDisplay = ({
  timeLeft,
  compact = false,
}: {
  timeLeft: TimeLeft;
  compact?: boolean;
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-primary font-mono text-sm font-bold">
          {String(timeLeft.days).padStart(2, "0")}d
        </span>
        <span className="text-muted">:</span>
        <span className="text-primary font-mono text-sm font-bold">
          {String(timeLeft.hours).padStart(2, "0")}h
        </span>
        <span className="text-muted">:</span>
        <span className="text-primary font-mono text-sm font-bold">
          {String(timeLeft.minutes).padStart(2, "0")}m
        </span>
        <span className="text-muted">:</span>
        <span className="text-primary font-mono text-sm font-bold">
          {String(timeLeft.seconds).padStart(2, "0")}s
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <TimeUnit label="Days" value={timeLeft.days} />
      <span className="text-muted">:</span>
      <TimeUnit label="Hrs" value={timeLeft.hours} />
      <span className="text-muted">:</span>
      <TimeUnit label="Min" value={timeLeft.minutes} />
      <span className="text-muted">:</span>
      <TimeUnit label="Sec" value={timeLeft.seconds} />
    </div>
  );
};

const GiveawayBanner = () => {
  const { status, timeLeft } = useGiveawayStatus();
  const pathname = usePathname();

  // Hide banner on giveaway pages (they have their own countdown)
  const isGiveawayPage = pathname?.startsWith("/giveaway");

  if (status === "ended" || isGiveawayPage) {
    return null;
  }

  return (
    <div className="border-subtle bg-background/95 fixed top-0 right-0 left-0 z-[60] border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm">🎉</span>
          <span className="text-primary text-sm font-medium">
            {status === "pending"
              ? "Win a FREE website!"
              : "Win a FREE website!"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {timeLeft && (
            <div className="flex items-center gap-2">
              <span className="text-muted hidden text-xs md:inline">
                {status === "pending" ? "Starts in:" : "Ends in:"}
              </span>
              <CountdownDisplay compact timeLeft={timeLeft} />
            </div>
          )}

          <a
            className="border-subtle text-primary inline-flex items-center gap-1 rounded-sm border px-3 py-1.5 text-xs font-medium transition-opacity duration-300 hover:opacity-70"
            href="/giveaway"
          >
            {status === "pending" ? "Learn More" : "Enter Now"}
            <HugeiconsIcon
              className="inline"
              color="currentColor"
              icon={ArrowRight01Icon}
              size={16}
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GiveawayBanner;
