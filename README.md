# data-hub-web

data·hub 的站点前端 —— 营销主页 + 用户控制台（注册 / 登录 / API key 管理 / 用量）。

**技术栈**：Next.js（App Router）+ TypeScript + Tailwind CSS v4 + SWR。
部署 Vercel，`next.config.ts` 的 rewrites 把 `/api/*` 服务端反代到后端
（避开 mixed-content，免备案 HTTPS）。

## 结构

```
app/
  (site)/            营销页:主页 / 更新日志 / 关于 / 登录 / 注册 / 重置密码(静态预渲染)
  dashboard/         控制台:概览 / API Keys / 用量 / 设置(客户端渲染,鉴权守卫)
components/          UI 原语(button/modal/toast/skeleton) + 落地页区块 + 控制台组件
lib/                 api 封装(JWT localStorage) / SWR hooks / JSON 高亮 / 响应快照
e2e/                 Playwright 测试(路由/主题/守卫/控制台流程,API 全 mock)
public/              favicon / og / changelog.json(版本事实源)
```

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
当前后端公网地址：`http://120.55.183.188:8000`（rewrite 目标，换地址改 `next.config.ts`）。

## 部署

Vercel 自动识别 Next.js，push 即部署；`main` 分支对应生产域名
`console.lumina-core.cn`。
