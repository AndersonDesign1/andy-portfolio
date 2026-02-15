"use client";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
        style={{
          backgroundColor: "#050505",
          color: "#ededed",
          margin: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              maxWidth: "400px",
              color: "#a3a3a3",
              fontSize: "clamp(0.875rem, 2vw, 1rem)",
              lineHeight: 1.6,
              marginBottom: "8px",
            }}
          >
            A critical error occurred. You can try again or refresh the page.
          </p>

          {error.digest && (
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "#525252",
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
              onClick={() => reset()}
              style={{
                padding: "10px 32px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#ededed",
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              type="button"
            >
              Try again
            </button>

            <a
              href="/"
              style={{
                padding: "10px 32px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#a3a3a3",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
