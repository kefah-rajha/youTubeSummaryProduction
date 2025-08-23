// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
    const apiUrl = 'https://youtube-summary-node-production.vercel.app'
      

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  env: {
    CUSTOM_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;