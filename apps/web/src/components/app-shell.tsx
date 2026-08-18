"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import ScrollProvider from "@/components/scroll-provider";
import SpotifyLazy from "@/components/spotify-lazy";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

const AppShell = ({
  children,
  pathname,
}: {
  children: ReactNode;
  pathname: string;
}) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    enableSystem
    storageKey="andy-theme"
  >
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ScrollProvider>
          <Navbar pathname={pathname} />
          <main>{children}</main>
          <Footer />
          <SpotifyLazy />
          <Analytics />
          <SpeedInsights />
        </ScrollProvider>
      </MotionConfig>
    </LazyMotion>
  </ThemeProvider>
);

export default AppShell;
