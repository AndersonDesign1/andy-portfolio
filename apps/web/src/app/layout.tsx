import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    title: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
    description:
      "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
    keywords: [
      "Anderson Joseph",
      "Web Developer",
      "SEO Specialist",
      "Web Performance",
      "No-code Developer",
    ],
    openGraph: {
      title: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
      description:
        "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
      url: "https://andersonjoseph.com",
      type: "website",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Anderson Joseph | Elevating Businesses with Web Dev & SEO",
      description:
        "Your Friendly Neighbourhood Developer, creating secure, responsive websites and using SEO to boost business rankings and growth online.",
      images: ["/Andy.webp"],
    },
  };
}

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider disableTransitionOnChange={false}>
          <ScrollProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <SpotifyNowPlaying />

            <Analytics />
            <SpeedInsights />

            {/* Grain texture overlay for paper-like quality */}
            <div className="grain-overlay" aria-hidden="true" />

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
