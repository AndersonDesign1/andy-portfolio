import withBundleAnalyzer from "@next/bundle-analyzer";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
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

const configuredNextConfig = analyzeEnabled
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default withBotId(configuredNextConfig);
