import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GiveawayBanner from "@/components/giveaway-banner";
import ScrollProvider from "@/components/scroll-provider";
import SpotifyNowPlaying from "@/components/spotify-now-playing";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://andersonjoseph.com"),
    alternates: {
      canonical: "/",
    },
    title: {
      default: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
      template: "%s | Anderson Joseph",
    },
    description:
      "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
    keywords: [
      "Anderson Joseph",
      "Web Developer",
      "SEO Specialist",
      "Web Performance",
      "No-code Developer",
      "Next.js Developer",
      "React Developer",
    ],
    authors: [{ name: "Anderson Joseph" }],
    openGraph: {
      title: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
      description:
        "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
      url: "https://andersonjoseph.com",
      siteName: "Anderson Joseph",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Anderson Joseph Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
      description:
        "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
      images: ["/opengraph-image"],
      creator: "@andersonjoseph",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          storageKey="andy-theme"
        >
          <ScrollProvider>
            <GiveawayBanner />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <SpotifyNowPlaying />

            <Analytics />
            <SpeedInsights />

            {/* Grain texture overlay for paper-like quality */}
            <div aria-hidden="true" className="grain-overlay" />

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
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
