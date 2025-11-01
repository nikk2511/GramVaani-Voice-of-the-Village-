/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone' is for Docker - remove for Vercel
  // Note: i18n is handled client-side with react-i18next
  images: {
    domains: [],
  },
  // Enable serverless functions for API routes
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
