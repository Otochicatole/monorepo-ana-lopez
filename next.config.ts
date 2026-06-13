import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // SVG disabled: serving SVG through Next/Image can enable stored XSS
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    unoptimized: true,
  },
};

export default nextConfig;
