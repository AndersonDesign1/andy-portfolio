import type { Metadata } from "next";
import type { ReactNode, ReactElement } from "react";
import { Inter } from "next/font/google"; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
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

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider disableTransitionOnChange={false}>
          <Navbar />
          <main>{children}</main>
          <Footer />

          <Analytics />
          <SpeedInsights />

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
        </ThemeProvider>
      </body>
    </html>
  );
}
