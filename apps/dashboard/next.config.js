/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@book-in/ui', '@book-in/config', '@book-in/lib', '@book-in/db'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts', 'framer-motion', '@supabase/supabase-js'],
    // @supabase/supabase-js optionally imports @opentelemetry/api for tracing.
    // It's not installed — stub it out so Turbopack doesn't fail.
    turbo: {
      resolveAlias: {
        '@opentelemetry/api': './empty-module.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.turbo/**'],
      };
    }

    // Prevent optional/Node-only packages from being bundled in client/edge builds
    config.resolve.alias = {
      ...config.resolve.alias,
      '@opentelemetry/api': false,
      'ioredis': false,
      'dns': false,
      'net': false,
      'tls': false,
      'fs': false,
    };

    return config;
  },
};

module.exports = nextConfig;

