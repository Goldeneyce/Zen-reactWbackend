// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig & { turbopack?: { root: string } } = {
  images: {
    // Replace deprecated `images.domains` with `remotePatterns`
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      {
        protocol:"https",
        hostname:"img.supabase.com",
      },
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
      },
    ],
  },
  // Silence workspace root inference warning in Next.js 16 (Turbopack)
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default nextConfig;