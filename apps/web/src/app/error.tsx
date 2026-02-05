"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error is automatically logged by Next.js
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <h2 className="mb-4 font-bold text-2xl">Something went wrong!</h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        className="rounded-md bg-foreground px-4 py-2 text-background transition-colors hover:bg-foreground/90"
        onClick={() => reset()}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
