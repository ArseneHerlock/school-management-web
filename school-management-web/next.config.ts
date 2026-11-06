import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["app.kindergarteny26.online"],
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, PATCH, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Accept, X-Requested-With" },
        ],
      },
    ];
  },
};

export default nextConfig;
