// Insight:YC 公司地理——国际化的来与回(2012 年 6% → 2022 年 40% → 2025 年 9%)。
// 数据快照 lib/insights-data/yc-geography.json(主编直查生成,2026-06-11)。

import type { Metadata } from "next";
import Link from "next/link";
import { DualLineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/yc-geography.json";

export const metadata: Metadata = {
  title: "YC went global, then came home: company geography by batch year",
  description:
    "Non-US companies were 6% of YC's 2012 intake, 40% at the 2022 peak, and back to ~9% by 2025. Two decades of Y Combinator company geography from the public directory.",
  alternates: { canonical: "/insights/yc-geography" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "YC went global, then came home: company geography by batch year",
  description:
    "Share of non-US companies in each Y Combinator batch year, from the public YC directory.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/yc",
};

const COUNTRY_NAMES: Record<string, string> = {
  GB: "United Kingdom", IN: "India", CA: "Canada", MX: "Mexico", FR: "France",
  DE: "Germany", BR: "Brazil", SG: "Singapore", NG: "Nigeria", AU: "Australia",
  IL: "Israel", CO: "Colombia", ID: "Indonesia", EG: "Egypt", PK: "Pakistan",
};

type YearRow = { total: number; us: number; intl: number; intl_pct: number };

export default function YcGeographyPage() {
  const byYear = data.by_year as Record<string, YearRow>;
  const years = Object.keys(byYear).sort();
  const usPct = Object.fromEntries(years.map((y) => [y, Math.round((byYear[y].us / byYear[y].total) * 1000) / 10]));
  const intlPct = Object.fromEntries(years.map((y) => [y, byYear[y].intl_pct]));

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Insight · Y Combinator</p>
      <h1 className="text-3xl font-bold leading-tight">
        YC went global, then came home
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        For most of its first decade, Y Combinator was an American program: non-US companies made
        up under 6% of the 2012 intake. The international share then climbed for a decade and
        peaked at 40% in the 2022 batches — before collapsing back to single digits by 2025. The
        round trip is visible in one aggregation over the public directory&apos;s country field.
      </p>

      <h2 className="mt-12 text-xl font-bold">US vs international share of each batch year (%)</h2>
      <div className="mt-4 rounded-lg border border-border bg-muted p-3">
        <DualLineChart
          a={{ label: "US share %", byYear: usPct }}
          b={{ label: "International share %", byYear: intlPct }}
        />
      </div>

      <h2 className="mt-12 text-xl font-bold">All numbers</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left">
              <th className="px-3 py-2 font-semibold">Batch year</th>
              <th className="px-3 py-2 font-semibold">Companies</th>
              <th className="px-3 py-2 font-semibold">US</th>
              <th className="px-3 py-2 font-semibold">International</th>
              <th className="px-3 py-2 font-semibold">Intl %</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y} className="border-t border-border">
                <td className="px-3 py-1.5 font-mono">{y}</td>
                <td className="px-3 py-1.5 font-mono text-muted-foreground">{byYear[y].total}</td>
                <td className="px-3 py-1.5 font-mono text-muted-foreground">{byYear[y].us}</td>
                <td className="px-3 py-1.5 font-mono text-muted-foreground">{byYear[y].intl}</td>
                <td className="px-3 py-1.5 font-mono text-muted-foreground">{byYear[y].intl_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">Top non-US countries, all time</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        {data.top_intl.map((c, i) => (
          <div key={c.code} className={`flex items-baseline justify-between px-5 py-2.5 ${i ? "border-t border-border" : ""}`}>
            <span className="text-sm">{COUNTRY_NAMES[c.code] ?? c.code} <span className="font-mono text-xs text-muted-foreground">{c.code}</span></span>
            <span className="font-mono text-sm text-muted-foreground">{c.count}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology &amp; caveats</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <li>· One query: <code className="font-mono text-foreground">POST /v1/yc/companies/search</code> with{" "}
          <code className="font-mono text-foreground">{"{\"group_by\":[\"batch_year\",\"country\"]}"}</code>.</li>
        <li>· Country is the company&apos;s listed HQ country in the YC directory — not founder nationality; companies that relocate to the US after acceptance typically list US.</li>
        <li>· Companies without a listed country are excluded from shares. 2005–2007 batches excluded (small n); future announced batches excluded.</li>
        <li>· Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
        Slice by region, tag, or status via the{" "}
        <Link href="/datasets/yc" className="text-brand hover:underline">YC directory API</Link>.
        Related: <Link href="/insights/yc-industry-drift" className="text-brand hover:underline">industry drift</Link>
        {" · "}<Link href="/trends/yc-batch-survival" className="text-brand hover:underline">batch survival</Link>.
      </p>
    </main>
  );
}
