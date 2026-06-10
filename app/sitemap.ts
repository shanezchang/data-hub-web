import type { MetadataRoute } from "next";
import { DATASETS } from "@/lib/datasets";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://console.lumina-core.cn";
  const pages = ["", "/changelog", "/about", "/login", "/register", "/reset", ...DATASETS.map((d) => `/datasets/${d.slug}`)];
  return pages.map((p) => ({ url: base + p }));
}
