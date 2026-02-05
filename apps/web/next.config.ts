import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },

      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
        pathname: "/**",
      },
    ],
  },
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  reactCompiler: true,
  compress: true,
  poweredByHeader: false,
};

// Enable bundle analyzer when ANALYZE=true
const analyzeEnabled = process.env.ANALYZE === "true";

export default analyzeEnabled
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;
