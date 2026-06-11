// 英文 programmatic 页:YC 批次存活结局。数据同 trends-data.json 快照纪律。

import type { Metadata } from "next";
import Link from "next/link";
import { StackedBar, StatusLegend, STATUS_ORDER } from "@/components/trends/charts";
import trends from "@/lib/trends-data.json";

export const metadata: Metadata = {
  title: "Y Combinator Batch Survival Rates (2005–present) · YC Data",
  description:
    "What share of each Y Combinator batch is still active, acquired, public, or inactive? Outcome breakdowns for every YC batch year, from the public YC company directory.",
  alternates: { canonical: "/trends/yc-batch-survival" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Y Combinator Batch Survival Rates (2005–present)",
  description:
    "Outcome breakdown (Active / Acquired / Public / Inactive) for every Y Combinator batch year, derived from the public YC company directory.",
  dateModified: trends.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/yc",
};

type Bucket = { key: string | number; count: number; sub: { key: string; count: number }[] };

export default function YcSurvivalPage() {
  const years = (trends.yc_survival as Bucket[])
    .slice()
    .sort((a, b) => Number(a.key) - Number(b.key));

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Trends · Y Combinator</p>
      <h1 className="text-3xl font-bold leading-tight">Y Combinator Batch Survival Rates</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        For every YC batch year since 2005: how many companies are still active, how many were
        acquired, went public, or shut down — according to the public YC company directory, queried
        through the <Link href="/datasets/yc" className="text-accent hover:underline">data-hub YC dataset</Link>{" "}
        with a single two-dimensional aggregation.
      </p>

      <div className="mt-8"><StatusLegend /></div>

      <div className="mt-6 space-y-5">
        {years.map((y) => {
          const counts = Object.fromEntries(y.sub.map((s) => [s.key, s.count]));
          const active = counts["Active"] ?? 0;
          const pct = y.count ? Math.round((active / y.count) * 1000) / 10 : 0;
          return (
            <div key={String(y.key)}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-mono font-semibold">{y.key}</span>
                <span className="text-muted">{y.count} companies · {pct}% active</span>
              </div>
              <div className="mt-1.5"><StackedBar counts={counts} /></div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-14 text-xl font-bold">All numbers</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">Batch year</th>
              <th className="px-3 py-2 font-semibold">Total</th>
              {STATUS_ORDER.map((s) => (
                <th key={s} className="px-3 py-2 font-semibold">{s}</th>
              ))}
              <th className="px-3 py-2 font-semibold">% Active</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => {
              const counts = Object.fromEntries(y.sub.map((s) => [s.key, s.count]));
              const pct = y.count ? Math.round(((counts["Active"] ?? 0) / y.count) * 1000) / 10 : 0;
              return (
                <tr key={String(y.key)} className="border-t border-line">
                  <td className="px-3 py-1.5 font-mono">{y.key}</td>
                  <td className="px-3 py-1.5 font-mono text-muted">{y.count}</td>
                  {STATUS_ORDER.map((s) => (
                    <td key={s} className="px-3 py-1.5 font-mono text-muted">{counts[s] ?? 0}</td>
                  ))}
                  <td className="px-3 py-1.5 font-mono text-muted">{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology &amp; caveats</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· Source: the public Y Combinator company directory (launched companies only; stealth companies are not listed).</li>
        <li>· Status labels (Active / Acquired / Public / Inactive) are YC&apos;s own, as published in the directory.</li>
        <li>· Recent batches naturally show high active rates — most failure happens years later. Compare cohorts of similar age.</li>
        <li>· One query: <code className="font-mono text-fg">POST /v1/yc/companies/search</code> with{" "}
          <code className="font-mono text-fg">{"{\"group_by\":[\"batch_year\",\"status\"]}"}</code>. Data as of {trends.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Slice it differently — by industry, region, tag, or team size — via the{" "}
        <Link href="/datasets/yc" className="text-accent hover:underline">YC directory API</Link>. AI agents can
        start from <a href="https://api.lumina-core.cn/llms.txt" target="_blank" rel="noopener" className="text-accent hover:underline">llms.txt</a>.
      </p>
    </main>
  );
}
