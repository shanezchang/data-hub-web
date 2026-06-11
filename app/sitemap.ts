import type { MetadataRoute } from "next";
import { DATASETS } from "@/lib/datasets";
import { INSIGHTS } from "@/lib/insights";
import trends from "@/lib/trends-data.json";

// 只放可索引的公开页:登录/注册/重置是无内容的鉴权页,不进 sitemap。
const TREND_PAGES = ["/trends/xinwen-lianbo-keywords", "/trends/yc-batch-survival"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://console.lumina-core.cn";
  const buildTime = new Date();
  return [
    { url: base, lastModified: buildTime, priority: 1 },
    ...DATASETS.map((d) => ({ url: `${base}/datasets/${d.slug}`, lastModified: buildTime, priority: 0.9 })),
    ...TREND_PAGES.map((p) => ({ url: base + p, lastModified: new Date(trends.as_of), priority: 0.8 })),
    { url: `${base}/insights`, lastModified: buildTime, priority: 0.8 },
    ...INSIGHTS.map((i) => ({ url: `${base}/insights/${i.slug}`, lastModified: new Date(i.dataAsOf), priority: 0.8 })),
    { url: `${base}/regions/guangdong`, lastModified: buildTime, priority: 0.8 },
    { url: `${base}/changelog`, lastModified: buildTime, priority: 0.4 },
    { url: `${base}/about`, lastModified: buildTime, priority: 0.4 },
  ];
}
