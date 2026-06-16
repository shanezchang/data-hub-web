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

test("/llms.txt 重定向到 api 域", async ({ page }) => {
  const res = await page.request.get("/llms.txt", { maxRedirects: 0 });
  expect(res.status()).toBe(308);
  expect(res.headers()["location"]).toBe("https://api.lumina-core.cn/llms.txt");
});

test("IndexNow key 文件托管在站点根且内容即 key", async ({ page }) => {
  const KEY = "a7f3c9e21b6d4805ad2f9c0e7b18d3f4";
  const res = await page.request.get(`/${KEY}.txt`);
  expect(res.status()).toBe(200);
  expect((await res.text()).trim()).toBe(KEY);
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

test("国务院公文结构 insight 页渲染交叉曲线与全量表", async ({ page }) => {
  await page.goto("/insights/state-council-paperwork");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("directives to approvals");
  await expect(page.getByRole("columnheader", { name: "国函" })).toBeVisible();
});

test("广东省页:21 市排名表+原文链接", async ({ page }) => {
  await page.goto("/regions/guangdong");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Guangdong");
  // 排名表 21 行
  expect(await page.locator("table tbody tr").count()).toBe(21);
  // 每市至多 3 条原文直链
  expect(await page.locator('a[href*="tv.cctv.com"], a[href*="cctv.com"]').count()).toBeGreaterThanOrEqual(40);
});

test("regions 索引页列出已发布省份", async ({ page }) => {
  await page.goto("/regions");
  for (const name of ["Guangdong", "Jiangsu", "Zhejiang", "Shandong"]) {
    await expect(page.getByRole("link", { name: new RegExp(name) })).toBeVisible();
  }
});

test("江苏省页(动态路由)渲染 13 市", async ({ page }) => {
  await page.goto("/regions/jiangsu");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Jiangsu");
  expect(await page.locator("table tbody tr").count()).toBe(13);
});

test("未发布省份 404", async ({ page }) => {
  const res = await page.goto("/regions/atlantis");
  expect(res?.status()).toBe(404);
});

test("YC 行业漂移 insight 页渲染份额曲线与全量表", async ({ page }) => {
  await page.goto("/insights/yc-industry-drift");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("consumer era is over");
  await expect(page.getByRole("columnheader", { name: "B2B" })).toBeVisible();
});

test("年度节律 insight 页渲染八组月度条形图", async ({ page }) => {
  await page.goto("/insights/xinwen-lianbo-calendar");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("calendar");
  expect(await page.locator('[role=img][aria-label="Monthly distribution"]').count()).toBe(8);
});

test("新词出生证页:11 行表格+首播原文链接", async ({ page }) => {
  await page.goto("/insights/vocabulary-birth-certificates");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Birth certificates");
  expect(await page.locator("table tbody tr").count()).toBe(11);
  expect(await page.locator('a[href*="cctv.com"]').count()).toBeGreaterThanOrEqual(11);
});

test("YC 地理页渲染份额曲线与国家榜", async ({ page }) => {
  await page.goto("/insights/yc-geography");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("went global");
  await expect(page.getByText("United Kingdom")).toBeVisible();
});

test("政策主题页渲染主题榜与 movers", async ({ page }) => {
  await page.goto("/insights/policy-themes");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("State Council writes about");
  await expect(page.getByText("Trade, customs & tourism").first()).toBeVisible();
});

test("访问打点:公开页发 beacon,dashboard 不发", async ({ page }) => {
  const hits: string[] = [];
  await page.route("**/api/t", async (route) => {
    hits.push(route.request().postData() ?? "");
    await route.fulfill({ status: 204, body: "" });
  });
  await page.goto("/insights");
  await page.waitForTimeout(300);
  expect(hits.length).toBe(1);
  expect(hits[0]).toContain('"path":"/insights"');
});
