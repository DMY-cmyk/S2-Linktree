import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE
      ? String(new Date(process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE).getTime())
      : String(Date.now()),
  },
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
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
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
