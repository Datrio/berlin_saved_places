import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/berlin_saved_places',
  assetPrefix: '/berlin_saved_places',
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
