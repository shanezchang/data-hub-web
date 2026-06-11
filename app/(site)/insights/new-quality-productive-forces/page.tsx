// Insight:新质生产力的"冷启动"——一个官方术语的完整出生记录。
// 数据快照 lib/insights-data/new-quality-productive-forces.json(2026-06-11 主编逐项复现)。

import type { Metadata } from "next";
import Link from "next/link";
import { DualLineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/new-quality-productive-forces.json";

export const metadata: Metadata = {
  title: "“New Quality Productive Forces”: a Chinese policy slogan's cold start, measured",
  description:
    "新质生产力 went from zero to 269 CCTV Xinwen Lianbo items within one year of first appearing in late 2023 — with State Council policy documents following exactly one year later. The full birth record of a policy term, in data.",
  alternates: { canonical: "/insights/new-quality-productive-forces" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "“New Quality Productive Forces”: a policy slogan's cold start, measured",
  description:
    "Year-by-year mention counts of 新质生产力 in CCTV Xinwen Lianbo broadcasts and State Council policy documents, from first appearance in 2023.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

export default function NqpfPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Insight · 新质生产力</p>
      <h1 className="text-3xl font-bold leading-tight">
        &ldquo;New Quality Productive Forces&rdquo;: a slogan&apos;s cold start, measured
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Most policy vocabulary builds up gradually. 新质生产力 (&ldquo;new quality productive
        forces&rdquo;) did not: the term does not appear in a single CCTV Xinwen Lianbo broadcast
        before 2023, shows up in 18 items that year, and explodes to 269 items in 2024 — one of the
        fastest cold starts measurable in a decade of broadcast transcripts. State Council policy
        documents follow with a clean one-year lag: zero documents until 2024, then 4 in 2024 and
        10 in 2025.
      </p>

      <h2 className="mt-12 text-xl font-bold">News vs policy documents, year by year</h2>
      <div className="mt-4 rounded-lg border border-line bg-bg-soft p-3">
        <DualLineChart
          a={{ label: "Xinwen Lianbo items", byYear: data.news }}
          b={{ label: "State Council documents", byYear: data.policy }}
        />
      </div>
      <p className="mt-3 text-sm text-muted">
        The broadcast led; the documents followed. By the time the first State Council document
        containing the phrase appeared, Xinwen Lianbo had already mentioned it in ~290 items.
      </p>

      <h2 className="mt-12 text-xl font-bold">All numbers</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">Year</th>
              <th className="px-3 py-2 font-semibold">Xinwen Lianbo items</th>
              <th className="px-3 py-2 font-semibold">State Council documents</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys({ ...data.news, ...data.policy }).sort().map((yr) => (
              <tr key={yr} className="border-t border-line">
                <td className="px-3 py-1.5 font-mono">{yr}</td>
                <td className="px-3 py-1.5 font-mono text-muted">{(data.news as Record<string, number>)[yr] ?? 0}</td>
                <td className="px-3 py-1.5 font-mono text-muted">{(data.policy as Record<string, number>)[yr] ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· News counts: <code className="font-mono text-fg">GET /v1/news?q=新质生产力&amp;group_by=year</code> — broadcast items whose title or transcript contains the exact phrase.</li>
        <li>· Policy counts: <code className="font-mono text-fg">GET /v1/policy?q=新质生产力&amp;group_by=year</code> — State Council documents (国发/国办发 series) containing the exact phrase.</li>
        <li>· Exact-phrase matching; paraphrases are not counted. Counts are items/documents, not phrase frequency.</li>
        <li>· The latest year is partial. News corpus covers 2016–present; policy corpus 1996–present. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Trace any term&apos;s birth the same way via the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo API</Link> and{" "}
        <Link href="/datasets/policy" className="text-accent hover:underline">State Council policy API</Link>.
        More findings: <Link href="/insights" className="text-accent hover:underline">Data Insights</Link>.
      </p>
    </main>
  );
}
