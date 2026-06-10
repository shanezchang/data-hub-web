# data-hub-web Next.js 重建实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把零依赖静态站重建为 Next.js 应用：独立 URL 路由、侧边栏控制台、白天/黑夜双主题、完整 loading 态、七区块主页。

**Architecture:** App Router；`(site)` 路由组承载营销页+auth 页（共用顶栏/页脚），`dashboard/` 自带侧边栏外壳和鉴权守卫。API 仍走 `/api/*`（rewrites 迁入 next.config.ts），token 留 localStorage，数据层用 SWR。主题用 `<html data-theme>` + CSS 变量，Tailwind v4 语义色映射。

**Tech Stack:** Next.js（latest）+ TypeScript + Tailwind CSS v4 + SWR + @fontsource/jetbrains-mono + Playwright。

**前置事实（已验证 2026-06-10）：**
- node v24.14.0 / npm 11.9.0
- 后端直连 `http://120.55.183.188:8000`（域名网关国内不稳，构建/测试用 IP；生产 rewrite 也指 IP，与旧 vercel.json 一致）
- 真实响应快照已抓好：项目根 `.snap-news.json`（GET /v1/news?q=新能源&limit=2&snippet=true）、`.snap-yc.json`（GET /v1/yc/companies?limit=2）
- test key 在 `~/.config/datahub/test-key`（600 权限，不进 git）
- **不要用 next/font/google**（国内构建拉不到 Google Fonts）；用 `@fontsource/jetbrains-mono`
- 用户已授权全程自主执行，验收通过后直接合 main 上线

---

## 文件地图

```
next.config.ts / postcss.config.mjs / tsconfig.json / package.json / playwright.config.ts
app/
  layout.tsx globals.css                      根布局：主题注入、字体、Toast Provider、SEO metadata
  sitemap.ts robots.ts
  (site)/layout.tsx                           营销外壳：SiteHeader + SiteFooter
  (site)/page.tsx                             落地页（七区块组装）
  (site)/changelog/page.tsx  (site)/about/page.tsx
  (site)/login/page.tsx (site)/register/page.tsx (site)/reset/page.tsx
  dashboard/layout.tsx                        控制台外壳：守卫+侧边栏+骨架
  dashboard/page.tsx                          概览
  dashboard/keys/page.tsx dashboard/usage/page.tsx dashboard/settings/page.tsx
lib/
  auth.ts api.ts hooks.ts                     token / fetch 封装 / SWR hooks
  site.ts                                     站点常量（统计数字、API base、文档链接）
  highlight.ts snippets.ts                    JSON 高亮、预标记 curl 片段
  snapshots/news.json snapshots/yc.json       真实响应快照
components/
  site-header.tsx site-footer.tsx theme-toggle.tsx
  ui/button.tsx ui/modal.tsx ui/toast.tsx ui/skeleton.tsx
  code-block.tsx
  landing/hero.tsx landing/datasets.tsx landing/quickstart.tsx
  landing/response-demo.tsx landing/limits.tsx landing/faq.tsx
  auth/send-code-button.tsx
  dashboard/sidebar.tsx dashboard/usage-chart.tsx dashboard/stat-card.tsx
  dashboard/new-key-modal.tsx dashboard/confirm-modal.tsx
e2e/
  public-routing.spec.ts theme.spec.ts auth-guard.spec.ts dashboard-flow.spec.ts
public/                                       favicon.svg og.png icon-*.png apple-touch-icon.png site.webmanifest changelog.json
_legacy/                                      旧 index.html/app.js/styles.css 暂存，Task 12 删除
```

---

### Task 1: 分支、清场、工程骨架

**Files:** Create: `package.json`(重写) `next.config.ts` `postcss.config.mjs` `tsconfig.json` `app/layout.tsx` `app/globals.css` `app/page.tsx`(占位) ; Move: 旧文件→`_legacy/`、静态资产→`public/`、快照→`lib/snapshots/`

- [ ] **Step 1: 建分支 + 清场**

```bash
cd /Users/shanechang/Documents/Code/GitProjects/github.com/shanezchang/data-hub-web
git checkout -b v1-next
mkdir -p _legacy public lib/snapshots
git mv index.html app.js styles.css _legacy/
git mv favicon.svg og.png icon-192.png icon-512.png apple-touch-icon.png site.webmanifest changelog.json public/
mv .snap-news.json lib/snapshots/news.json
mv .snap-yc.json lib/snapshots/yc.json
rm -f .openapi-tmp.json
```

- [ ] **Step 2: 写 package.json**

```json
{
  "name": "data-hub-web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 3: 装依赖**

```bash
npm install next@latest react@latest react-dom@latest swr @fontsource/jetbrains-mono
npm install -D typescript @types/react @types/react-dom @types/node tailwindcss @tailwindcss/postcss @playwright/test
npx playwright install chromium
```

- [ ] **Step 4: 配置文件**

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://120.55.183.188:8000/:path*" }];
  },
};

export default nextConfig;
```

`postcss.config.mjs`:
```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "_legacy"]
}
```

`.gitignore` 追加：
```
.next/
node_modules/
test-results/
playwright-report/
```

- [ ] **Step 5: 主题 token + 根布局 + 占位首页**

`app/globals.css`:
```css
@import "tailwindcss";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/600.css";

@theme inline {
  --color-bg: var(--bg);
  --color-bg-soft: var(--bg-soft);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}

:root {
  --bg: #faf9f7; --bg-soft: #f1f0ec; --fg: #1a1917; --muted: #6b6862;
  --line: #e3e1da; --accent: #0d7a3f;
  --tok-cmd: #0550ae; --tok-str: #0a6c4a; --tok-url: #953800;
  --tok-punct: #8a8782; --tok-key: #0550ae; --tok-num: #953800;
}
[data-theme="dark"] {
  --bg: #0d1117; --bg-soft: #161b22; --fg: #e6edf3; --muted: #8b949e;
  --line: #30363d; --accent: #7ee787;
  --tok-cmd: #79c0ff; --tok-str: #7ee787; --tok-url: #ffa657;
  --tok-punct: #8b949e; --tok-key: #79c0ff; --tok-num: #ffa657;
}

html { background: var(--bg); color: var(--fg); }
body {
  font-family: -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.tok-cmd { color: var(--tok-cmd); } .tok-str { color: var(--tok-str); }
.tok-url { color: var(--tok-url); } .tok-punct { color: var(--tok-punct); }
.tok-key { color: var(--tok-key); } .tok-num { color: var(--tok-num); }
```

`app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://console.lumina-core.cn"),
  title: { default: "data·hub · 数据 API 控制台", template: "%s · data·hub" },
  description: "data·hub — 可扩展的数据 API 平台。注册即可生成 API key，接入新闻联播、YC 公司目录等数据能力。",
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  openGraph: {
    type: "website", siteName: "data·hub", locale: "zh_CN",
    title: "data·hub · 数据 API 控制台",
    description: "把结构化数据，变成给 AI 调用的接口。注册即可自助生成 API key，一行 curl 就能用。",
    url: "https://console.lumina-core.cn/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "data·hub · 数据 API 控制台", images: ["/og.png"] },
};

const themeInit = `(function(){try{if(localStorage.getItem("datahub_theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#faf9f7" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

`app/page.tsx`（占位，Task 5 重写）:
```tsx
export default function Home() {
  return <main className="p-10 font-mono">data·hub rebuilding…</main>;
}
```

注意：ToastProvider 在 Task 3 才创建，本步先建一个最小版避免编译失败——直接进入 Task 3 Step 1 的 toast.tsx 代码亦可（推荐顺手做掉）。

- [ ] **Step 6: 验证 dev server**

Run: `npm run dev -- --port 3100 &`，然后 `curl -s http://localhost:3100 | grep rebuilding`
Expected: 输出包含 `data·hub rebuilding…`

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "chore: Next.js 工程骨架 + 主题 token + 旧站移入 _legacy"
```

---

### Task 2: UI 原语（Toast / Button / Modal / Skeleton / CodeBlock / highlight）

**Files:** Create: `components/ui/toast.tsx` `components/ui/button.tsx` `components/ui/modal.tsx` `components/ui/skeleton.tsx` `components/code-block.tsx` `lib/highlight.ts` `lib/site.ts`

- [ ] **Step 1: toast.tsx**

```tsx
"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";

type Kind = "ok" | "err" | "";
type ToastItem = { id: number; msg: string; kind: Kind };
const ToastCtx = createContext<(msg: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const toast = useCallback((msg: string, kind: Kind = "") => {
    const id = ++seq.current;
    setItems((p) => [...p, { id, msg, kind }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div key={t.id} role="status"
            className={`rounded-md border px-4 py-2 text-sm shadow-lg bg-bg-soft border-line ${
              t.kind === "err" ? "text-red-600 dark:text-red-400" : t.kind === "ok" ? "text-accent" : "text-fg"}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
```

（注：`dark:` 变体在本项目不可用——主题靠 `data-theme` 而非 class。错误色直接用 CSS 变量写法 `text-[#c0392b] [data-theme=dark]_&:text-[#ff7b72]` 过于绕，简化为统一 `style={{ color: t.kind === "err" ? "var(--err)" : undefined }}`，并在 globals.css 的两个主题块里各加 `--err: #c0392b;` / `--err: #ff7b72;`。实现时以此为准。）

- [ ] **Step 2: button.tsx**

```tsx
"use client";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  pending?: boolean;
  pendingText?: string;
};

export function Button({ variant = "primary", pending, pendingText, children, className = "", disabled, ...rest }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary: "bg-fg text-bg hover:opacity-85",
    ghost: "border border-line text-fg hover:bg-bg-soft",
    danger: "border border-line text-[var(--err)] hover:bg-bg-soft",
  }[variant];
  return (
    <button {...rest} disabled={pending || disabled} className={`${base} ${styles} ${className}`}>
      {pending && (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
```

- [ ] **Step 3: modal.tsx**

```tsx
"use client";
import { useEffect } from "react";

export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title}
        className="w-full max-w-md rounded-lg border border-line bg-bg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-base font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: skeleton.tsx + code-block.tsx + highlight.ts + site.ts**

`components/ui/skeleton.tsx`:
```tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-bg-soft ${className}`} />;
}
```

`lib/highlight.ts`（只转义 `&<>`，引号留在文本节点内是安全的，便于正则匹配）:
```ts
export function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
}

export function highlightJson(src: string): string {
  return escapeHtml(src).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    (m, str: string | undefined, colon: string | undefined) => {
      if (str) return colon ? `<span class="tok-key">${str}</span>${colon}` : `<span class="tok-str">${str}</span>`;
      return `<span class="tok-num">${m}</span>`;
    },
  );
}
```

`components/code-block.tsx`:
```tsx
export function CodeBlock({ html, className = "" }: { html: string; className?: string }) {
  return (
    <pre className={`overflow-x-auto rounded-lg border border-line bg-bg-soft p-4 font-mono text-[13px] leading-relaxed ${className}`}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
```

`lib/site.ts`:
```ts
export const STATS = { news: "56,350", yc: "5,956", founders: "11,258" } as const;
export const API_DOCS = "https://api.lumina-core.cn/docs";
export const API_BASE = "https://api.lumina-core.cn";
export const CONTACT = "shane.z.chang@gmail.com";
```

- [ ] **Step 5: 编译验证 + Commit**

Run: `npx tsc --noEmit` Expected: 无错误。
```bash
git add -A && git commit -m "feat: UI 原语(toast/button/modal/skeleton/code-block) + JSON 高亮"
```

---

### Task 3: 数据层（auth / api / hooks）

**Files:** Create: `lib/auth.ts` `lib/api.ts` `lib/hooks.ts`

- [ ] **Step 1: auth.ts + api.ts**

`lib/auth.ts`:
```ts
const TOKEN_KEY = "datahub_token";
export const token = {
  get: (): string | null => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};
```

`lib/api.ts`（语义与 _legacy/app.js 的 api() 一致：网络错误 status=0，401/403 才算鉴权失效）:
```ts
import { token } from "./auth";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
export const isAuthError = (e: unknown): e is ApiError =>
  e instanceof ApiError && (e.status === 401 || e.status === 403);

export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth) headers.Authorization = `Bearer ${token.get()}`;
  let res: Response;
  try {
    res = await fetch("/api" + path, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError("网络连接失败，请检查网络后重试", 0);
  }
  let data: unknown = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const d = data as { error?: { message?: string }; detail?: string } | null;
    throw new ApiError(d?.error?.message || d?.detail || `请求失败 (${res.status})`, res.status);
  }
  return data as T;
}
```

- [ ] **Step 2: hooks.ts**

```ts
"use client";
import useSWR from "swr";
import { api } from "./api";

export type Me = { email: string; name: string | null };
export type ApiKeyRow = {
  id: number; name: string; key_prefix: string;
  scopes: string[]; rate_limit_per_min: number; revoked: boolean;
};
export type Usage = {
  total: number; today: number;
  daily: { date: string; count: number }[];
  by_key: { name: string; count: number }[];
};

const authFetcher = <T,>(path: string) => api<T>(path, { auth: true });

export const useMe = () => useSWR<Me>("/portal/me", authFetcher<Me>);
export const useKeys = () => useSWR<ApiKeyRow[]>("/portal/keys", authFetcher<ApiKeyRow[]>);
export const useUsage = () => useSWR<Usage>("/portal/usage?days=30", authFetcher<Usage>);
```

- [ ] **Step 3: 编译验证 + Commit**

Run: `npx tsc --noEmit` Expected: 无错误。
```bash
git add -A && git commit -m "feat: 数据层 token/api/SWR hooks(鉴权语义与旧站一致)"
```

---

### Task 4: 主题切换 + 营销外壳（header/footer）+ Playwright 基建

**Files:** Create: `components/theme-toggle.tsx` `components/site-header.tsx` `components/site-footer.tsx` `app/(site)/layout.tsx` `playwright.config.ts` `e2e/theme.spec.ts` ; Move: `app/page.tsx` → `app/(site)/page.tsx`

- [ ] **Step 1: 写失败测试 e2e/theme.spec.ts + playwright.config.ts**

`playwright.config.ts`:
```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
```

`e2e/theme.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("默认白天，可切换黑夜并持久化", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "切换主题" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm run test:e2e -- theme` Expected: FAIL（找不到“切换主题”按钮）

- [ ] **Step 3: theme-toggle.tsx**

```tsx
"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try { localStorage.setItem("datahub_theme", next ? "dark" : "light"); } catch {}
  }
  return (
    <button aria-label="切换主题" onClick={toggle}
      className="flex size-8 items-center justify-center rounded-md border border-line text-muted hover:bg-bg-soft">
      {dark ? (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 4: site-header.tsx（登录态感知，Stripe 模式）**

```tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { token } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";

export function BrandMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}

export function SiteHeader() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { setAuthed(Boolean(token.get())); }, []);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <BrandMark /> data·hub
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/changelog" className="hidden px-2 text-muted hover:text-fg sm:block">更新日志</Link>
          <Link href="/about" className="hidden px-2 text-muted hover:text-fg sm:block">关于</Link>
          {authed === null ? (
            <span className="w-28" aria-hidden="true" />
          ) : authed ? (
            <Link href="/dashboard" className="rounded-md bg-fg px-3 py-1.5 text-sm font-medium text-bg hover:opacity-85">进入控制台</Link>
          ) : (
            <>
              <Link href="/login" className="rounded-md border border-line px-3 py-1.5 hover:bg-bg-soft">登录</Link>
              <Link href="/register" className="rounded-md bg-fg px-3 py-1.5 font-medium text-bg hover:opacity-85">注册</Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: site-footer.tsx（版本号静态读 changelog.json）**

```tsx
import Link from "next/link";
import changelog from "@/public/changelog.json";
import { API_DOCS, CONTACT } from "@/lib/site";
import { BrandMark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted">
        <Link href="/" className="flex items-center gap-2 font-mono font-semibold text-fg"><BrandMark className="size-4" /> data·hub</Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/changelog" className="hover:text-fg">更新日志</Link>
          <Link href="/about" className="hover:text-fg">关于</Link>
          <a href={API_DOCS} target="_blank" rel="noopener" className="hover:text-fg">API 文档</a>
          <a href={`mailto:${CONTACT}`} className="hover:text-fg">联系</a>
        </nav>
        <span className="font-mono text-xs">
          <Link href="/changelog" className="rounded border border-line px-2 py-0.5 hover:text-fg">平台 v{changelog.current}</Link>
          <span className="mx-2">·</span>© 2026 data·hub
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: (site) 路由组布局 + 迁移占位首页**

```bash
mkdir -p "app/(site)" && git mv app/page.tsx "app/(site)/page.tsx"
```

`app/(site)/layout.tsx`:
```tsx
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 7: 跑测试通过 + Commit**

Run: `npm run test:e2e -- theme` Expected: PASS
```bash
git add -A && git commit -m "feat: 双主题切换 + 营销外壳(header/footer) + Playwright 基建"
```

---

### Task 5: 落地页七区块

**Files:** Create: `components/landing/hero.tsx` `datasets.tsx` `quickstart.tsx` `response-demo.tsx` `limits.tsx` `faq.tsx` `lib/snippets.ts` `app/sitemap.ts` `app/robots.ts` ; Rewrite: `app/(site)/page.tsx` ; Test: `e2e/public-routing.spec.ts`

- [ ] **Step 1: 写失败测试 e2e/public-routing.spec.ts**

```ts
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
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm run test:e2e -- public-routing` Expected: FAIL（占位首页无这些区块；changelog 404 的用例在 Task 6 转绿）

- [ ] **Step 3: lib/snippets.ts（预标记 curl 片段）**

```ts
export const CURL_NEWS = [
  `<span class="tok-punct">$</span> <span class="tok-cmd">curl</span> -H <span class="tok-str">"X-API-Key: &lt;your key&gt;"</span> \\`,
  `  <span class="tok-url">"https://api.lumina-core.cn/v1/news?q=新能源&amp;limit=10"</span>`,
].join("\n");

export const CURL_YC = [
  `<span class="tok-punct">$</span> <span class="tok-cmd">curl</span> -H <span class="tok-str">"X-API-Key: &lt;your key&gt;"</span> \\`,
  `  <span class="tok-url">"https://api.lumina-core.cn/v1/yc/companies?batch_year=2024&amp;status=Active"</span>`,
].join("\n");

export const CURL_QUICKSTART = CURL_NEWS;
```

- [ ] **Step 4: 六个区块组件**

`components/landing/hero.tsx`:
```tsx
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CURL_NEWS } from "@/lib/snippets";
import { STATS, API_DOCS } from "@/lib/site";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-20">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Data API Platform</p>
      <h1 className="text-4xl font-bold leading-tight sm:text-5xl">把结构化数据，<br />变成给 AI 调用的接口。</h1>
      <p className="mt-5 max-w-xl text-muted">
        两个生产数据集已上线，注册即可自助生成 API key，一行 <code className="font-mono text-fg">curl</code> 就能用。
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/register" className="rounded-md bg-fg px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-85">免费注册</Link>
        <a href={API_DOCS} target="_blank" rel="noopener" className="rounded-md border border-line px-5 py-2.5 text-sm hover:bg-bg-soft">查看文档</a>
      </div>
      <CodeBlock html={CURL_NEWS} className="mt-8 max-w-2xl" />
      <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
        {[[STATS.news, "新闻联播全文"], [STATS.yc, "YC 公司"], [STATS.founders, "创始人档案"]].map(([n, l]) => (
          <div key={l}><dt className="font-mono text-2xl font-semibold">{n}</dt><dd className="text-sm text-muted">{l}</dd></div>
        ))}
      </dl>
    </section>
  );
}
```

`components/landing/datasets.tsx`:
```tsx
import { API_DOCS } from "@/lib/site";

const DATASETS = [
  {
    name: "CCTV《新闻联播》", tag: "news",
    desc: "2016 年至今每日文字稿，SQLite FTS5 全文检索，支持聚合趋势、高亮片段、结构化查询。",
    facts: ["56,350 条 · 日覆盖 99.9%", "跨度 2016-02 → 至今", "每日 21:00 后自动入库"],
    example: "GET /v1/news?q=新能源&start_date=2026-05-01",
  },
  {
    name: "Y Combinator 公司目录", tag: "yc",
    desc: "全量 YC 公司与创始人档案，支持按批次 / 行业 / 状态筛选、创始人全文检索、二维交叉聚合。",
    facts: ["5,956 家公司 · 11,258 位创始人", "覆盖 2005 → 最新批次", "目录定期重抓保持时效"],
    example: "POST /v1/yc/companies/search {group_by: [batch_year, status]}",
  },
];

export function Datasets() {
  return (
    <section className="border-t border-line bg-bg-soft/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">数据集</h2>
        <p className="mt-2 text-sm text-muted">每个数据集一套独立端点，统一用 X-API-Key 认证。持续接入中。</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {DATASETS.map((d) => (
            <article key={d.tag} className="rounded-lg border border-line bg-bg p-6">
              <h3 className="font-semibold">{d.name}</h3>
              <p className="mt-2 text-sm text-muted">{d.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {d.facts.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-accent" aria-hidden="true" />{f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 overflow-x-auto rounded border border-line bg-bg-soft px-3 py-2 font-mono text-xs text-muted">{d.example}</p>
              <a href={API_DOCS} target="_blank" rel="noopener" className="mt-4 inline-block text-sm text-accent hover:underline">查看文档 →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`components/landing/quickstart.tsx`:
```tsx
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CURL_QUICKSTART } from "@/lib/snippets";

const STEPS = [
  { n: "01", t: "注册账号", d: "邮箱 + 验证码，30 秒完成。", body: <Link href="/register" className="text-sm text-accent hover:underline">免费注册 →</Link> },
  { n: "02", t: "生成 API key", d: "控制台一键生成，按 key 限流，可随时吊销。", body: <p className="font-mono text-xs text-muted">dh_xxxxxxxx…（只展示一次）</p> },
  { n: "03", t: "调用", d: "任何语言任何环境，一个 header 即可。", body: <CodeBlock html={CURL_QUICKSTART} className="text-xs" /> },
];

export function Quickstart() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-2xl font-bold">三步接入</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-lg border border-line p-6">
            <p className="font-mono text-xs text-accent">{s.n}</p>
            <h3 className="mt-2 font-semibold">{s.t}</h3>
            <p className="mb-4 mt-1 text-sm text-muted">{s.d}</p>
            {s.body}
          </div>
        ))}
      </div>
    </section>
  );
}
```

`components/landing/response-demo.tsx`:
```tsx
"use client";
import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { highlightJson } from "@/lib/highlight";
import { CURL_NEWS, CURL_YC } from "@/lib/snippets";
import newsSnap from "@/lib/snapshots/news.json";
import ycSnap from "@/lib/snapshots/yc.json";

const TABS = [
  { key: "news", label: "新闻联播", curl: CURL_NEWS, json: highlightJson(JSON.stringify(newsSnap, null, 2)) },
  { key: "yc", label: "YC 公司目录", curl: CURL_YC, json: highlightJson(JSON.stringify(ycSnap, null, 2)) },
];

export function ResponseDemo() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <section id="response-demo" className="border-t border-line bg-bg-soft/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">真实响应示例</h2>
        <p className="mt-2 text-sm text-muted">下面是生产 API 的真实返回（快照），注册前就能看到数据长什么样。</p>
        <div className="mt-6 flex gap-2">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm ${tab.key === t.key ? "bg-fg font-medium text-bg" : "border border-line text-muted hover:bg-bg-soft"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <CodeBlock html={tab.curl} className="mt-4" />
        <CodeBlock html={tab.json} className="mt-3 max-h-96 overflow-y-auto text-xs" />
      </div>
    </section>
  );
}
```

`components/landing/limits.tsx`:
```tsx
import { CONTACT } from "@/lib/site";

const ROWS = [
  ["请求限流", "60 次 / 分钟（按 key）"],
  ["数据范围", "全量数据，无字段阉割"],
  ["费用", "公测期免费"],
  ["更高额度", "邮件说明用途即可调整"],
];

export function Limits() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-2xl font-bold">限流与额度</h2>
      <p className="mt-2 text-sm text-muted">先说清楚你能拿到什么，注册后没有落差。</p>
      <div className="mt-6 max-w-2xl overflow-hidden rounded-lg border border-line">
        {ROWS.map(([k, v], i) => (
          <div key={k} className={`flex justify-between gap-6 px-5 py-3 text-sm ${i ? "border-t border-line" : ""}`}>
            <span className="text-muted">{k}</span><span className="text-right">{v}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">联系：<a href={`mailto:${CONTACT}`} className="text-accent hover:underline">{CONTACT}</a></p>
    </section>
  );
}
```

`components/landing/faq.tsx`:
```tsx
const QA = [
  ["数据从哪里来？", "全部来自公开来源：CCTV 官网《新闻联播》文字稿、Y Combinator 官方公司目录。我们只做结构化整理与检索，不索引任何非公开信息。"],
  ["数据多久更新？", "新闻联播每日 21:00 后自动采集入库；YC 目录定期全量重抓。每个数据集的更新节奏都写在数据集卡片里。"],
  ["可以商用吗？", "API 服务可用于产品集成。数据内容的版权归原始来源所有，使用时请遵守来源条款并建议注明出处。"],
  ["有免费额度吗？", "公测期全部免费，默认每个 key 60 次/分钟。需要更高额度发邮件说明用途即可。"],
  ["想要的数据这里没有？", "欢迎提需求。平台架构是可扩展的，新数据集的接入成本很低，合理的需求会优先排期。"],
];

export function Faq() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">常见问题</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {QA.map(([q, a]) => (
            <div key={q}><dt className="font-semibold">{q}</dt><dd className="mt-1.5 text-sm leading-relaxed text-muted">{a}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: 组装 page.tsx + sitemap + robots**

`app/(site)/page.tsx`:
```tsx
import { Hero } from "@/components/landing/hero";
import { Datasets } from "@/components/landing/datasets";
import { Quickstart } from "@/components/landing/quickstart";
import { ResponseDemo } from "@/components/landing/response-demo";
import { Limits } from "@/components/landing/limits";
import { Faq } from "@/components/landing/faq";

export default function Home() {
  return (
    <main>
      <Hero /><Datasets /><Quickstart /><ResponseDemo /><Limits /><Faq />
    </main>
  );
}
```

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://console.lumina-core.cn";
  return ["", "/changelog", "/about", "/login", "/register"].map((p) => ({ url: base + p }));
}
```

`app/robots.ts`:
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/dashboard" }, sitemap: "https://console.lumina-core.cn/sitemap.xml" };
}
```

- [ ] **Step 6: 跑测试 + Commit**

Run: `npm run test:e2e -- public-routing` Expected: 落地页两条 PASS；“更新日志”用例仍 FAIL（Task 6 转绿）
```bash
git add -A && git commit -m "feat: 落地页七区块(hero/数据集/三步/真实响应/限流/FAQ) + sitemap/robots"
```

---

### Task 6: 更新日志页 + 关于页

**Files:** Create: `app/(site)/changelog/page.tsx` `app/(site)/about/page.tsx`

- [ ] **Step 1: changelog/page.tsx（静态读 public/changelog.json，沿用类型标签语义）**

```tsx
import type { Metadata } from "next";
import changelog from "@/public/changelog.json";

export const metadata: Metadata = { title: "更新日志", alternates: { canonical: "/changelog" } };

const TYPE_LABEL: Record<string, string> = { added: "新增", changed: "优化", fixed: "修复", removed: "移除", security: "安全" };
const TYPE_CLASS: Record<string, string> = {
  added: "text-accent border-accent/40", security: "text-[var(--err)] border-[var(--err)]/40",
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Changelog</p>
      <h1 className="text-3xl font-bold">我们一直在迭代。</h1>
      <p className="mt-3 text-muted">每一次变更都记录在这里，版本号与代码 tag 一一对应。</p>
      <div className="mt-12 space-y-12">
        {changelog.releases.map((r) => (
          <article key={r.version} className="grid gap-3 sm:grid-cols-[110px_1fr]">
            <div>
              <p className="font-mono text-sm font-semibold">v{r.version}</p>
              <time className="text-xs text-muted">{r.date}</time>
            </div>
            <div>
              {"title" in r && r.title ? <h2 className="mb-2 font-semibold">{r.title}</h2> : null}
              <ul className="space-y-2">
                {r.changes.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <span className={`mt-0.5 h-fit shrink-0 rounded border px-1.5 py-0 font-mono text-[11px] ${TYPE_CLASS[c.type] ?? "border-line text-muted"}`}>
                      {TYPE_LABEL[c.type] ?? c.type}
                    </span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: about/page.tsx（保留联系方式 + 微信占位）**

```tsx
import type { Metadata } from "next";
import { API_DOCS, CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "关于", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">About</p>
      <h1 className="text-3xl font-bold leading-tight">一个人维护的<br />数据 API 平台。</h1>
      <p className="mt-5 max-w-xl leading-relaxed text-muted">
        data·hub 把零散的公开数据整理成结构化、可检索、能被 AI 直接调用的接口。
        已上线 CCTV《新闻联播》与 Y Combinator 公司目录两个数据集，后续会持续接入更多数据源。
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-semibold">联系方式</h2>
          <p className="mt-2 text-sm text-muted">有数据需求、合作或问题，欢迎直接联系。</p>
          <p className="mt-3 text-sm">邮箱 · <a href={`mailto:${CONTACT}`} className="text-accent hover:underline">{CONTACT}</a></p>
          <p className="mt-1 text-sm">文档 · <a href={API_DOCS} target="_blank" rel="noopener" className="text-accent hover:underline">api.lumina-core.cn/docs</a></p>
        </div>
        <div>
          <h2 className="font-semibold">微信</h2>
          <div className="mt-3 flex size-36 items-center justify-center rounded-lg border border-dashed border-line text-center text-xs text-muted">
            微信二维码<br />（待放置）
          </div>
          <p className="mt-2 text-xs text-muted">扫码加微信，备注「data-hub」。</p>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: 跑测试 + Commit**

Run: `npm run test:e2e -- public-routing theme` Expected: 全部 PASS
```bash
git add -A && git commit -m "feat: 更新日志页 + 关于页(独立 URL,静态预渲染)"
```

---

### Task 7: Auth 三页（登录 / 注册 / 找回密码）

**Files:** Create: `components/auth/send-code-button.tsx` `components/auth/auth-card.tsx` `app/(site)/login/page.tsx` `app/(site)/register/page.tsx` `app/(site)/reset/page.tsx` ; Test: `e2e/auth-guard.spec.ts`（先写已登录重定向部分）

- [ ] **Step 1: 写失败测试 e2e/auth-guard.spec.ts**

```ts
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
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm run test:e2e -- auth-guard` Expected: FAIL（/login /dashboard 404）

- [ ] **Step 3: auth 公共件**

`components/auth/auth-card.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { token } from "@/lib/auth";

export function AuthCard({ title, sub, children, redirectIfAuthed = true }: {
  title: string; sub?: string; children: React.ReactNode; redirectIfAuthed?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (redirectIfAuthed && token.get()) router.replace("/dashboard");
  }, [redirectIfAuthed, router]);
  return (
    <main className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="text-2xl font-bold">{title}</h1>
      {sub ? <p className="mt-2 text-sm text-muted">{sub}</p> : null}
      <div className="mt-7">{children}</div>
    </main>
  );
}

export const inputCls =
  "w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-fg";
export const labelCls = "block space-y-1.5 text-sm font-medium";
```

`components/auth/send-code-button.tsx`（移植 60s 倒计时）:
```tsx
"use client";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function SendCodeButton({ getEmail, endpoint }: { getEmail: () => string; endpoint: string }) {
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  async function send() {
    const email = getEmail().trim();
    if (!email) return toast("请先填邮箱", "err");
    setPending(true);
    try {
      await api(endpoint, { method: "POST", body: { email } });
      toast("验证码已发送，请查收邮箱", "ok");
      setCount(60);
      timer.current = setInterval(() => {
        setCount((c) => {
          if (c <= 1 && timer.current) clearInterval(timer.current);
          return c - 1;
        });
      }, 1000);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setPending(false);
    }
  }
  return (
    <Button type="button" variant="ghost" onClick={send} pending={pending} pendingText="发送中…"
      disabled={count > 0} className="shrink-0 whitespace-nowrap px-3 py-2 text-xs">
      {count > 0 ? `${count}s 后重发` : "发送验证码"}
    </Button>
  );
}
```

- [ ] **Step 4: login/page.tsx**

```tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { token } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AuthCard, inputCls, labelCls } from "@/components/auth/auth-card";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await api<{ access_token: string }>("/portal/login", {
        method: "POST",
        body: { email: emailRef.current!.value.trim(), password: pwdRef.current!.value },
      });
      token.set(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      toast((err as Error).message, "err");
      setPending(false);
    }
  }

  return (
    <AuthCard title="登录">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className={labelCls}>邮箱
          <input ref={emailRef} type="email" required placeholder="you@example.com" autoComplete="email" className={inputCls} />
        </label>
        <label className={labelCls}>密码
          <input ref={pwdRef} type="password" required placeholder="密码" autoComplete="current-password" className={inputCls} />
        </label>
        <Button type="submit" pending={pending} pendingText="登录中…" className="w-full">登录</Button>
      </form>
      <p className="mt-5 text-sm text-muted">
        还没有账号？<Link href="/register" className="text-accent hover:underline">去注册</Link>
        <span className="mx-2">·</span>
        <Link href="/reset" className="text-accent hover:underline">忘记密码？</Link>
      </p>
    </AuthCard>
  );
}
```

- [ ] **Step 5: register/page.tsx + reset/page.tsx**

`register/page.tsx`:
```tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { token } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AuthCard, inputCls, labelCls } from "@/components/auth/auth-card";
import { SendCodeButton } from "@/components/auth/send-code-button";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const refs = {
    email: useRef<HTMLInputElement>(null), code: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null), name: useRef<HTMLInputElement>(null),
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await api<{ access_token: string }>("/portal/register", {
        method: "POST",
        body: {
          email: refs.email.current!.value.trim(),
          code: refs.code.current!.value.trim(),
          password: refs.password.current!.value,
          name: refs.name.current!.value.trim() || null,
        },
      });
      token.set(res.access_token);
      toast("注册成功 🎉", "ok");
      router.push("/dashboard");
    } catch (err) {
      toast((err as Error).message, "err");
      setPending(false);
    }
  }

  return (
    <AuthCard title="注册" sub="用邮箱注册，我们会发一个 6 位验证码。">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className={labelCls}>邮箱
          <div className="flex gap-2">
            <input ref={refs.email} type="email" required placeholder="you@example.com" autoComplete="email" className={inputCls} />
            <SendCodeButton getEmail={() => refs.email.current?.value ?? ""} endpoint="/portal/send-code" />
          </div>
        </label>
        <label className={labelCls}>验证码
          <input ref={refs.code} required maxLength={6} inputMode="numeric" placeholder="6 位数字" className={inputCls} />
        </label>
        <label className={labelCls}>密码
          <input ref={refs.password} type="password" required minLength={8} placeholder="至少 8 位" autoComplete="new-password" className={inputCls} />
        </label>
        <label className={labelCls}>昵称（可选）
          <input ref={refs.name} placeholder="怎么称呼你" className={inputCls} />
        </label>
        <Button type="submit" pending={pending} pendingText="注册中…" className="w-full">注册并登录</Button>
      </form>
      <p className="mt-5 text-sm text-muted">已有账号？<Link href="/login" className="text-accent hover:underline">去登录</Link></p>
    </AuthCard>
  );
}
```

`reset/page.tsx`（结构同 register：邮箱+发码 / 验证码 / 新密码；成功后 `toast("密码已重置，请用新密码登录", "ok")` 并 `router.push("/login")`；端点 `/portal/forgot-password` 发码、`/portal/reset-password` 提交 `{email, code, new_password}`；`redirectIfAuthed={false}` 不强跳）:
```tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AuthCard, inputCls, labelCls } from "@/components/auth/auth-card";
import { SendCodeButton } from "@/components/auth/send-code-button";

export default function ResetPage() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const refs = { email: useRef<HTMLInputElement>(null), code: useRef<HTMLInputElement>(null), password: useRef<HTMLInputElement>(null) };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await api("/portal/reset-password", {
        method: "POST",
        body: { email: refs.email.current!.value.trim(), code: refs.code.current!.value.trim(), new_password: refs.password.current!.value },
      });
      toast("密码已重置，请用新密码登录", "ok");
      router.push("/login");
    } catch (err) {
      toast((err as Error).message, "err");
      setPending(false);
    }
  }

  return (
    <AuthCard title="重置密码" sub="填注册邮箱，我们发一个 6 位验证码，验证后即可设置新密码。" redirectIfAuthed={false}>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className={labelCls}>邮箱
          <div className="flex gap-2">
            <input ref={refs.email} type="email" required placeholder="you@example.com" autoComplete="email" className={inputCls} />
            <SendCodeButton getEmail={() => refs.email.current?.value ?? ""} endpoint="/portal/forgot-password" />
          </div>
        </label>
        <label className={labelCls}>验证码
          <input ref={refs.code} required maxLength={6} inputMode="numeric" placeholder="6 位数字" className={inputCls} />
        </label>
        <label className={labelCls}>新密码
          <input ref={refs.password} type="password" required minLength={8} placeholder="至少 8 位" autoComplete="new-password" className={inputCls} />
        </label>
        <Button type="submit" pending={pending} pendingText="提交中…" className="w-full">重置密码</Button>
      </form>
      <p className="mt-5 text-sm text-muted">想起来了？<Link href="/login" className="text-accent hover:underline">去登录</Link></p>
    </AuthCard>
  );
}
```

- [ ] **Step 6: 跑测试 + Commit**

Run: `npm run test:e2e -- auth-guard` Expected: “pending 态”用例 PASS；前两条仍 FAIL（依赖 /dashboard，Task 8 转绿）
```bash
git add -A && git commit -m "feat: 登录/注册/找回密码(按钮 pending + 已登录重定向 + 60s 发码倒计时)"
```

---

### Task 8: 控制台外壳（守卫 + 侧边栏 + 骨架屏）

**Files:** Create: `app/dashboard/layout.tsx` `components/dashboard/sidebar.tsx` `app/dashboard/page.tsx`(占位)

- [ ] **Step 1: sidebar.tsx（含移动端抽屉）**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_DOCS } from "@/lib/site";

const NAV = [
  { href: "/dashboard", label: "概览" },
  { href: "/dashboard/keys", label: "API Keys" },
  { href: "/dashboard/usage", label: "用量" },
  { href: "/dashboard/settings", label: "设置" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <Link key={n.href} href={n.href} onClick={onClose}
            className={`rounded-md px-3 py-2 text-sm ${active ? "bg-bg-soft font-semibold text-fg" : "text-muted hover:bg-bg-soft hover:text-fg"}`}>
            {n.label}
          </Link>
        );
      })}
      <a href={API_DOCS} target="_blank" rel="noopener" className="mt-3 px-3 text-xs text-muted hover:text-fg">API 文档 ↗</a>
    </nav>
  );
  return (
    <>
      <aside className="hidden w-52 shrink-0 border-r border-line md:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose}>
          <aside className="h-full w-60 border-r border-line bg-bg" onClick={(e) => e.stopPropagation()}>{nav}</aside>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: dashboard/layout.tsx（守卫三态：loading 骨架 / 鉴权失效 / 网络错误保会话）**

```tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/hooks";
import { token } from "@/lib/auth";
import { isAuthError } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/site-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const { data: me, error, isLoading, mutate } = useMe();

  useEffect(() => {
    const t = Boolean(token.get());
    setHasToken(t);
    if (!t) router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (error && isAuthError(error)) {
      token.clear();
      toast("登录已失效，请重新登录", "err");
      router.replace("/login");
    }
  }, [error, router, toast]);

  if (hasToken === null || hasToken === false || (error && isAuthError(error))) return <DashSkeleton />;

  function logout() {
    token.clear();
    toast("已退出");
    router.replace("/");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-3">
          <button aria-label="菜单" onClick={() => setMenuOpen(true)}
            className="flex size-8 items-center justify-center rounded-md border border-line md:hidden">
            <svg className="size-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold"><BrandMark /> data·hub</Link>
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">控制台</span>
        </div>
        <div className="flex items-center gap-3">
          {me ? <span className="hidden font-mono text-xs text-muted sm:block">{me.email}</span> : <Skeleton className="h-4 w-36" />}
          <ThemeToggle />
          <button onClick={logout} className="rounded-md border border-line px-3 py-1.5 text-sm text-muted hover:bg-bg-soft hover:text-fg">退出</button>
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 p-5 md:p-8">
          {isLoading ? (
            <MainSkeleton />
          ) : error ? (
            <div className="mx-auto mt-20 max-w-sm text-center">
              <p className="text-sm text-muted">无法连接服务器，请稍后重试。你的登录状态已保留。</p>
              <Button variant="ghost" className="mt-4" onClick={() => mutate()}>重试</Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

function MainSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-3 gap-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
      <Skeleton className="h-48" />
    </div>
  );
}

function DashSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex h-14 items-center border-b border-line px-4"><Skeleton className="h-5 w-28" /></div>
      <div className="flex flex-1">
        <div className="hidden w-52 border-r border-line p-3 md:block">
          <div className="space-y-2"><Skeleton className="h-8" /><Skeleton className="h-8" /><Skeleton className="h-8" /><Skeleton className="h-8" /></div>
        </div>
        <div className="flex-1 p-8"><MainSkeleton /></div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 概览占位页**

`app/dashboard/page.tsx`:
```tsx
export default function OverviewPage() {
  return <h1 className="text-xl font-bold">概览</h1>;
}
```

- [ ] **Step 4: 跑测试 + Commit**

Run: `npm run test:e2e -- auth-guard` Expected: 全部 PASS
```bash
git add -A && git commit -m "feat: 控制台外壳(侧边栏+鉴权守卫+骨架屏,网络错误保会话)"
```

---

### Task 9: 概览页 + 用量页

**Files:** Create: `components/dashboard/stat-card.tsx` `components/dashboard/usage-chart.tsx` ; Rewrite: `app/dashboard/page.tsx` ; Create: `app/dashboard/usage/page.tsx` ; Test: `e2e/dashboard-flow.spec.ts`（概览部分）

- [ ] **Step 1: 写失败测试（e2e/dashboard-flow.spec.ts 概览用例）**

```ts
import { test, expect, type Page } from "@playwright/test";

const ME = { email: "t@example.com", name: "Tester" };
const USAGE = {
  total: 1234, today: 56,
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
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm run test:e2e -- dashboard-flow` Expected: FAIL

- [ ] **Step 3: stat-card.tsx + usage-chart.tsx**

`components/dashboard/stat-card.tsx`:
```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="rounded-lg border border-line p-5">
      {value === undefined ? <Skeleton className="h-8 w-20" /> : <p className="font-mono text-2xl font-semibold">{value}</p>}
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
```

`components/dashboard/usage-chart.tsx`（纯 CSS 柱状，沿用旧站归一化逻辑）:
```tsx
import type { Usage } from "@/lib/hooks";

export function UsageChart({ daily }: { daily: Usage["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div data-chart className="flex h-28 items-end gap-[3px]">
      {daily.map((d) => {
        const h = d.count > 0 ? Math.max(6, Math.round((d.count / max) * 100)) : 2;
        return (
          <span key={d.date} title={`${d.date} · ${d.count} 次`}
            className={`flex-1 rounded-t-sm ${d.count ? "bg-fg/70" : "bg-line"}`}
            style={{ height: `${h}%` }} />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: 概览页 + 用量页**

`app/dashboard/page.tsx`:
```tsx
"use client";
import { useKeys, useUsage } from "@/lib/hooks";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewPage() {
  const { data: usage } = useUsage();
  const { data: keys } = useKeys();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold">概览</h1>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="总调用" value={usage?.total.toLocaleString()} />
        <StatCard label="今日" value={usage?.today.toLocaleString()} />
        <StatCard label="有效 key" value={keys?.filter((k) => !k.revoked).length} />
      </div>
      <div className="mt-5 rounded-lg border border-line p-5">
        <p className="mb-4 text-sm text-muted">近 30 天调用</p>
        {usage ? <UsageChart daily={usage.daily} /> : <Skeleton className="h-28" />}
      </div>
    </div>
  );
}
```

`app/dashboard/usage/page.tsx`:
```tsx
"use client";
import { useUsage } from "@/lib/hooks";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsagePage() {
  const { data: usage } = useUsage();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold">用量</h1>
      <div className="mt-5 rounded-lg border border-line p-5">
        <p className="mb-4 text-sm text-muted">近 30 天调用趋势</p>
        {usage ? <UsageChart daily={usage.daily} /> : <Skeleton className="h-28" />}
      </div>
      <div className="mt-5 rounded-lg border border-line">
        <p className="border-b border-line px-5 py-3 text-sm font-semibold">按 key 明细</p>
        {!usage ? (
          <div className="space-y-2 p-5"><Skeleton className="h-5" /><Skeleton className="h-5" /></div>
        ) : usage.by_key.filter((k) => k.count > 0).length === 0 ? (
          <p className="p-5 text-sm text-muted">还没有调用记录。</p>
        ) : (
          usage.by_key.filter((k) => k.count > 0).sort((a, b) => b.count - a.count).map((k) => (
            <div key={k.name} className="flex justify-between border-t border-line px-5 py-3 text-sm first:border-t-0">
              <span>{k.name}</span><span className="font-mono">{k.count.toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 跑测试 + Commit**

Run: `npm run test:e2e -- dashboard-flow` Expected: PASS
```bash
git add -A && git commit -m "feat: 控制台概览+用量页(统计卡/30天图表/按key明细,带骨架占位)"
```

---

### Task 10: API Keys 页（弹窗替代原生 prompt/confirm）

**Files:** Create: `app/dashboard/keys/page.tsx` `components/dashboard/new-key-modal.tsx` `components/dashboard/confirm-modal.tsx` ; Test: 追加 `e2e/dashboard-flow.spec.ts`

- [ ] **Step 1: 追加失败测试**

```ts
test("生成 key:命名弹窗 → 一次性展示 → 复制", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await mockPortal(page, []);
  await page.goto("/dashboard/keys");
  await expect(page.getByText("还没有 key")).toBeVisible();
  await page.getByRole("button", { name: "生成新 Key" }).click();
  await page.getByLabel("Key 名称").fill("测试应用");
  await page.getByRole("button", { name: "生成" }).click();
  await expect(page.getByText("dh_newkey_full_value_0001")).toBeVisible();
  await page.getByRole("button", { name: "复制" }).click();
  await expect(page.getByText("已复制")).toBeVisible();
});

test("吊销 key:确认弹窗", async ({ page }) => {
  await mockPortal(page);
  await page.route("**/api/portal/keys/1", (r) => r.fulfill({ json: { ok: true } }));
  await page.goto("/dashboard/keys");
  await page.getByRole("button", { name: "吊销" }).click();
  await expect(page.getByText(/吊销后该 key 立即失效/)).toBeVisible();
  await page.getByRole("button", { name: "确认吊销" }).click();
  await expect(page.getByText("已吊销")).toBeVisible();
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `npm run test:e2e -- dashboard-flow` Expected: 新增两条 FAIL

- [ ] **Step 3: new-key-modal.tsx + confirm-modal.tsx**

`components/dashboard/new-key-modal.tsx`:
```tsx
"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function NewKeyModal({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: (fullKey: string) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("我的应用");
  const [pending, setPending] = useState(false);
  async function create(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await api<{ api_key: string }>("/portal/keys", { method: "POST", auth: true, body: { name: name.trim() } });
      onCreated(res.api_key);
      toast("已生成，请立即复制保存", "ok");
      onClose();
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setPending(false);
    }
  }
  return (
    <Modal open={open} onClose={onClose} title="生成新 Key">
      <form onSubmit={create} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">Key 名称
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100}
            placeholder="标记它的用途，如:我的应用"
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-fg" />
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>取消</Button>
          <Button type="submit" pending={pending} pendingText="生成中…">生成</Button>
        </div>
      </form>
    </Modal>
  );
}
```

`components/dashboard/confirm-modal.tsx`:
```tsx
"use client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function ConfirmModal({ open, onClose, onConfirm, title, body, confirmText, pending }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; body: string; confirmText: string; pending?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{body}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>取消</Button>
        <Button variant="danger" onClick={onConfirm} pending={pending} pendingText="处理中…">{confirmText}</Button>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: keys/page.tsx**

```tsx
"use client";
import { useState } from "react";
import { useKeys, type ApiKeyRow } from "@/lib/hooks";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { NewKeyModal } from "@/components/dashboard/new-key-modal";
import { ConfirmModal } from "@/components/dashboard/confirm-modal";

export default function KeysPage() {
  const toast = useToast();
  const { data: keys, mutate } = useKeys();
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<ApiKeyRow | null>(null);
  const [revokePending, setRevokePending] = useState(false);

  async function revoke() {
    if (!revoking) return;
    setRevokePending(true);
    try {
      await api(`/portal/keys/${revoking.id}`, { method: "DELETE", auth: true });
      toast("已吊销", "ok");
      setRevoking(null);
      mutate();
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setRevokePending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">API Keys</h1>
        <Button onClick={() => setCreating(true)}>＋ 生成新 Key</Button>
      </div>

      {newKey && (
        <div className="mt-5 rounded-lg border border-accent/40 bg-bg-soft p-4">
          <p className="text-sm font-semibold">新 key 已生成 —— 只显示这一次，请立即复制保存：</p>
          <div className="mt-2 flex items-center gap-3">
            <code className="overflow-x-auto rounded border border-line bg-bg px-3 py-1.5 font-mono text-xs">{newKey}</code>
            <Button variant="ghost" className="shrink-0 px-3 py-1.5 text-xs"
              onClick={() => navigator.clipboard.writeText(newKey).then(() => toast("已复制", "ok"))}>复制</Button>
          </div>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border border-line">
        {!keys ? (
          <div className="space-y-2 p-5"><Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" /></div>
        ) : keys.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">还没有 key，点右上角「生成新 Key」。</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                {["名称", "前缀", "权限", "限流", "状态", ""].map((h, i) => <th key={i} className="px-4 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.key_prefix}…</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.scopes.join(", ")}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.rate_limit_per_min}/min</td>
                  <td className="px-4 py-3">
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${k.revoked ? "border-line text-muted" : "border-accent/40 text-accent"}`}>
                      {k.revoked ? "已吊销" : "有效"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!k.revoked && (
                      <button onClick={() => setRevoking(k)} className="text-xs text-[var(--err)] hover:underline">吊销</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <NewKeyModal open={creating} onClose={() => setCreating(false)}
        onCreated={(k) => { setNewKey(k); mutate(); }} />
      <ConfirmModal open={Boolean(revoking)} onClose={() => setRevoking(null)} onConfirm={revoke}
        title={`吊销「${revoking?.name ?? ""}」`}
        body="吊销后该 key 立即失效，使用它的应用会立刻收到 401。此操作不可撤销。"
        confirmText="确认吊销" pending={revokePending} />
    </div>
  );
}
```

- [ ] **Step 5: 跑测试 + Commit**

Run: `npm run test:e2e -- dashboard-flow` Expected: 全部 PASS
```bash
git add -A && git commit -m "feat: API Keys 页(命名弹窗/确认弹窗替代原生 prompt+confirm,一次性展示)"
```

---

### Task 11: 设置页

**Files:** Create: `app/dashboard/settings/page.tsx`

- [ ] **Step 1: settings/page.tsx**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useMe } from "@/lib/hooks";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { inputCls, labelCls } from "@/components/auth/auth-card";

export default function SettingsPage() {
  const toast = useToast();
  const { data: me, mutate } = useMe();
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const cur = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLInputElement>(null);

  useEffect(() => { if (me) setName(me.name ?? ""); }, [me]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    try {
      await api("/portal/me", { method: "PATCH", auth: true, body: { name: name.trim() || null } });
      mutate();
      toast("昵称已保存", "ok");
    } catch (err) { toast((err as Error).message, "err"); }
    finally { setSavingName(false); }
  }

  async function savePwd(e: React.FormEvent) {
    e.preventDefault();
    setSavingPwd(true);
    try {
      await api("/portal/change-password", {
        method: "POST", auth: true,
        body: { current_password: cur.current!.value, new_password: next.current!.value },
      });
      cur.current!.value = ""; next.current!.value = "";
      toast("密码已修改", "ok");
    } catch (err) { toast((err as Error).message, "err"); }
    finally { setSavingPwd(false); }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold">设置</h1>
      {me ? <p className="mt-1 font-mono text-sm text-muted">{me.email}</p> : <Skeleton className="mt-2 h-4 w-44" />}

      <form onSubmit={saveName} className="mt-7 rounded-lg border border-line p-5">
        <h2 className="mb-4 font-semibold">资料</h2>
        <label className={labelCls}>昵称
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="怎么称呼你" className={inputCls} />
        </label>
        <Button type="submit" pending={savingName} pendingText="保存中…" className="mt-4">保存昵称</Button>
      </form>

      <form onSubmit={savePwd} className="mt-5 rounded-lg border border-line p-5">
        <h2 className="mb-4 font-semibold">修改密码</h2>
        <div className="space-y-4">
          <label className={labelCls}>当前密码
            <input ref={cur} type="password" required autoComplete="current-password" className={inputCls} />
          </label>
          <label className={labelCls}>新密码
            <input ref={next} type="password" required minLength={8} placeholder="至少 8 位" autoComplete="new-password" className={inputCls} />
          </label>
        </div>
        <Button type="submit" pending={savingPwd} pendingText="修改中…" className="mt-4">修改密码</Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: 全量回归 + Commit**

Run: `npm run test:e2e` Expected: 全部 PASS
```bash
git add -A && git commit -m "feat: 设置页(昵称/改密,pending 态)"
```

---

### Task 12: 收尾（删旧站、版本物料、构建与 Lighthouse）

**Files:** Delete: `_legacy/` `vercel.json` `assets/` ; Modify: `README.md` `CHANGELOG.md` `public/changelog.json`

- [ ] **Step 1: 删除旧资产**

```bash
git rm -r _legacy vercel.json assets
```
（rewrites 已在 next.config.ts；assets/ 里只有 og 制作模板，已沉淀进 og.png）

- [ ] **Step 2: 版本物料**

`public/changelog.json` 的 `releases` 数组头部插入（同时 `current` 改 `0.5.0`）:
```json
{
  "version": "0.5.0",
  "date": "2026-06-10",
  "title": "前端整站重建",
  "changes": [
    { "type": "added", "text": "独立 URL 路由:登录/注册/控制台/更新日志各有专属地址,支持浏览器前进后退与深链分享" },
    { "type": "added", "text": "白天/黑夜双主题,默认白天,记住你的选择" },
    { "type": "added", "text": "主页改版:数据集卡片、真实响应示例、三步接入、限流说明、FAQ" },
    { "type": "added", "text": "控制台改版:侧边栏布局,概览/API Keys/用量/设置分页管理" },
    { "type": "changed", "text": "全站加载态:骨架屏 + 按钮进行中状态,操作不再没有反馈" },
    { "type": "changed", "text": "生成/吊销 key 改用站内弹窗,不再使用浏览器原生对话框" }
  ]
}
```

`CHANGELOG.md` 头部加同义条目（Markdown 格式照旧文件惯例）。`README.md` 重写技术栈说明：Next.js + Tailwind v4 + SWR、`npm run dev / build / test:e2e`、部署 Vercel、API 走 next.config rewrites。

- [ ] **Step 3: 生产构建 + 全量测试**

Run: `npm run build` Expected: 编译通过，`/`、`/changelog`、`/about` 标记为 Static。
Run: `npm run test:e2e` Expected: 全部 PASS。

- [ ] **Step 4: Lighthouse 抽查**

```bash
npm run start -- --port 3200 &
npx lighthouse http://localhost:3200 --only-categories=performance,seo --preset=desktop --chrome-flags="--headless" --output=json --output-path=./.lighthouse.json --quiet
node -e "const r=require('./.lighthouse.json');console.log('perf',r.categories.performance.score,'seo',r.categories.seo.score)"
kill %1; rm .lighthouse.json
```
Expected: perf ≥ 0.9，seo ≥ 0.9（达不到则修复后再继续）。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: 移除旧静态站,平台 v0.5.0 物料(changelog/README)"
```

---

### Task 13: 部署上线

- [ ] **Step 1: 推分支**

```bash
git push -u origin v1-next
```

- [ ] **Step 2: 合并 main 并推送（Vercel 自动部署生产）**

```bash
git checkout main && git merge --no-ff v1-next -m "release: 前端整站重建为 Next.js,平台 v0.5.0" && git push origin main
```

- [ ] **Step 3: 生产验证**

```bash
sleep 90
curl -sI https://console.lumina-core.cn/ | head -3
curl -s https://console.lumina-core.cn/login | grep -o "<title>[^<]*" | head -1
curl -s https://console.lumina-core.cn/changelog | grep -o "0.5.0" | head -1
```
Expected: 200、login 页有标题、changelog 含 0.5.0。再用浏览器（gstack browse 或 Playwright `--config` 指生产 baseURL 跑 public-routing + theme 两个 spec）走查一遍主页/主题切换/登录页。

- [ ] **Step 4: 清理分支**

```bash
git branch -d v1-next && git push origin --delete v1-next
```

---

## 自审记录

- **Spec 覆盖**：路由表 ✓（Task 5/6/7/8）；侧边栏控制台 ✓（Task 8）；双主题 ✓（Task 1/4）；loading 规范 ✓（Task 7-11 的 pending/骨架，Task 10 弹窗）；主页七区块 ✓（Task 5）；SWR/localStorage/rewrites ✓（Task 1/3）；保留资产 ✓（Task 1 public/、Task 6 changelog 渲染）；Playwright+Lighthouse ✓（Task 4/12）；不在范围 ✓（无 cookie/后端/i18n 改动）。
- **占位符扫描**：无 TBD/TODO；reset 页代码完整给出；toast 错误色的实现注记已写明处理方式（--err 变量）。
- **类型一致性**：`ApiKeyRow.id: number` 与 DELETE 路径模板一致；`Usage.daily/by_key` 字段与后端 /portal/usage 返回一致（与 _legacy/app.js 使用处对齐）；`useMe/useKeys/useUsage` 在 layout/页面间签名一致。
