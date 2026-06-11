import type { MetadataRoute } from "next";

// AI 爬虫显式放行:对"卖给 AI agent 的数据 API",被 ChatGPT/Claude/Perplexity
// 抓取并在回答中引用(GEO)与经典 SEO 同等重要。语义上与 "*" 等价,但表达意图,
// 也为日后区别对待留好位置。
const AI_BOTS = ["GPTBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/dashboard" },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/", disallow: "/dashboard" })),
    ],
    sitemap: "https://console.lumina-core.cn/sitemap.xml",
  };
}
