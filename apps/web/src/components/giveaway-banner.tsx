"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Giveaway: Jan 2, 2026 12:00 PM Nigeria Time (WAT = UTC+1) to Jan 9, 2026 12:00 PM
const GIVEAWAY_START = new Date("2026-01-02T12:00:00+01:00").getTime();
const GIVEAWAY_END = new Date("2026-01-09T12:00:00+01:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetTime: number): TimeLeft | null {
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
}

export function useGiveawayStatus() {
  const [status, setStatus] = useState<"pending" | "active" | "ended">(
    "pending"
  );
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    function updateStatus() {
      const now = Date.now();

      if (now < GIVEAWAY_START) {
        setStatus("pending");
        setTimeLeft(calculateTimeLeft(GIVEAWAY_START));
      } else if (now < GIVEAWAY_END) {
        setStatus("active");
        setTimeLeft(calculateTimeLeft(GIVEAWAY_END));
      } else {
        setStatus("ended");
        setTimeLeft(null);
      }
    }

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return { status, timeLeft };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bold font-mono text-base text-primary md:text-lg">
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-mono text-[9px] text-muted uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function CountdownDisplay({
  timeLeft,
  compact = false,
}: {
  timeLeft: TimeLeft;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <span className="font-bold font-mono text-primary text-sm">
          {String(timeLeft.days).padStart(2, "0")}d
        </span>
        <span className="text-muted">:</span>
        <span className="font-bold font-mono text-primary text-sm">
          {String(timeLeft.hours).padStart(2, "0")}h
        </span>
        <span className="text-muted">:</span>
        <span className="font-bold font-mono text-primary text-sm">
          {String(timeLeft.minutes).padStart(2, "0")}m
        </span>
        <span className="text-muted">:</span>
        <span className="font-bold font-mono text-primary text-sm">
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
}

export default function GiveawayBanner() {
  const { status, timeLeft } = useGiveawayStatus();

  if (status === "ended") {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-[60] border-subtle border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm">🎉</span>
          <span className="font-medium text-primary text-sm">
            {status === "pending"
              ? "Win a FREE website!"
              : "Win a FREE website!"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {timeLeft && (
            <div className="flex items-center gap-2">
              <span className="hidden text-muted text-xs md:inline">
                {status === "pending" ? "Starts in:" : "Ends in:"}
              </span>
              <CountdownDisplay compact timeLeft={timeLeft} />
            </div>
          )}

          <Link
            className="inline-flex items-center gap-1 rounded-sm border border-subtle px-3 py-1.5 font-medium text-primary text-xs transition-opacity duration-300 hover:opacity-70"
            href="/giveaway"
          >
            {status === "pending" ? "Learn More" : "Enter Now"}
            <span className="ml-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
