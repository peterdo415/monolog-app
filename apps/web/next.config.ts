// apps/web/next.config.ts
import { join } from 'path';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // monorepo の ui パッケージをソースからトランスパイル
  transpilePackages: ['@repo/ui'],

  // Webpack のエイリアス設定
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@repo/ui': join(__dirname, '../../packages/ui/src'),
    };
    return config;
  },
};

export default nextConfig;
