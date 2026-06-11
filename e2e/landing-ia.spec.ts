import { test, expect } from "@playwright/test";

// v0.6.0 信息架构:顶部全局导航、Agent 接入区块、重复信息收敛、跳转 pending 态

test("header 全局导航:数据集/Agent 接入/文档/更新日志/关于", async ({ page }) => {
  await page.goto("/");
  const header = page.locator("header");
  for (const name of ["数据集", "Insights", "Regions", "Agent 接入", "更新日志", "关于"]) {
    await expect(header.getByRole("link", { name })).toBeVisible();
  }
  await expect(header.getByRole("link", { name: "文档" })).toHaveAttribute("href", /api\.lumina-core\.cn\/docs/);
});

test("header 锚点直达落地页区块", async ({ page }) => {
  await page.goto("/");
  await page.locator("header").getByRole("link", { name: "Agent 接入" }).click();
  await expect(page).toHaveURL(/#agents$/);
  await expect(page.locator("#agents")).toBeInViewport();
});

test("移动端:汉堡菜单包含全部页面入口", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "打开菜单" }).click();
  await page.getByTestId("mobile-menu").getByRole("link", { name: "关于" }).click();
  await expect(page).toHaveURL(/\/about$/);
});

test("Agent 接入区块:llms.txt 三层入口可见", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#agents");
  await expect(section.getByRole("heading", { name: /AI Agent/ })).toBeVisible();
  await expect(section).toContainText("api.lumina-core.cn/llms.txt");
  await expect(section).toContainText("openapi.json");
  await expect(section).toContainText("X-API-Key");
});

test("重复信息收敛:落地页 mailto 只在 footer 出现一次", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
  // FAQ 不再与「限流与额度」区块重复
  await expect(page.locator("main")).not.toContainText("有免费额度吗");
});

test("页面跳转有 pending 指示", async ({ page }) => {
  await page.goto("/");
  // 拖慢 /about 的 RSC 载荷,让 pending 态可观测
  await page.route("**/about**", async (route) => {
    await new Promise((r) => setTimeout(r, 1200));
    await route.continue();
  });
  await page.locator("header").getByRole("link", { name: "关于" }).click();
  await expect(page.getByTestId("nav-pending").first()).toBeVisible();
  await expect(page).toHaveURL(/\/about$/);
});
