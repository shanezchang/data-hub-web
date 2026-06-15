import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { API_BASE, API_DOCS } from "@/lib/site";
import { CURL_NEWS } from "@/lib/snippets";

export const metadata: Metadata = {
  title: "接入指南",
  description:
    "data·hub API 接入指南：注册拿 key、第一次调用、四个数据集速览、限流与免费额度、AI Agent 接入。",
  alternates: { canonical: "/docs" },
};

const DATASET_ROWS: [string, string, string][] = [
  ["news", "CCTV《新闻联播》", "GET /v1/news?q=新能源"],
  ["yc", "Y Combinator 公司目录", "GET /v1/yc/companies?tag=AI"],
  ["policy", "国务院政策文件库", "GET /v1/policy?q=人工智能"],
  ["opinion", "人民日报评论语料", "GET /v1/opinion?q=基层治理"],
];

const ERROR_ROWS: [string, string, string][] = [
  ["401", "缺少 / 无效 / 已吊销的 key", "检查 X-API-Key 头；必要时到控制台重新生成"],
  ["403", "key 没有该数据集的权限", "控制台自助 key 默认带全部数据集 read 权限"],
  ["429（限流）", "瞬时请求过快（默认 60 次/分）", "按响应头 Retry-After 秒数稍候重试"],
  ["429（配额）", "当日免费额度用尽（默认 1000 次/天）", "北京时间次日 0 点自动重置；更高额度后续开放申请"],
];

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-14 flex items-baseline gap-3 text-xl font-bold">
      <span className="font-mono text-sm text-brand">{n}</span>
      {children}
    </h2>
  );
}

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Getting Started</p>
      <h1 className="text-3xl font-bold">接入指南：从注册到第一次调用</h1>
      <p className="mt-3 text-muted-foreground">
        data·hub 是面向人和 AI agent 的结构化数据 API。拿一个 key、记一个 header，五分钟内完成第一次调用。
      </p>

      <SectionTitle n="01">拿到 API key（免费，自助）</SectionTitle>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        <li>
          <Link href="/register" className="text-brand hover:underline">注册账号</Link>
          ：邮箱收验证码即可开通，无需审核。
        </li>
        <li>
          登录后进入
          <Link href="/dashboard/keys" className="text-brand hover:underline"> 控制台 → API Keys</Link>
          ，点「生成新 key」。
        </li>
        <li>
          复制保存明文 key（形如 <code className="font-mono text-xs">dh_xxxxxxxx…</code>）。
          <strong>明文只展示这一次</strong>，服务端只存哈希；丢了就吊销旧的再生成。
        </li>
      </ol>
      <p className="mt-3 text-sm text-muted-foreground">
        自助 key 默认带全部数据集的读取权限，每账号最多 5 个有效 key，可随时吊销。
      </p>

      <SectionTitle n="02">第一次调用</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed">
        所有数据接口都在 <code className="font-mono text-xs">{API_BASE}/v1/*</code>
        ，认证只有一件事：请求头带 <code className="font-mono text-xs">X-API-Key</code>。
      </p>
      <CodeBlock html={CURL_NEWS} className="mt-4 text-xs" />
      <p className="mt-3 text-sm text-muted-foreground">
        响应是 JSON：列表接口统一返回 <code className="font-mono text-xs">{"{ total, limit, offset, items }"}</code>；
        带 <code className="font-mono text-xs">q</code> 检索时默认返回命中片段 snippet（省上下文），
        要整段正文在 <code className="font-mono text-xs">fields</code> 里显式加 <code className="font-mono text-xs">content</code>。
      </p>

      <SectionTitle n="03">四个数据集</SectionTitle>
      <div className="mt-4 overflow-hidden rounded-lg border">
        {DATASET_ROWS.map(([slug, name, example], i) => (
          <div key={slug} className={`flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm ${i ? "border-t" : ""}`}>
            <span>
              <Link href={`/datasets/${slug}`} className="font-mono text-brand hover:underline">{slug}</Link>
              <span className="ml-3">{name}</span>
            </span>
            <code className="font-mono text-xs text-muted-foreground">{example}</code>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        每个数据集都支持：全文检索（GET 单短语；POST <code className="font-mono text-xs">/search</code> 多词
        AND/OR/短语）、字段投影、时间区间过滤、维度聚合（<code className="font-mono text-xs">group_by</code>，
        画趋势曲线）。字段与端点明细见各<Link href="/datasets" className="text-brand hover:underline">数据集页</Link>，
        精确参数以 <a href={`${API_BASE}/openapi.json`} target="_blank" rel="noopener" className="text-brand hover:underline">openapi.json</a> 为准。
      </p>

      <SectionTitle n="04">限流、免费额度与错误码</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed">
        每个 key 两道闸：<strong>限流</strong>管瞬时速率（默认 60 次/分），
        <strong>日配额</strong>管每日总量（公测期免费 1000 次/天，北京时间次日 0 点重置）。
        被拒的请求（401/403/429）不消耗配额；当日用量在
        <Link href="/dashboard/usage" className="text-brand hover:underline">控制台 → 用量</Link>随时可查。
      </p>
      <div className="mt-4 overflow-hidden rounded-lg border">
        {ERROR_ROWS.map(([code, why, fix], i) => (
          <div key={code} className={`grid gap-1 px-5 py-3 text-sm sm:grid-cols-[110px_1fr_1fr] ${i ? "border-t" : ""}`}>
            <span className="font-mono text-xs">{code}</span>
            <span className="text-muted-foreground">{why}</span>
            <span>{fix}</span>
          </div>
        ))}
      </div>

      <SectionTitle n="05">给 AI Agent</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed">
        把一个 key 和一个链接交给 agent 即可自助接入，三层入口由浅入深：
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <a href={`${API_BASE}/llms.txt`} target="_blank" rel="noopener" className="font-mono text-brand hover:underline">{API_BASE}/llms.txt</a>
          <span className="ml-2 text-muted-foreground">极简 Markdown 概览，读完就能开始调</span>
        </li>
        <li>
          <a href={`${API_BASE}/openapi.json`} target="_blank" rel="noopener" className="font-mono text-brand hover:underline">{API_BASE}/openapi.json</a>
          <span className="ml-2 text-muted-foreground">完整机器可读契约（事实源）</span>
        </li>
        <li>
          <a href={API_DOCS} target="_blank" rel="noopener" className="font-mono text-brand hover:underline">{API_BASE}/docs</a>
          <span className="ml-2 text-muted-foreground">Scalar 交互文档，给人看</span>
        </li>
      </ul>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href="/register" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-85">免费注册拿 key</Link>
        <a href={API_DOCS} target="_blank" rel="noopener" className="rounded-md border px-5 py-2.5 text-sm hover:bg-muted">API 文档 ↗</a>
      </div>
    </main>
  );
}
