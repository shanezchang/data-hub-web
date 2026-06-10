import { test, expect } from "@playwright/test";

test("落地页七区块齐全", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/data·hub/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("结构化数据");
  for (const t of ["数据集", "三步接入", "真实响应", "限流与额度", "常见问题"]) {
    await expect(page.getByRole("heading", { name: new RegExp(t) })).toBeVisible();
  }
});

test("路由独立 URL + 浏览器回退", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "更新日志" }).first().click();
  await expect(page).toHaveURL(/\/changelog$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("响应示例可切换数据集", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "YC 公司目录" }).click();
  await expect(page.locator("#response-demo")).toContainText("one_liner");
});
