import { test, expect } from "@playwright/test";
import { DATASETS } from "../lib/datasets";

// v0.7.0:数据集子页面 + 文案克制(不硬编码会过时的数据量)

test("主页数据集卡片进入子页面", async ({ page }) => {
  await page.goto("/");
  await page.locator("#datasets").getByRole("link", { name: /新闻联播/ }).click();
  await expect(page).toHaveURL(/\/datasets\/news$/);
  // v0.9.x:H1 改英文搜索词标题,中文名降为副标题
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Xinwen Lianbo");
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

const addedDatasets = [
  {
    slug: "opinion",
    scope: "opinion:read",
    endpoints: ["/v1/opinion", "/v1/opinion/search", "/v1/opinion/topics", "/v1/opinion/{id}"],
  },
  {
    slug: "metals",
    scope: "metals:read",
    endpoints: ["/v1/metals", "/v1/metals/search", "/v1/metals/symbols", "/v1/metals/{id}"],
  },
  {
    slug: "housing",
    scope: "housing:read",
    endpoints: [
      "/v1/housing/prices",
      "/v1/housing/prices/search",
      "/v1/housing/cities",
      "/v1/housing/prices/{row_id}",
    ],
  },
];

for (const dataset of addedDatasets) {
  test(`${dataset.slug} 子页面与后端端点同步`, async ({ page }) => {
    await page.goto(`/datasets/${dataset.slug}`);
    for (const path of dataset.endpoints) {
      await expect(page.getByText(path, { exact: true })).toBeVisible();
    }
    await expect(page.getByText(dataset.scope)).toBeVisible();
  });
}

test("主页展示六个已有数据的数据集", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#datasets article")).toHaveCount(6);
  await expect(page.locator('#datasets a[href="/datasets/housing"]').first()).toBeVisible();
  await expect(page.locator('#datasets a[href="/datasets/macro"]')).toHaveCount(0);
});

test("生产数据为空的 macro 暂不公开", async ({ page }) => {
  const res = await page.goto("/datasets/macro");
  expect(res?.status()).toBe(404);

  const sitemap = await page.request.get("/sitemap.xml");
  const sitemapBody = await sitemap.text();
  expect(sitemapBody).toContain("/datasets/housing");
  expect(sitemapBody).not.toContain("/datasets/macro");
});

test("curl 示例可直接复制，长期房价序列不被默认分页截断", () => {
  for (const dataset of DATASETS) {
    expect(dataset.exampleCurl).not.toContain("\n+");
  }
  expect(DATASETS.find((dataset) => dataset.slug === "housing")?.exampleCurl).toContain(
    "limit=500",
  );
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
