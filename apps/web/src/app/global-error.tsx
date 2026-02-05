"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center px-6">
        <h2 className="mb-4 font-bold text-2xl">Something went wrong!</h2>
        <p className="mb-8 max-w-md text-center">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          className="rounded-md bg-foreground px-4 py-2 text-background transition-colors hover:bg-foreground/90"
          onClick={() => reset()}
          type="button"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
