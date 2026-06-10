import { test, expect } from "@playwright/test";

// 修复:fetch 无超时 → 请求挂死(代理/网络抖动)时 SWR in-flight 去重永久卡住,
// 页面"无响应"且切 tab 不再发起请求。加 AbortController 超时后,
// 挂起请求应在超时窗口内转为网络错误(status=0 语义,UI 给出重试)。

test("请求挂起时在超时窗口内给出错误反馈,而非永久 pending", async ({ page }) => {
  test.setTimeout(40_000);
  await page.route("**/api/portal/**", async (route) => {
    // 模拟挂死:永不响应(40s 后兜底 abort,远大于前端超时)
    await new Promise((r) => setTimeout(r, 40_000));
    await route.abort();
  });
  await page.addInitScript(() => localStorage.setItem("datahub_token", "tok"));
  await page.goto("/dashboard/usage");
  // 前端超时(12s)+缓冲:应出现网络错误的重试入口,而不是一直骨架屏
  await expect(page.getByRole("button", { name: "重试" })).toBeVisible({ timeout: 20_000 });
});
