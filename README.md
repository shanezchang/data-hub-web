# data-hub-web

data·hub 的站点前端 —— 营销主页 + 用户控制台（注册 / 登录 / API key 管理 / 用量）。

**技术栈**：Next.js（App Router）+ TypeScript + Tailwind CSS v4 + shadcn/ui（vendored）+ lucide-react + SWR。
部署 Vercel，`next.config.ts` 的 rewrites 把 `/api/*` 服务端反代到后端
（避开 mixed-content，免备案 HTTPS）。

## 结构

```
app/
  (site)/            营销页:主页 / 更新日志 / 关于 / 登录 / 注册 / 重置密码(静态预渲染)
  dashboard/         控制台:概览 / API Keys / 用量 / 设置(客户端渲染,鉴权守卫)
components/
  ui/                shadcn/ui 基础件(vendored,代码归仓库所有,可直接改) + toast/nav-link
  landing/           落地页区块;auth/ 认证表单;dashboard/ 控制台组件
lib/                 api 封装(JWT localStorage) / SWR hooks / JSON 高亮 / 响应快照
e2e/                 Playwright 测试(路由/主题/守卫/控制台流程,API 全 mock)
public/              favicon / og / changelog.json(版本事实源)
```

## 设计系统

- **token**:`app/globals.css` 单一事实源。shadcn 语义命名(`--background/--foreground/--muted-foreground/--border` 等),
  值为暖纸面亮色 + GitHub 暗色;绿色品牌色 `--brand`(文字/图标强调用 `text-brand`,不要用 shadcn 的 `--accent`,那是 hover 背景)
- **组件**:优先用 `components/ui/` 的 shadcn 基础件(Button/Input/Label/Dialog/Table/Badge/Card…),新增用 `npx shadcn add <name>`;
  Button 扩展了 `pending/pendingText`(请求态 spinner)
- **图标**:lucide-react,禁止新增内联 SVG(自研图表 `trends/charts.tsx` 除外)
- **风格基调**:开发者工具气质——克制、清晰、快;不堆渐变,层次靠 `bg-card + border + shadow-xs` 卡片语言

## 常用命令

```bash
npm run dev          # 开发(默认 3000)
npm run build        # 生产构建
npm run test:e2e     # Playwright 全量(自动起 3100 端口 dev server)
```

## 主题

`<html data-theme="light|dark">` + CSS 变量（globals.css），默认白天，
切换持久化到 `localStorage.datahub_theme`。两主题只换颜色不换排版。

## 后端

后端在 `shanezchang/data-hub`，门户接口 `/portal/*`，数据接口 `/v1/*`。
当前回源地址：`https://www.lumina-core.cn`（rewrite 目标，换地址改 `next.config.ts`）。

## 部署

Vercel 自动识别 Next.js，push 即部署；`main` 分支对应生产域名
`console.lumina-core.cn`。
