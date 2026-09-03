import { domAnimation, LazyMotion } from "motion/react";
import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ScrollProvider from "@/components/scroll-provider";
import SpotifyLazy from "@/components/spotify-lazy";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";

import { inter } from "@/lib/fonts";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata();

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * Blocking, pre-paint theme resolver. Runs in <head> before the body
         * paints (unlike next-themes' body script, which can run after first
         * paint on heavier pages and cause a light/dark flash). Sets the
         * .light/.dark class from the stored choice or OS preference so the
         * correct palette is present on the very first paint. Kept in sync
         * with next-themes via the shared "andy-theme" storage key.
         */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required for a synchronous pre-paint theme script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("andy-theme");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);var c=document.documentElement.classList;c.remove("light","dark");c.add(d?"dark":"light");}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
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
      </body>
    </html>
  );
}
