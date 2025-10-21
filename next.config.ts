import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  allowedDevOrigins: [
    "https://unspiritualising-bursarial-royce.ngrok-free.dev",
  ],
};

export default nextConfig;
