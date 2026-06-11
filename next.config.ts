import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 回源走 HTTPS(ECS Caddy 终结 TLS);明文 http 链路已于 v0.5.1 消除
    return [{ source: "/api/:path*", destination: "https://www.lumina-core.cn/:path*" }];
  },
  async redirects() {
    // AI 爬虫习惯探 /llms.txt;事实源在 api 域,308 过去避免两份漂移
    return [{ source: "/llms.txt", destination: "https://api.lumina-core.cn/llms.txt", permanent: true }];
  },
};

export default nextConfig;
