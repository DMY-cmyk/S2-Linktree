import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // All HTML routes — never cache, always fetch fresh from Vercel
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        // Static SVG assets — short cache is fine
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        // Favicon — short cache is fine
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
