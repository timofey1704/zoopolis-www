import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // для локал девеломпента
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'stage.zoopolis.org',
      },
      {
        protocol: 'https',
        hostname: 'zoopolis.org',
      },
    ],
  },
}

export default nextConfig
