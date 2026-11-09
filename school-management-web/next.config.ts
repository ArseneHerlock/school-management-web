import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : {}),
  transpilePackages: ["lucide-react"],
  devIndicators: false,
  allowedDevOrigins: [
    "app.kindergarteny26.online",
    "*.kindergarteny26.online",
    "localhost:3000",
  ],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
