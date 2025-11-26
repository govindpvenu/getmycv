import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  allowedDevOrigins: [
    "unspiritualising-bursarial-royce.ngrok-free.dev",
    "*.unspiritualising-bursarial-royce.ngrok-free.dev",
    "localhost:3000",
    "*.localhost:3000",
  ],
};

export default nextConfig;
