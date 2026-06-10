import { test, expect } from "@playwright/test";

const ME = { email: "t@example.com", name: "Tester" };

test("未登录访问 /dashboard 重定向 /login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("已登录访问 /login 跳转控制台", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("datahub_token", "tok_e2e"));
  await page.route("**/api/portal/me", (r) => r.fulfill({ json: ME }));
  await page.route("**/api/portal/keys", (r) => r.fulfill({ json: [] }));
  await page.route("**/api/portal/usage*", (r) => r.fulfill({ json: { total: 0, today: 0, daily: [], by_key: [] } }));
  await page.goto("/login");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("token 失效(401):清会话并回登录页", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("datahub_token", "tok_expired"));
  await page.route("**/api/portal/me", (r) => r.fulfill({ status: 401, json: { detail: "Invalid token" } }));
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  expect(await page.evaluate(() => localStorage.getItem("datahub_token"))).toBeNull();
});

test("网络错误:保留会话并提供重试", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("datahub_token", "tok_e2e"));
  await page.route("**/api/portal/me", (r) => r.abort());
  await page.goto("/dashboard");
  await expect(page.getByText(/无法连接服务器/)).toBeVisible();
  await expect(page.getByRole("button", { name: "重试" })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("datahub_token"))).toBe("tok_e2e");
});

test("登录按钮有 pending 态且不可重复提交", async ({ page }) => {
  await page.route("**/api/portal/login", async (r) => {
    await new Promise((res) => setTimeout(res, 800));
    await r.fulfill({ json: { access_token: "tok_e2e" } });
  });
  await page.route("**/api/portal/me", (r) => r.fulfill({ json: ME }));
  await page.route("**/api/portal/keys", (r) => r.fulfill({ json: [] }));
  await page.route("**/api/portal/usage*", (r) => r.fulfill({ json: { total: 0, today: 0, daily: [], by_key: [] } }));
  await page.goto("/login");
  await page.getByLabel("邮箱").fill("t@example.com");
  await page.getByLabel("密码").fill("password123");
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page.getByRole("button", { name: /登录中/ })).toBeDisabled();
  await expect(page).toHaveURL(/\/dashboard/);
});
