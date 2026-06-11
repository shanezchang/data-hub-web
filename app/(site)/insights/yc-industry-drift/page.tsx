// Insight:YC 行业构成二十年漂移——Consumer 时代落幕,B2B 成为绝对主体。
// 数据快照 lib/insights-data/yc-industry-drift.json(主编直查生成,2026-06-11)。

import type { Metadata } from "next";
import Link from "next/link";
import { DualLineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/yc-industry-drift.json";

export const metadata: Metadata = {
  title: "YC's consumer era is over: two decades of industry drift, in data",
  description:
    "In 2008, half of Y Combinator's batch was consumer startups. By 2026, consumer is down to ~5% while B2B exceeds 60%. Industry composition of every YC batch year since 2008, from the public directory.",
  alternates: { canonical: "/insights/yc-industry-drift" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "YC's consumer era is over: two decades of industry drift",
  description:
    "Industry composition of every Y Combinator batch year since 2008, showing the decline of consumer startups and the rise of B2B.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/yc",
};

type YearRow = { total: number } & Record<string, number>;

export default function YcIndustryDriftPage() {
  const byYear = data.by_year as Record<string, YearRow>;
  const years = Object.keys(byYear).sort();
  const sharePct = (industry: string) =>
    Object.fromEntries(
      years.map((y) => [y, Math.round(((byYear[y][industry] ?? 0) / byYear[y].total) * 1000) / 10])
    ) as Record<string, number>;

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Insight · Y Combinator</p>
      <h1 className="text-3xl font-bold leading-tight">
        YC&apos;s consumer era is over: two decades of industry drift
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        In 2008, just over half of Y Combinator&apos;s funded companies were consumer startups and
        B2B was the other half of the story. The two curves have been diverging ever since: by the
        2026 batches, B2B accounts for over 60% of companies while consumer has shrunk to roughly
        one in twenty. The drift is visible batch by batch — one
        two-dimensional aggregation over YC&apos;s own public directory.
      </p>

      <h2 className="mt-12 text-xl font-bold">B2B vs Consumer, share of each batch year (%)</h2>
      <div className="mt-4 rounded-lg border border-line bg-bg-soft p-3">
        <DualLineChart
          a={{ label: "B2B share %", byYear: sharePct("B2B") }}
          b={{ label: "Consumer share %", byYear: sharePct("Consumer") }}
        />
      </div>

      <h2 className="mt-12 text-xl font-bold">All numbers (companies per batch year by industry)</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">Year</th>
              <th className="px-3 py-2 font-semibold">Total</th>
              {data.industries.map((ind) => (
                <th key={ind} className="px-3 py-2 font-semibold">{ind}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y} className="border-t border-line">
                <td className="px-3 py-1.5 font-mono">{y}</td>
                <td className="px-3 py-1.5 font-mono text-muted">{byYear[y].total}</td>
                {data.industries.map((ind) => (
                  <td key={ind} className="px-3 py-1.5 font-mono text-muted">{byYear[y][ind] ?? 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology &amp; caveats</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· One query: <code className="font-mono text-fg">POST /v1/yc/companies/search</code> with{" "}
          <code className="font-mono text-fg">{"{\"group_by\":[\"batch_year\",\"industry\"]}"}</code>.</li>
        <li>· Industry labels are YC&apos;s own top-level taxonomy from the public directory; one industry per company.</li>
        <li>· 2005–2007 batches (under 20 companies each) are excluded from the chart as share noise; future announced batches are excluded as not yet complete.</li>
        <li>· The directory lists launched companies only. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Cross-cut by tag, region, or status via the{" "}
        <Link href="/datasets/yc" className="text-accent hover:underline">YC directory API</Link>.
        Related: <Link href="/trends/yc-batch-survival" className="text-accent hover:underline">batch survival rates</Link>
        {" · "}<Link href="/insights" className="text-accent hover:underline">all insights</Link>.
      </p>
    </main>
  );
}
