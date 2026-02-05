import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata();

// REMOVE generateMetadata if it was async and needed specific logic, but here it seems static

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          storageKey="andy-theme"
        >
          <ScrollProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <SpotifyLazy />

            <Analytics />
            <SpeedInsights />

            {/* Grain texture overlay for paper-like quality */}
            <div aria-hidden="true" className="grain-overlay" />

            <Toaster
              offset="80px"
              position="top-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </ScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
