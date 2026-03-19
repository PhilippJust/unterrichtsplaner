import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: './',
  transpilePackages: ['@unterrichtsplaner/core'],
}

export default nextConfig
