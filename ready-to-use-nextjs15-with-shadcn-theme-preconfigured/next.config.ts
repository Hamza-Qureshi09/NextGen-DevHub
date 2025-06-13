import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // output: "standalone",
  // productionBrowserSourceMaps: false, // Disable source maps in development & in production
  // optimizeFonts: false, // Disable font optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200, 1400, 1600], // Define device sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 700, 1024], // Define sizes for image optimization
  },
  experimental: {
    scrollRestoration: true, // Enable scroll restoration between page navigations
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
