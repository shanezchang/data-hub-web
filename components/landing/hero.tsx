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
          <div key={l}>
            <dt className="font-mono text-2xl font-semibold">{n}</dt>
            <dd className="text-sm text-muted">{l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
