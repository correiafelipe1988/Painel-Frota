import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // gera export estático em "out/"
  output: 'export',
  // desabilita otimização de imagens para compatibilidade com export estático
  images: {
    unoptimized: true
  },
};

export default nextConfig;