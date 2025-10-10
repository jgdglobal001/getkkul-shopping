import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // HMR 관련 설정 및 빌드 최적화
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    // 프로덕션 빌드 최적화
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // 244KB
            },
          },
        },
      };

      // 캐시 설정 최적화
      config.cache = {
        type: 'filesystem',
        maxMemoryGenerations: 1,
      };
    }

    return config;
  },
  // Cloudflare Pages configuration
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // 클라우드플레어 Pages용 설정
  generateEtags: false,
  // 정적 파일 생성 강제
  distDir: '.next',
  images: {
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
  // Cloudflare Pages optimization
  poweredByHeader: false,
  // External packages for server components (updated syntax for Next.js 15+)
  serverExternalPackages: [],
  // Optimize for Cloudflare Pages
  compress: true,
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 추가 최적화 설정
  experimental: {
    optimizePackageImports: ['@tosspayments/payment-widget-sdk'],
  },
  // 클라우드플레어 Pages 호환성
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default withNextIntl(nextConfig);
