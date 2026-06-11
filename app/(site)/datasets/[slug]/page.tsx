import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASETS, getDataset } from "@/lib/datasets";
import { API_BASE, API_DOCS } from "@/lib/site";

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }));
}

// 数据集 → 对应趋势页(programmatic 内容的内链入口)
const TREND_LINKS: Record<string, { href: string; label: string }> = {
  news: { href: "/trends/xinwen-lianbo-keywords", label: "Xinwen Lianbo keyword trends (2016–present)" },
  yc: { href: "/trends/yc-batch-survival", label: "YC batch survival rates (2005–present)" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const dataset = getDataset((await params).slug);
  if (!dataset) return {};
  return {
    // 英文标题直接打目标买家的搜索词;中文名保留在 description 与正文
    title: dataset.enTitle,
    description: `${dataset.enTagline} ${dataset.tagline}`,
    alternates: { canonical: `/datasets/${dataset.slug}` },
  };
}

// schema.org/Dataset:Google Dataset Search 的用户(研究员/分析师)就是目标 persona
function datasetJsonLd(d: NonNullable<ReturnType<typeof getDataset>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: d.enTitle,
    alternateName: d.name,
    description: d.enTagline,
    url: `https://console.lumina-core.cn/datasets/${d.slug}`,
    temporalCoverage: d.temporalCoverage,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "data-hub", url: "https://console.lumina-core.cn" },
    distribution: d.endpoints.map((e) => ({
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `https://api.lumina-core.cn${e.path.replace(/\{[^}]+\}/g, "")}`,
    })),
  };
}

export default async function DatasetPage({ params }: { params: Promise<{ slug: string }> }) {
  const dataset = getDataset((await params).slug);
  if (!dataset) notFound();

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd(dataset)) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Dataset · {dataset.slug}</p>
      <h1 className="text-3xl font-bold leading-tight">{dataset.enTitle}</h1>
      <p className="mt-2 text-lg text-muted">{dataset.name}</p>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">{dataset.tagline}</p>

      <ul className="mt-6 space-y-1.5 text-sm">
        {dataset.coverage.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted">
            <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-bold">Overview</h2>
      {dataset.enOverview.map((p) => (
        <p key={p.slice(0, 24)} className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{p}</p>
      ))}

      <h2 className="mt-12 text-xl font-bold">核心字段 · Key fields</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-line">
        {dataset.fields.map((f, i) => (
          <div key={f.name} className={`flex items-baseline gap-4 px-5 py-3 ${i ? "border-t border-line" : ""}`}>
            <code className="shrink-0 font-mono text-sm text-fg">{f.name}</code>
            <span className="text-sm text-muted">{f.desc}</span>
          </div>
        ))}
      </div>

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

      {TREND_LINKS[dataset.slug] && (
        <p className="mt-6 text-sm text-muted">
          See it in action ·{" "}
          <Link href={TREND_LINKS[dataset.slug].href} className="text-accent hover:underline">
            {TREND_LINKS[dataset.slug].label}
          </Link>
        </p>
      )}

      <p className="mt-12">
        <Link href="/#datasets" className="text-sm text-muted hover:text-fg">← 全部数据集</Link>
      </p>
    </main>
  );
}
