import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 回源走 HTTPS(ECS Caddy 终结 TLS);明文 http 链路已于 v0.5.1 消除
    return [{ source: "/api/:path*", destination: "https://www.lumina-core.cn/:path*" }];
  },
  async redirects() {
    return [
      // AI 爬虫习惯探 /llms.txt;事实源在 api 域,308 过去避免两份漂移
      { source: "/llms.txt", destination: "https://api.lumina-core.cn/llms.txt", permanent: true },
      // 关于页已下线(2026-06-11 Shane:信息与首页重复,联系方式暂不公开);307 留恢复余地
      { source: "/about", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
