import { test, expect } from "@playwright/test";

// SEO 修缮包 + 英文 programmatic 趋势页

test("新闻联播关键词趋势页(英文)渲染图表与方法论", async ({ page }) => {
  await page.goto("/trends/xinwen-lianbo-keywords");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Xinwen Lianbo Keyword Trends");
  await expect(page.getByRole("heading", { name: "Methodology" })).toBeVisible();
  // 每个关键词一张 SVG 折线图
  expect(await page.locator("svg[role=img]").count()).toBeGreaterThanOrEqual(8);
});

test("YC 批次存活页(英文)渲染堆叠条与表格", async ({ page }) => {
  await page.goto("/trends/yc-batch-survival");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Batch Survival");
  await expect(page.getByRole("cell", { name: "Acquired" }).or(page.getByRole("columnheader", { name: "Acquired" }))).toBeVisible();
});

test("dataset 页带 JSON-LD Dataset 结构化数据与英文标题", async ({ page }) => {
  await page.goto("/datasets/policy");
  const lds = await page.locator('script[type="application/ld+json"]').allTextContents();
  const datasetLd = lds.find((t) => t.includes('"Dataset"'));
  expect(datasetLd).toBeTruthy();
  expect(datasetLd).toContain("State Council");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("State Council");
});

test("about 页数据集名单从注册表渲染(含 policy)", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("link", { name: /国务院政策文件库/ })).toBeVisible();
});

test("/llms.txt 重定向到 api 域", async ({ page }) => {
  const res = await page.request.get("/llms.txt", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toBe("https://api.lumina-core.cn/llms.txt");
});

test("sitemap 不含鉴权页且含趋势页", async ({ page }) => {
  const res = await page.request.get("/sitemap.xml");
  const xml = await res.text();
  expect(xml).not.toContain("/login");
  expect(xml).not.toContain("/register");
  expect(xml).toContain("/trends/xinwen-lianbo-keywords");
  expect(xml).toContain("/trends/yc-batch-survival");
});

test("insights 索引页列出全部发现", async ({ page }) => {
  await page.goto("/insights");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Data Insights");
  await expect(page.getByRole("link", { name: /New Quality Productive Forces/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /vocabulary handoff/ })).toBeVisible();
});

test("新质生产力 insight 页渲染双线图与方法论", async ({ page }) => {
  await page.goto("/insights/new-quality-productive-forces");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("cold start");
  await expect(page.getByRole("heading", { name: "Methodology" })).toBeVisible();
  await expect(page.locator("svg[role=img]").first()).toBeVisible();
});

test("交接棒 insight 页渲染消退词电池", async ({ page }) => {
  await page.goto("/insights/policy-vocabulary-handoff");
  await expect(page.getByRole("heading", { name: /Capacity reduction/ })).toBeVisible();
  expect(await page.locator("svg[role=img]").count()).toBeGreaterThanOrEqual(5);
});

test("建交 insight 页:八国图表+公告原文链接", async ({ page }) => {
  await page.goto("/insights/diplomatic-switches");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("diplomatic switches");
  expect(await page.locator("svg[role=img]").count()).toBeGreaterThanOrEqual(8);
  const cctvLinks = page.locator('a[href*="tv.cctv.com"]');
  expect(await cctvLinks.count()).toBeGreaterThanOrEqual(8);
});
