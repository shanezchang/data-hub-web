# data-hub-web 前端重建设计（v1.0）

日期：2026-06-10
状态：已与 Shane 逐节确认

## 背景与问题

当前前端是零依赖静态站（`index.html` + `app.js` + `styles.css`），存在四个确认的问题：

1. **无 URL 路由**：`navTo()`/`showView()` 只切换 `<section>` 的 `hidden` 属性，从不操作 history/location。地址永远是 `https://console.lumina-core.cn/`，后退/前进失效，无法深链，SEO 只见落地页。
2. **主页与控制台无形态区分**：所有视图共用同一 `<main>` 和顶栏，登录前后只换导航按钮，控制台没有应用外壳。
3. **无 loading 态**：表单提交按钮无 pending 状态可重复点击；带 token 刷新时先闪落地页再切控制台；生成 key 用原生 `prompt()`、吊销用原生 `confirm()`。
4. **主页内容单薄**：Hero 一句话 + 3 个 feature 卡，核心数据资产（56,350 条新闻、5,956 家 YC 公司、11,258 位创始人）没有展示。

## 目标与受众

- **受众**：真实开发者用户。主页要让陌生开发者快速理解数据能力、看到真实数据样例、愿意注册试用。
- **成功标准**：每个页面有独立 URL；登录后进入形态独立的控制台；所有异步操作有可见的等待反馈；主页内容密度达到正经数据 API 产品的水准。

## 技术决策

| 维度 | 决定 | 理由 |
|---|---|---|
| 框架 | Next.js（App Router） | 落地页需要 SEO（静态预渲染），控制台是客户端应用；Vercel 原生支持；与 Sayly 技术栈一致 |
| 迁移策略 | 原仓库原地重建 | git 历史连续，Vercel 项目/域名/rewrites 不动；Vercel preview 验收后 merge main 一次性上线 |
| 样式 | Tailwind CSS v4 + CSS 变量主题 token | 双主题只换颜色变量，不换排版 |
| 数据获取 | SWR | 轻量、自带缓存/重新验证/`isLoading`；控制台各页共享 `/portal/me` 缓存 |
| 鉴权 | token 继续 localStorage | 与现状一致，后端零改动；httpOnly cookie 不在本期范围 |
| API 代理 | `vercel.json` rewrites 迁至 `next.config.ts` | 前端仍只调 `/api/*`，后端零改动 |

## 路由与页面结构

```
app/
├─ layout.tsx              全局布局：字体、主题 Provider、顶栏/页脚
├─ page.tsx                / 落地页（静态生成）
├─ changelog/page.tsx      /changelog 更新日志（读 changelog.json）
├─ about/page.tsx          /about 关于
├─ (auth)/
│  ├─ login/page.tsx       /login
│  ├─ register/page.tsx    /register
│  └─ reset/page.tsx       /reset 找回密码
└─ dashboard/
   ├─ layout.tsx           侧边栏应用壳 + 鉴权守卫
   ├─ page.tsx             /dashboard 概览（统计 + 30 天图表）
   ├─ keys/page.tsx        /dashboard/keys API Key 管理
   ├─ usage/page.tsx       /dashboard/usage 用量明细
   └─ settings/page.tsx    /dashboard/settings 昵称 + 改密码
```

- 落地页 / 更新日志 / 关于：静态预渲染，SEO meta、OG 资产沿用现有素材。
- 控制台：全部客户端渲染。
- 已登录访问 `/`：不强制跳转，顶栏显示「进入控制台」（Stripe 模式）。
- 已登录访问 `/login`、`/register`：重定向 `/dashboard`。
- 未登录访问 `/dashboard/*`：重定向 `/login`。

## 控制台外壳（已选定：侧边栏布局）

Stripe/Vercel 式开发者控制台：顶栏（品牌 + 用户邮箱 + 退出）、左侧固定导航（概览 / API Keys / 用量 / 设置 / 文档外链）、右侧工作区。与营销页彻底区分形态。移动端侧边栏折叠为抽屉。

## 鉴权与错误处理

沿用 v0.3.1 修正过的语义，集中在 `dashboard/layout.tsx` 守卫与统一请求层：

- 无 token → 重定向 `/login`。
- `/portal/me` 返回 401/403 → 清 token、重定向 `/login`、toast「登录已失效」。
- 网络错误 / 5xx → **保留会话**，显示错误态 + 重试入口，不清 token。
- 服务端字段一律经转义/安全渲染（React 默认行为覆盖现有 `escapeHtml` 的职责）。

## Loading 态与交互规范

- **路由级**：dashboard 布局在 `/portal/me` 解析期间显示骨架屏（侧边栏 + 内容灰块），消灭「闪落地页」。
- **按钮级**：所有提交按钮统一 pending 状态（禁用 + 内联 spinner + 文案如「登录中…」），请求期间不可重复提交。「发送验证码」保留 60s 倒计时。
- **数据级**：统计数字、图表、key 表格加载时骨架占位。
- **弹窗**：自建 Modal 组件替换原生弹窗——生成 key 用命名弹窗；吊销用确认弹窗（显示 key 名称防误操作）。新 key 一次性展示 + 复制按钮逻辑保留。
- **toast**：组件化保留，成功/错误两种样式。

## 主题系统

- `<html data-theme="light|dark">` + CSS 变量（`--bg`、`--fg`、`--muted`、`--accent`、代码高亮 token 等）。
- **默认白天**；顶栏切换按钮；选择持久化到 localStorage。
- 白天：暖白底（`#faf9f7` 系）+ 浅色语法高亮；黑夜：GitHub Dark 系（`#0d1117` 底）+ 深色语法高亮。
- 排版两主题完全一致：正文无衬线（系统栈 + PingFang SC），JetBrains Mono 仅用于代码块与数字。

## 主页内容结构（七区块全选）

1. **Hero**：标题 + 一句话价值 + 注册/文档 CTA + curl 示例 + 数据规模数字（56,350 / 5,956 / 11,258）。
2. **数据集卡片**：每数据集一张大卡（名称、规模、时间跨度、更新频率、示例查询、文档链接），CCTV 新闻联播 + YC 公司目录，留扩展位。
3. **快速上手三步**：注册 → 生成 key → 一行 curl，每步配代码片段。
4. **真实响应示例**：真实 API 请求与 JSON 响应展示，语法高亮、可切换数据集；用**构建时打包的静态快照**，不实时调 API。
5. **限流与免费额度说明**：免费 key 限流（60/min）、数据范围，透明展示。
6. **FAQ**：数据来源合规、更新频率、商用许可、如何提需求等 4-6 条（文案口径实现时与 Shane 确认）。
7. **页脚**：更新日志 / 关于 / API 文档 / 联系 / 版本号（版本号仍从 changelog.json 读取）。

## 保留资产

- `changelog.json` 数据格式与渲染逻辑（迁为组件）。
- favicon / OG 图 / manifest 等 SEO 素材。
- 后端 API 契约（`/portal/*`）完全不动。

## 测试与验收

- **Playwright**：核心链路——公开页路由跳转与回退、主题切换持久化、未登录访问 /dashboard 重定向、登录→控制台→生成 key（mock API）流程、按钮 pending 不可重复提交。
- **Lighthouse**：上线前检查落地页 SEO / 性能。
- **上线流程**：Vercel preview 验收 → merge main → 生产验证（公网 curl + 浏览器走查）。

## 不在本期范围

- httpOnly cookie 会话改造
- 后端任何改动
- 新数据集接入
- 国际化（站点保持中文）
