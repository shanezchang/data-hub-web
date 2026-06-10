import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dashboard" },
    sitemap: "https://console.lumina-core.cn/sitemap.xml",
  };
}
