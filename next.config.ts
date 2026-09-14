import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80, 90],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
