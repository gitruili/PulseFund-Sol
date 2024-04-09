/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
        port: '',
        // pathname: '/api/v1/image/assets/TEMP/**',
      },
    ],
  },
}

module.exports = nextConfig
