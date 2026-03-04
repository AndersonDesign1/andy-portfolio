"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV !== "production") {
    throw error;
  }

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6">
      <div className="relative flex flex-col items-center gap-4 text-center">
        {/* Large subtle background text */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-bold text-[10rem] text-foreground/[0.03] leading-none md:text-[16rem]"
        >
          Error
        </span>

        <h1 className="z-10 font-bold text-4xl text-primary tracking-tight md:text-5xl">
          Something went wrong
        </h1>

        <p className="z-10 max-w-sm text-secondary text-sm md:text-base">
          An unexpected error occurred. You can try again or head back to the
          homepage.
        </p>

        {error.digest && (
          <p className="z-10 font-mono text-muted text-xs">
            Error ID: {error.digest}
          </p>
        )}

        <div className="z-10 mt-8 flex gap-4">
          <Button
            className="group h-11 px-8"
            onClick={() => reset()}
            variant="outline"
          >
            <RotateCcw className="mr-2 size-4 transition-transform duration-300 group-hover:-rotate-45" />
            Try again
          </Button>

          <Button asChild className="h-11 px-8" variant="ghost">
            <Link href="/" prefetch>
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
