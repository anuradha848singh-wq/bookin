/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Static export requires images unoptimized in some Next.js configurations
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
