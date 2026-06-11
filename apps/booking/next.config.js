/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@book-in/ui', '@book-in/config', '@book-in/lib', '@book-in/db'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  experimental: {
    // Enable experimental features if needed
  },
  // Custom webpack config for CSS modules
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
