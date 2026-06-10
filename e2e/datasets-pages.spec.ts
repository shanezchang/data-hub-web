import { test, expect } from "@playwright/test";

// v0.7.0:数据集子页面 + 文案克制(不硬编码会过时的数据量)

test("主页数据集卡片进入子页面", async ({ page }) => {
  await page.goto("/");
  await page.locator("#datasets").getByRole("link", { name: /新闻联播/ }).click();
  await expect(page).toHaveURL(/\/datasets\/news$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("新闻联播");
});

test("news 子页面列出该数据集全部端点", async ({ page }) => {
  await page.goto("/datasets/news");
  for (const path of ["/v1/news", "/v1/news/search", "/v1/news/stats/daily", "/v1/news/{id}"]) {
    await expect(page.getByText(path, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("news:read")).toBeVisible();
});

test("yc 子页面列出该数据集全部端点", async ({ page }) => {
  await page.goto("/datasets/yc");
  for (const path of ["/v1/yc/companies", "/v1/yc/companies/search", "/v1/yc/companies/{slug}", "/v1/yc/founders"]) {
    await expect(page.getByText(path, { exact: true })).toBeVisible();
  }
});

test("policy 子页面列出该数据集全部端点", async ({ page }) => {
  await page.goto("/datasets/policy");
  for (const path of ["/v1/policy", "/v1/policy/search", "/v1/policy/{id}"]) {
    await expect(page.getByText(path, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("policy:read")).toBeVisible();
});

test("未知数据集返回 404", async ({ page }) => {
  const res = await page.goto("/datasets/nope");
  expect(res?.status()).toBe(404);
});

test("主页不再硬编码具体数据量", async ({ page }) => {
  await page.goto("/");
  const body = await page.locator("main").textContent();
  for (const n of ["56,350", "5,956", "11,258", "99.9%"]) {
    expect(body).not.toContain(n);
  }
});
