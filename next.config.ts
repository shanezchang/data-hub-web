import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 回源走 HTTPS(ECS Caddy 终结 TLS);明文 http 链路已于 v0.5.1 消除
    return [{ source: "/api/:path*", destination: "https://www.lumina-core.cn/:path*" }];
  },
};

export default nextConfig;
