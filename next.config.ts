import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  distDir: 'out',
  assetPrefix: '',
};

export default nextConfig;
