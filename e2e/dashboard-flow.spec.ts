import { test, expect, type Page } from "@playwright/test";

const ME = { email: "t@example.com", name: "Tester" };
const USAGE = {
  total: 1234,
  today: 56,
  daily: Array.from({ length: 30 }, (_, i) => ({ date: `2026-05-${String(i + 1).padStart(2, "0")}`, count: i })),
  by_key: [{ name: "我的应用", count: 1200 }],
};
const KEYS = [{ id: 1, name: "我的应用", key_prefix: "dh_abc12345", scopes: ["news:read"], rate_limit_per_min: 60, revoked: false }];
const REQUESTS = {
  total: 2,
  items: [
    { ts: "2026-06-10T12:30:00+00:00", key_id: 1, key_name: "我的应用", method: "GET", path: "/v1/news", query: "q=新能源&limit=3", body: null, status: 200, duration_ms: 18 },
    { ts: "2026-06-10T12:29:00+00:00", key_id: 1, key_name: "我的应用", method: "POST", path: "/v1/yc/companies/search", query: null, body: '{"all":["agent"]}', status: 429, duration_ms: 2 },
  ],
};

async function mockPortal(page: Page, keys: unknown = KEYS) {
  await page.addInitScript(() => localStorage.setItem("datahub_token", "tok_e2e"));
  await page.route("**/api/portal/me", (r) => r.fulfill({ json: ME }));
  await page.route("**/api/portal/usage*", (r) => r.fulfill({ json: USAGE }));
  await page.route("**/api/portal/requests*", (r) => r.fulfill({ json: REQUESTS }));
  await page.route("**/api/portal/keys", (r) =>
    r.request().method() === "GET"
      ? r.fulfill({ json: keys })
      : r.fulfill({ json: { id: 2, api_key: "dh_newkey_full_value_0001" } }),
  );
}

test("概览展示统计与图表", async ({ page }) => {
  await mockPortal(page);
  await page.goto("/dashboard");
  await expect(page.getByText("1,234")).toBeVisible();
  await expect(page.getByText("56", { exact: true })).toBeVisible();
  await expect(page.locator("[data-chart] span").first()).toBeVisible();
});

test("用量页有按 key 明细", async ({ page }) => {
  await mockPortal(page);
  await page.goto("/dashboard/usage");
  await expect(page.getByText("我的应用").first()).toBeVisible();
  await expect(page.getByText("1,200")).toBeVisible();
});

test("用量页展示最近调用日志(接口/状态/耗时)", async ({ page }) => {
  await mockPortal(page);
  await page.goto("/dashboard/usage");
  const log = page.getByTestId("request-log");
  await expect(log.getByText("/v1/news")).toBeVisible();
  await expect(log.getByText("q=新能源&limit=3")).toBeVisible();
  await expect(log.getByText("429")).toBeVisible();
  await expect(log.getByText("18ms")).toBeVisible();
});

test("生成 key:命名弹窗 → 一次性展示 → 复制", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await mockPortal(page, []);
  await page.goto("/dashboard/keys");
  await expect(page.getByText("还没有 key")).toBeVisible();
  await page.getByRole("button", { name: "生成新 Key" }).click();
  await page.getByLabel("Key 名称").fill("测试应用");
  await page.getByRole("button", { name: "生成", exact: true }).click();
  await expect(page.getByText("dh_newkey_full_value_0001")).toBeVisible();
  await page.getByRole("button", { name: "复制" }).click();
  await expect(page.getByText("已复制")).toBeVisible();
});

test("移动端:抽屉导航可用", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockPortal(page);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "菜单" }).click();
  await page.getByRole("link", { name: "API Keys" }).click();
  await expect(page).toHaveURL(/\/dashboard\/keys/);
});

test("吊销 key:确认弹窗", async ({ page }) => {
  await mockPortal(page);
  await page.route("**/api/portal/keys/1", (r) => r.fulfill({ json: { ok: true } }));
  await page.goto("/dashboard/keys");
  await page.getByRole("button", { name: "吊销", exact: true }).click();
  await expect(page.getByText(/吊销后该 key 立即失效/)).toBeVisible();
  await page.getByRole("button", { name: "确认吊销" }).click();
  await expect(page.getByText("已吊销")).toBeVisible();
});
