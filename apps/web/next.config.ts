// apps/web/next.config.ts
import { join } from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React 19／Pages Router React 18 両対応
  experimental: { externalDir: true },          // App Router外のパッケージもビルド対象に :contentReference[oaicite:1]{index=1}
  transpilePackages: ['@monolog/ui', '@monolog/db'], 
  webpack(config, { webpack }) {
    // cloudflare:sockets を無視（不要依存を排除）
    config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^cloudflare:sockets$/ }));
    // モノレポ内パスエイリアス
    config.resolve.alias = {
      ...config.resolve.alias,
      '@monolog/db':  join(__dirname, '../../packages/db/src'),
      '@monolog/ui':  join(__dirname, '../../packages/ui/src'),
    };
    return config;
  },
};

export default nextConfig;
