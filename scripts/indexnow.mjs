#!/usr/bin/env node
// IndexNow 即时收录推送(零成本):内容更新后,主动告诉 Bing/Yandex 等
// 支持 IndexNow 的搜索引擎来抓,而非被动等下一轮爬取。Google 不参与 IndexNow,
// 仍靠 sitemap + GSC。
//
// 触发时机:Vercel 生产构建的 postbuild 阶段(见 package.json)。preview 部署
// 与本地构建不推送(避免把未上线的草稿喂给搜索引擎)。
//
// 设计取舍:URL 列表直接拉线上 sitemap.xml 解析 <loc>,与 app/sitemap.ts 自动
// 同步,无需在两处维护清单。新部署里"全新页面"要到下次部署才进列表——可接受,
// 因为内容更新多为既有页面的数据刷新。
//
// KEY 公开托管在 public/<KEY>.txt(IndexNow 用它证明域名归属,本就是公开值,
// 非密钥),与下方 KEY 必须一致。
//
// 失败一律软退出(exit 0):收录推送是加分项,绝不该拖垮构建。

const KEY = "a7f3c9e21b6d4805ad2f9c0e7b18d3f4";
// 与 lib/site.ts 的 SITE_URL 保持一致(构建脚本无法直接 import TS,故此处独立声明)。
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://console.lumina-core.cn";
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function main() {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    console.log(`[indexnow] skip: VERCEL_ENV=${process.env.VERCEL_ENV}(仅生产部署推送)`);
    return;
  }

  const host = new URL(SITE_URL).host;
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;

  let xml;
  try {
    const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (e) {
    console.log(`[indexnow] skip: 拉取 ${sitemapUrl} 失败(${e.message})`);
    return;
  }

  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) {
    console.log("[indexnow] skip: sitemap 未解析到 URL");
    return;
  }

  const body = { host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    // IndexNow 约定:200/202 = 已受理。
    console.log(`[indexnow] 推送 ${urlList.length} 条 URL → HTTP ${res.status}`);
  } catch (e) {
    console.log(`[indexnow] 推送失败(${e.message}),已忽略`);
  }
}

main().catch((e) => {
  console.log(`[indexnow] 未捕获异常(${e.message}),已忽略`);
});
