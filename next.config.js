/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
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
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/auth/callback',
        destination: '/auth/signin',
        permanent: false,
        has: [
          {
            type: 'query',
            key: 'error',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;