import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASETS, getDataset } from "@/lib/datasets";
import { API_BASE, API_DOCS } from "@/lib/site";

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const dataset = getDataset((await params).slug);
  if (!dataset) return {};
  return {
    title: dataset.name,
    description: dataset.tagline,
    alternates: { canonical: `/datasets/${dataset.slug}` },
  };
}

export default async function DatasetPage({ params }: { params: Promise<{ slug: string }> }) {
  const dataset = getDataset((await params).slug);
  if (!dataset) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Dataset · {dataset.slug}</p>
      <h1 className="text-3xl font-bold leading-tight">{dataset.name}</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">{dataset.tagline}</p>

      <ul className="mt-6 space-y-1.5 text-sm">
        {dataset.coverage.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted">
            <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-bold">端点</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-line">
        {dataset.endpoints.map((e, i) => (
          <div key={e.path + e.method} className={`px-5 py-4 ${i ? "border-t border-line" : ""}`}>
            <p className="flex items-center gap-2.5 font-mono text-sm">
              <span className={`rounded border px-1.5 py-0.5 text-[11px] font-semibold ${e.method === "GET" ? "border-accent/40 text-accent" : "border-line text-fg"}`}>
                {e.method}
              </span>
              <span>{e.path}</span>
            </p>
            <p className="mt-1.5 text-sm text-muted">{e.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">调用</h2>
      <p className="mt-2 text-sm text-muted">
        认证使用 <code className="font-mono text-fg">X-API-Key</code> header,key 需带{" "}
        <code className="font-mono text-fg">{dataset.scope}</code> scope(控制台生成的 key 默认包含)。
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-bg-soft px-4 py-3 font-mono text-xs leading-relaxed">{dataset.exampleCurl}</pre>

      <p className="mt-6 text-sm text-muted">
        完整参数与响应结构见{" "}
        <a href={API_DOCS} target="_blank" rel="noopener" className="text-accent hover:underline">API 文档</a>
        ;AI Agent 接入见{" "}
        <a href={`${API_BASE}/llms.txt`} target="_blank" rel="noopener" className="text-accent hover:underline">llms.txt</a>。
      </p>

      <p className="mt-12">
        <Link href="/#datasets" className="text-sm text-muted hover:text-fg">← 全部数据集</Link>
      </p>
    </main>
  );
}
