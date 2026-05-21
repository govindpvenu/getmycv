import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // reactCompiler: true,
  // cacheComponents: true,

  turbopack: {
    root: path.resolve(__dirname),
  },

  allowedDevOrigins: [
    "unspiritualising-bursarial-royce.ngrok-free.dev",
    "*.unspiritualising-bursarial-royce.ngrok-free.dev",
    "localhost:3000",
    "*.localhost:3000",
  ],
};

export default nextConfig;
