import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://120.55.183.188:8000/:path*" }];
  },
};

export default nextConfig;
