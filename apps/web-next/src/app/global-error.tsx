"use client";

import Link from "next/link";
import { inter } from "@/lib/fonts";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV === "development") {
    throw error;
  }

  return (
    <html lang="en">
      <head>
        <style>{`
              .error-btn:focus-visible {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
              }
              .error-btn:hover {
                background-color: rgba(255, 255, 255, 0.05);
              }
            `}</style>
      </head>
      <body
        className={inter.variable}
        style={{
          backgroundColor: "#050505",
          color: "#ededed",
          fontFamily:
            "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif",
          MozOsxFontSmoothing: "grayscale",
          margin: 0,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              color: "#a3a3a3",
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              lineHeight: 1.6,
              marginBottom: "8px",
              maxWidth: "400px",
            }}
          >
            A critical error occurred. You can try again or refresh the page.
          </p>

          {error.digest && (
            <p
              style={{
                color: "#525252",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                marginBottom: "24px",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <button
              className="error-btn"
              onClick={() => reset()}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
                color: "#ededed",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "10px 32px",
                transition: "background-color 0.2s, box-shadow 0.2s",
              }}
              type="button"
            >
              Try again
            </button>

            <Link
              href="/"
              style={{
                alignItems: "center",
                backgroundColor: "transparent",
                border: "none",
                color: "#a3a3a3",
                cursor: "pointer",
                display: "flex",
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "10px 32px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
