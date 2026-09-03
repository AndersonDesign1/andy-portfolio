import withBundleAnalyzer from "@next/bundle-analyzer";
import { withGraft } from "@usegraft/sdk-next/config";
import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  compress: true,
  experimental: {
    optimizePackageImports: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "mosaic.scdn.co",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "i.scdn.co",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
  partialPrefetching: true,
  poweredByHeader: false,
  reactCompiler: true,
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
};

// Enable bundle analyzer when ANALYZE=true
const analyzeEnabled = process.env.ANALYZE === "true";
const configuredNextConfig = analyzeEnabled
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default withGraft(withBotId(configuredNextConfig));
