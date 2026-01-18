// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    // Replace deprecated `domains` with `remotePatterns`
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Explicitly set Turbopack workspace root to the monorepo root
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
};

export default nextConfig;