import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Cloudflare Pages에 최적화된 설정
  output: 'export',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // 캐시 및 파일 크기 최적화
  webpack: (config, { isServer }) => {
    // 캐시 비활성화 (파일 크기 문제 해결)
    config.cache = false;

    // 큰 파일들 제외
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // 최적화 설정
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 작은 청크로 분할
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            maxSize: 1000000, // 1MB
          },
        },
      },
    };

    return config;
  },

  // 실험적 기능 최소화
  experimental: {
    optimizePackageImports: ['@tosspayments/payment-widget-sdk'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
