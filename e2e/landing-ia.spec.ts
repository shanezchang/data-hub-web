import { test, expect } from "@playwright/test";

// v0.6.0 信息架构:顶部全局导航、Agent 接入区块、重复信息收敛、跳转 pending 态

test("header 全局导航:数据集/Insights/Regions/更新日志/文档", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  for (const name of ["数据集", "Insights", "Regions", "更新日志"]) {
    await expect(header.getByRole("link", { name })).toBeVisible();
  }
  // v0.12.0:「文档」改指站内接入指南(/docs),Swagger 从指南页再外链
  await expect(header.getByRole("link", { name: "文档" })).toHaveAttribute("href", "/docs");
});

test("接入指南 /docs:拿 key→调用→额度→agent 入口齐全", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("接入指南");
  await expect(page.locator("main")).toContainText("X-API-Key");
  await expect(page.locator("main")).toContainText("1000 次/天");
  await expect(page.locator("main")).toContainText("api.lumina-core.cn/llms.txt");
  // 四个数据集都有入口
  for (const slug of ["news", "yc", "policy", "opinion"]) {
    await expect(page.locator("main").getByRole("link", { name: slug })).toBeVisible();
  }
});

test("header 锚点直达落地页区块", async ({ page }) => {
  await page.goto("/");
  await page.locator("header").getByRole("link", { name: "数据集" }).click();
  await expect(page).toHaveURL(/#datasets$/);
  await expect(page.locator("#datasets")).toBeInViewport();
});

test("移动端:汉堡菜单包含全部页面入口", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "打开菜单" }).click();
  await page.getByTestId("mobile-menu").getByRole("link", { name: "更新日志" }).click();
  await expect(page).toHaveURL(/\/changelog$/);
});

test("Agent 接入区块:llms.txt 三层入口可见", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#agents");
  await expect(section.getByRole("heading", { name: /AI Agent/ })).toBeVisible();
  await expect(section).toContainText("api.lumina-core.cn/llms.txt");
  await expect(section).toContainText("openapi.json");
  await expect(section).toContainText("X-API-Key");
});

test("联系方式不公开:落地页无 mailto(2026-06-11 Shane 决定)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  // FAQ 不再与「限流与额度」区块重复
  await expect(page.locator("main")).not.toContainText("有免费额度吗");
});

test("页面跳转有 pending 指示", async ({ page }) => {
  await page.goto("/");
  // 拖慢 /changelog 的 RSC 载荷,让 pending 态可观测
  await page.route("**/changelog**", async (route) => {
    await new Promise((r) => setTimeout(r, 1200));
    await route.continue();
  });
  await page.locator("header").getByRole("link", { name: "更新日志" }).click();
  await expect(page.getByTestId("nav-pending").first()).toBeVisible();
  await expect(page).toHaveURL(/\/changelog$/);
});
