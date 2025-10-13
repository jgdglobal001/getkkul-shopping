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
  output: 'standalone',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

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
