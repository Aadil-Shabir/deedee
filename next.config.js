/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      // Your domains for images here
      'localhost',
      'yoursupabaseproject.supabase.co',
      // Add any other needed domains
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false;
    }
    return config;
  },
  experimental: {
    serverActions: {
      // Increase to 10MB or adjust as needed
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/auth/callback',
        destination: '/api/auth/callback',
      },
    ];
  },
};

module.exports = nextConfig;