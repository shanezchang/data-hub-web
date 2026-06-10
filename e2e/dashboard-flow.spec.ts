import { test, expect, type Page } from "@playwright/test";

const ME = { email: "t@example.com", name: "Tester" };
const USAGE = {
  total: 1234,
  today: 56,
  daily: Array.from({ length: 30 }, (_, i) => ({ date: `2026-05-${String(i + 1).padStart(2, "0")}`, count: i })),
  by_key: [{ name: "我的应用", count: 1200 }],
};
const KEYS = [{ id: 1, name: "我的应用", key_prefix: "dh_abc12345", scopes: ["news:read"], rate_limit_per_min: 60, revoked: false }];

async function mockPortal(page: Page, keys: unknown = KEYS) {
  await page.addInitScript(() => localStorage.setItem("datahub_token", "tok_e2e"));
  await page.route("**/api/portal/me", (r) => r.fulfill({ json: ME }));
  await page.route("**/api/portal/usage*", (r) => r.fulfill({ json: USAGE }));
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
  await expect(page.getByText("我的应用")).toBeVisible();
  await expect(page.getByText("1,200")).toBeVisible();
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

test("吊销 key:确认弹窗", async ({ page }) => {
  await mockPortal(page);
  await page.route("**/api/portal/keys/1", (r) => r.fulfill({ json: { ok: true } }));
  await page.goto("/dashboard/keys");
  await page.getByRole("button", { name: "吊销", exact: true }).click();
  await expect(page.getByText(/吊销后该 key 立即失效/)).toBeVisible();
  await page.getByRole("button", { name: "确认吊销" }).click();
  await expect(page.getByText("已吊销")).toBeVisible();
});
