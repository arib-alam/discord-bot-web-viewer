import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  turbopack: { root: path.join(__dirname, "..") },

  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
