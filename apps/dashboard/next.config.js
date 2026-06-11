/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@book-in/ui', '@book-in/config', '@book-in/lib', '@book-in/db'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts', 'framer-motion', '@supabase/supabase-js'],
    turbo: {
      resolveAlias: {
        '@opentelemetry/api': './empty-otel.js',
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

    // Only alias optional packages for the client and edge bundles.
    // The server bundle must be left alone so the bundled fallback stubs work.
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/api': false,
        'ioredis': false,
      };
    }

    // Always stub Node-only built-ins for edge/client
    config.resolve.alias = {
      ...config.resolve.alias,
      ...(isServer ? {} : {
        'dns': false,
        'net': false,
        'tls': false,
        'fs': false,
      }),
    };

    return config;
  },
};

module.exports = nextConfig;

