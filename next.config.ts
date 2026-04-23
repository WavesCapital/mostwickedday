import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mwd-photos.mostwickedday.com", pathname: "/**" },
      { protocol: "https", hostname: "pub-*.r2.dev", pathname: "/**" },
    ],
  },
  experimental: {
    cacheComponents: true,
  },
};

export default nextConfig;
