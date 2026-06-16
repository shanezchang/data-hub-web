import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DATASETS, getDataset } from "@/lib/datasets";
import { API_BASE, API_DOCS, SITE_URL } from "@/lib/site";

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
    url: `${SITE_URL}/datasets/${d.slug}`,
    temporalCoverage: d.temporalCoverage,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "data-hub", url: SITE_URL },
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
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Dataset · {dataset.slug}</p>
      <h1 className="text-3xl font-bold leading-tight">{dataset.enTitle}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{dataset.name}</p>
      <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{dataset.tagline}</p>

      <ul className="mt-6 space-y-1.5 text-sm">
        {dataset.coverage.map((f) => (
          <li key={f} className="flex items-center gap-2 text-muted-foreground">
            <span className="size-1 rounded-full bg-brand" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 text-xl font-bold">Overview</h2>
      {dataset.enOverview.map((p) => (
        <p key={p.slice(0, 24)} className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{p}</p>
      ))}

      <h2 className="mt-12 text-xl font-bold">核心字段 · Key fields</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        {dataset.fields.map((f, i) => (
          <div key={f.name} className={`flex items-baseline gap-4 px-5 py-3 ${i ? "border-t border-border" : ""}`}>
            <code className="shrink-0 font-mono text-sm text-foreground">{f.name}</code>
            <span className="text-sm text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">端点</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        {dataset.endpoints.map((e, i) => (
          <div key={e.path + e.method} className={`px-5 py-4 ${i ? "border-t border-border" : ""}`}>
            <p className="flex items-center gap-2.5 font-mono text-sm">
              <span className={`rounded border px-1.5 py-0.5 text-[11px] font-semibold ${e.method === "GET" ? "border-brand/40 text-brand" : "border-border text-foreground"}`}>
                {e.method}
              </span>
              <span>{e.path}</span>
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">{e.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">调用</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        认证使用 <code className="font-mono text-foreground">X-API-Key</code> header,key 需带{" "}
        <code className="font-mono text-foreground">{dataset.scope}</code> scope(控制台生成的 key 默认包含)。
      </p>
      <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted px-4 py-3 font-mono text-xs leading-relaxed">{dataset.exampleCurl}</pre>

      <p className="mt-6 text-sm text-muted-foreground">
        完整参数与响应结构见{" "}
        <a href={API_DOCS} target="_blank" rel="noopener" className="text-brand hover:underline">API 文档</a>
        ;AI Agent 接入见{" "}
        <a href={`${API_BASE}/llms.txt`} target="_blank" rel="noopener" className="text-brand hover:underline">llms.txt</a>。
      </p>

      {TREND_LINKS[dataset.slug] && (
        <p className="mt-6 text-sm text-muted-foreground">
          See it in action ·{" "}
          <Link href={TREND_LINKS[dataset.slug].href} className="text-brand hover:underline">
            {TREND_LINKS[dataset.slug].label}
          </Link>
        </p>
      )}

      <p className="mt-12">
        <Link href="/#datasets" className="text-sm text-muted-foreground hover:text-foreground">← 全部数据集</Link>
      </p>
    </main>
  );
}
