import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://console.lumina-core.cn";
  return ["", "/changelog", "/about", "/login", "/register"].map((p) => ({ url: base + p }));
}
