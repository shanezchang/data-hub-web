// Insight:官方话语的交接棒——精准扶贫↘ 乡村振兴↗,附消退词电池。
// 数据快照 lib/insights-data/policy-vocabulary-handoff.json(2026-06-11 主编逐项复现)。

import type { Metadata } from "next";
import Link from "next/link";
import { DualLineChart, LineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/policy-vocabulary-handoff.json";

export const metadata: Metadata = {
  title: "The vocabulary handoff: how 精准扶贫 gave way to 乡村振兴 in China's official news",
  description:
    "Targeted poverty alleviation peaked at 75 CCTV Xinwen Lianbo items in 2017 and fell to zero by 2023; rural revitalization appeared in 2017 and peaked at 211 items in 2021. Four more once-dominant policy phrases that faded from the broadcast, in data.",
  alternates: { canonical: "/insights/policy-vocabulary-handoff" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The vocabulary handoff: 精准扶贫 → 乡村振兴 in China's official news",
  description:
    "Year-by-year mention counts showing the handoff from targeted poverty alleviation to rural revitalization in CCTV Xinwen Lianbo, plus a battery of faded policy phrases.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

export default function HandoffPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Insight · Vocabulary</p>
      <h1 className="text-3xl font-bold leading-tight">
        The vocabulary handoff: 精准扶贫 → 乡村振兴
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Policy campaigns leave a precise trace in China&apos;s flagship news broadcast. 精准扶贫
        (targeted poverty alleviation) peaked at 75 Xinwen Lianbo items in 2017, declined every year
        after, and recorded zero mentions in 2023 — consistent with the campaign&apos;s declared
        completion in 2021. Its successor term 乡村振兴 (rural revitalization) first appeared in 2017,
        the same year its predecessor peaked, and rose to 211 items by 2021. The crossover is visible
        to the year.
      </p>

      <h2 className="mt-12 text-xl font-bold">The handoff, year by year</h2>
      <div className="mt-4 rounded-lg border border-line bg-bg-soft p-3">
        <DualLineChart
          a={{ label: "乡村振兴 (rural revitalization)", byYear: data.xczx }}
          b={{ label: "精准扶贫 (targeted poverty alleviation)", byYear: data.jzfp }}
        />
      </div>

      <h2 className="mt-14 text-xl font-bold">Four more phrases that faded from the broadcast</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        The same query run over a battery of once-dominant policy phrases. 去产能 (capacity
        reduction) is the most complete disappearance: 40 items in 2016, none at all since 2023.
        供给侧结构性改革 (supply-side structural reform) shows the largest absolute fall — from 207
        items in 2017 to single digits.
      </p>
      <div className="mt-6 space-y-10">
        {data.decliners.map((d) => (
          <section key={d.zh}>
            <h3 className="text-lg font-bold">
              {d.en} <span className="ml-1 font-normal text-muted">{d.zh}</span>
            </h3>
            <p className="mt-1 text-sm text-muted">peak {d.peak} items in {d.peak_year}</p>
            <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3">
              <LineChart byYear={d.by_year as Record<string, number>} />
            </div>
          </section>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· Counts: <code className="font-mono text-fg">GET /v1/news?q=&lt;phrase&gt;&amp;group_by=year</code> — broadcast items containing the exact phrase, from full transcripts of every Xinwen Lianbo since 2016.</li>
        <li>· Exact-phrase matching undercounts synonyms and reformulations; treat curves as lower bounds on attention.</li>
        <li>· The corpus starts in 2016, so terms already established earlier have a truncated left side — a &ldquo;2016 peak&rdquo; may understate the true peak.</li>
        <li>· The latest year is partial. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Run the same battery on any vocabulary via the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo full-text API</Link>.
        More findings: <Link href="/insights" className="text-accent hover:underline">Data Insights</Link>
        {" · "}
        <Link href="/trends/xinwen-lianbo-keywords" className="text-accent hover:underline">keyword trends</Link>.
      </p>
    </main>
  );
}
