"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";
import ScrollProvider from "@/components/scroll-provider";
import SpotifyLazy from "@/components/spotify-lazy";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey="andy-theme"
    >
      <LazyMotion features={domAnimation} strict>
        <ScrollProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <SpotifyLazy />
          <Analytics />
          <SpeedInsights />
          <Toaster
            offset="80px"
            position="top-right"
            style={{ zIndex: 9998 }}
            toastOptions={{
              style: {
                background: "var(--muted)",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)",
                color: "var(--foreground)",
              },
            }}
          />
        </ScrollProvider>
      </LazyMotion>
    </ThemeProvider>
  );
}
