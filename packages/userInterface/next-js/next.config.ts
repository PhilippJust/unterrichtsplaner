import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  transpilePackages: ['@unterrichtsplaner/core'],
}

export default nextConfig
