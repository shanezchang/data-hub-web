// Insight:国务院发文主题——总体构成 + 干净窗口(2019+)内的升降。
// 数据快照 lib/insights-data/policy-themes.json(主编直查生成,2026-06-11)。

import type { Metadata } from "next";
import Link from "next/link";
import { LineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/policy-themes.json";

export const metadata: Metadata = {
  title: "What the State Council writes about: policy themes across three decades",
  description:
    "Trade/customs/tourism is the largest theme in China's State Council document library. Since 2019, land-and-energy is the clearest riser (3 docs in 2019 → 41 in 2024); health spiked through the pandemic years then faded.",
  alternates: { canonical: "/insights/policy-themes" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What the State Council writes about: policy themes across three decades",
  description:
    "Theme composition of China State Council policy documents, overall and year-by-year in the clean 2019+ window.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/policy",
};

const THEME_EN: Record<string, string> = {
  "商贸、海关、旅游": "Trade, customs & tourism",
  "城乡建设、环境保护": "Urban-rural development & environment",
  "综合政务": "General governance",
  "国土资源、能源": "Land resources & energy",
  "工业、交通": "Industry & transport",
  "农业、林业、水利": "Agriculture, forestry & water",
  "财政、金融、审计": "Finance & audit",
  "国民经济管理、国有资产监管": "Economic management & state assets",
  "卫生、体育": "Health & sport",
  "市场监管、安全生产监管": "Market & safety regulation",
  "科技、教育": "Science & education",
};

export default function PolicyThemesPage() {
  const maxOverall = data.overall_top[0].count;
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Insight · State Council</p>
      <h1 className="text-3xl font-bold leading-tight">
        What the State Council writes about
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        Every document in the State Council policy library carries one of 22 official theme labels.
        Across the full archive, trade-customs-tourism is the single largest domain. The
        year-by-year view (kept to the clean 2019+ window — see methodology) shows the recent
        movers: land-and-energy documents grew from 3 in 2019 to 41 in 2024, mostly approval
        letters; health-and-sport spiked through 2020–2021 and faded after.
      </p>

      <h2 className="mt-12 text-xl font-bold">Largest themes, full archive</h2>
      <div className="mt-4 space-y-2">
        {data.overall_top.map((t) => (
          <div key={t.theme} className="flex items-center gap-3">
            <span className="w-56 shrink-0 truncate text-sm" title={t.theme}>
              {THEME_EN[t.theme] ?? t.theme} <span className="text-xs text-muted-foreground">{t.theme}</span>
            </span>
            <div className="h-4 rounded-sm bg-brand/70" style={{ width: `${(t.count / maxOverall) * 100}%` }} />
            <span className="font-mono text-xs text-muted-foreground">{t.count}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Movers in the clean window (2019–present)</h2>
      <div className="mt-4 space-y-10">
        {Object.entries(data.tracked).map(([theme, byYear]) => (
          <section key={theme}>
            <h3 className="text-lg font-bold">
              {THEME_EN[theme] ?? theme} <span className="ml-1 font-normal text-muted-foreground">{theme}</span>
            </h3>
            <div className="mt-3 rounded-lg border border-border bg-muted p-3">
              <LineChart byYear={byYear as Record<string, number>} />
            </div>
          </section>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology &amp; caveats</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <li>· Queries: <code className="font-mono text-foreground">GET /v1/policy?group_by=theme</code> (overall) and{" "}
          <code className="font-mono text-foreground">POST /v1/policy/search</code> with{" "}
          <code className="font-mono text-foreground">{"{\"group_by\":[\"year\",\"theme\"],\"start_date\":\"2019-01-01\"}"}</code>.</li>
        <li>· Theme labels are the source library&apos;s own top-level classification; one theme per document.</li>
        <li>· Yearly charts start at 2019 because earlier years contain archival batch uploads indexed under publication date (e.g., 94 old land-use approvals landed in 2018-08), which would distort theme trends.</li>
        <li>· The latest year is partial. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
        Filter any theme&apos;s documents in full text via the{" "}
        <Link href="/datasets/policy" className="text-brand hover:underline">State Council policy API</Link>.
        Related: <Link href="/insights/state-council-paperwork" className="text-brand hover:underline">document types</Link>
        {" · "}<Link href="/insights" className="text-brand hover:underline">all insights</Link>.
      </p>
    </main>
  );
}
