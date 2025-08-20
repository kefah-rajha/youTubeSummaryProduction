// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = isProduction 
      ? 'https://youtubesummarynodeproduction.onrender.com'
      : 'http://localhost:5000';

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