// 英文 programmatic 页:新闻联播关键词逐年趋势。
// 数据是构建期快照(lib/trends-data.json,带 as_of),由 data-hub 自家 API 聚合生成 ——
// 这是全网没有现成版本的独特内容,也是 GEO(被 LLM 引用)的主要饵。刷新 = 重跑生成脚本提交。

import type { Metadata } from "next";
import Link from "next/link";
import { LineChart } from "@/components/trends/charts";
import trends from "@/lib/trends-data.json";

export const metadata: Metadata = {
  title: "Xinwen Lianbo Keyword Trends (2016–present) · CCTV News Data",
  description:
    "How often does China's CCTV Xinwen Lianbo (新闻联播) mention AI, real estate, semiconductors, or Belt and Road? Year-by-year mention counts from full-text analysis of every broadcast since 2016.",
  alternates: { canonical: "/trends/xinwen-lianbo-keywords" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Xinwen Lianbo Keyword Trends (2016–present)",
  description:
    "Year-by-year keyword mention counts in CCTV Xinwen Lianbo, derived from full-text analysis of every broadcast item since 2016.",
  dateModified: trends.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

export default function XwlbTrendsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Trends · Xinwen Lianbo</p>
      <h1 className="text-3xl font-bold leading-tight">Xinwen Lianbo Keyword Trends</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Xinwen Lianbo (新闻联播) is CCTV&apos;s flagship 7pm news program — the most-watched and most
        tightly scripted broadcast in China, widely read as a signal of official policy priorities.
        The charts below count how many broadcast items mention each term per year, computed by
        full-text search over every item since 2016 in the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">data-hub Xinwen Lianbo dataset</Link>.
      </p>

      <div className="mt-12 space-y-12">
        {trends.keywords.map((k) => (
          <section key={k.zh}>
            <h2 className="text-xl font-bold">
              {k.en} <span className="ml-1 font-normal text-muted">{k.zh}</span>
            </h2>
            <p className="mt-1 text-sm text-muted">
              {k.total} mentions total · peak year{" "}
              {Object.entries(k.by_year).sort((a, b) => b[1] - a[1])[0][0]}
            </p>
            <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3">
              <LineChart byYear={k.by_year as Record<string, number>} />
            </div>
          </section>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold">All numbers</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">Year</th>
              {trends.keywords.map((k) => (
                <th key={k.zh} className="px-3 py-2 font-semibold">{k.zh}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(trends.keywords[0].by_year).sort().map((yr) => (
              <tr key={yr} className="border-t border-line">
                <td className="px-3 py-1.5 font-mono">{yr}</td>
                {trends.keywords.map((k) => (
                  <td key={k.zh} className="px-3 py-1.5 font-mono text-muted">
                    {(k.by_year as Record<string, number>)[yr] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· A &quot;mention&quot; = one broadcast item whose title or transcript contains the exact Chinese phrase.</li>
        <li>· Counts come from <code className="font-mono text-fg">GET /v1/news?q=&lt;term&gt;&amp;group_by=year</code> on the data-hub API.</li>
        <li>· The latest year is a partial year. Data as of {trends.as_of}.</li>
        <li>· Coverage starts 2016; earlier broadcasts are not in the corpus.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Build your own queries — any keyword, any date range, AND/OR combinations, daily granularity —
        via the <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo full-text API</Link>.
        AI agents can start from{" "}
        <a href="https://api.lumina-core.cn/llms.txt" target="_blank" rel="noopener" className="text-accent hover:underline">llms.txt</a>.
      </p>
    </main>
  );
}
