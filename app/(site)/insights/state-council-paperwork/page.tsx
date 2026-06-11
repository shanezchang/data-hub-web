// Insight:国务院公文结构变迁——指令性文件(国发)萎缩,批复类(国函)成为主体。
// 数据快照 lib/insights-data/state-council-doctypes.json(2026-06-11 主编逐项复现:
// 2013/2019/2024/2025 年内交叉、总体分布、2020 明电计数均独立重查对数)。

import type { Metadata } from "next";
import Link from "next/link";
import { DualLineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/state-council-doctypes.json";

export const metadata: Metadata = {
  title: "From directives to approvals: how State Council paperwork changed, 2013–2025",
  description:
    "In 2013 China's State Council issued 86 major directives (国发) and 50 approval letters (国函). By 2024 the ratio had inverted: 10 directives, 51 approvals — and 2025 saw just 3 directives all year. A structural shift, measured from 6,000+ policy documents.",
  alternates: { canonical: "/insights/state-council-paperwork" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "From directives to approvals: how State Council paperwork changed, 2013–2025",
  description:
    "Year-by-year document-type composition of China State Council policy documents, showing the decline of 国发 directives and the rise of 国函 approvals.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/policy",
};

type YearRow = { total: number } & Record<string, number>;
const DOCTYPES = ["国发", "国办发", "国函", "国办函", "国发明电", "国办发明电", "其他"] as const;
const DOCTYPE_EN: Record<string, string> = {
  "国发": "Guofa · major directives",
  "国办发": "Guobanfa · General Office circulars",
  "国函": "Guohan · State Council replies/approvals",
  "国办函": "Guobanhan · General Office letters",
  "国发明电": "urgent telegrams (State Council)",
  "国办发明电": "urgent telegrams (General Office)",
  "其他": "other",
};

export default function PaperworkPage() {
  const byYear = data.by_year as Record<string, YearRow>;
  const years = Object.keys(byYear).sort();
  const pick = (t: string) =>
    Object.fromEntries(years.map((y) => [y, byYear[y][t] ?? 0])) as Record<string, number>;

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Insight · State Council</p>
      <h1 className="text-3xl font-bold leading-tight">
        From directives to approvals: the changing shape of State Council paperwork
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Chinese State Council documents carry their function in their serial number. 国发 (Guofa)
        marks major policy directives issued in the Council&apos;s own name; 国函 (Guohan) marks
        replies and approvals — answers to requests from ministries and provinces. In 2013 the
        library records 86 directives against 50 approvals. By 2024 the ratio had inverted to 10
        against 51, and 2025 saw just 3 国发 documents all year. The center&apos;s paper output,
        by this measure, shifted from issuing instructions to approving requests.
      </p>

      <h2 className="mt-12 text-xl font-bold">Directives vs approvals, 2013–present</h2>
      <div className="mt-4 rounded-lg border border-line bg-bg-soft p-3">
        <DualLineChart
          a={{ label: "国函 approvals/replies", byYear: pick("国函") }}
          b={{ label: "国发 major directives", byYear: pick("国发") }}
        />
      </div>
      <p className="mt-3 text-sm text-muted">
        Crossover around 2019. (2016 and 2018 totals include archival batch uploads — see
        methodology — but the 国发 decline holds across the clean 2019+ window.)
      </p>

      <h2 className="mt-12 text-xl font-bold">One anomaly: the 2020 telegram spike</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        明电 (urgent telegrams) are the rarest format — 104 documents in three decades. 2020 alone
        accounts for 23 of them ({data.mingdian_2020["国发明电"]} State Council + {data.mingdian_2020["国办发明电"]} General
        Office), 15.9% of that year&apos;s entire output; no other clean year exceeds 7. The spike
        coincides with the COVID-19 emergency-response year.
      </p>

      <h2 className="mt-12 text-xl font-bold">All numbers (documents per year by type)</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">Year</th>
              <th className="px-3 py-2 font-semibold">Total</th>
              {DOCTYPES.map((t) => (
                <th key={t} className="px-3 py-2 font-semibold">{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((y) => (
              <tr key={y} className="border-t border-line">
                <td className="px-3 py-1.5 font-mono">{y}</td>
                <td className="px-3 py-1.5 font-mono text-muted">{byYear[y].total}</td>
                {DOCTYPES.map((t) => (
                  <td key={t} className="px-3 py-1.5 font-mono text-muted">{byYear[y][t] ?? 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">Document types, decoded</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-line">
        {DOCTYPES.map((t, i) => (
          <div key={t} className={`flex items-baseline gap-4 px-5 py-3 ${i ? "border-t border-line" : ""}`}>
            <code className="shrink-0 font-mono text-sm text-fg">{t}</code>
            <span className="text-sm text-muted">{DOCTYPE_EN[t]} · {(data.overall as Record<string, number>)[t]} docs overall</span>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology &amp; caveats</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· Counts: <code className="font-mono text-fg">POST /v1/policy/search</code> with{" "}
          <code className="font-mono text-fg">{"{\"group_by\":[\"year\",\"doctype\"]}"}</code>; document type is extracted from the official serial number (发文字号).</li>
        <li>· The library indexes documents by web-publication date. 2016 and 2018 include archival batch uploads of older documents (verifiable: documents published 2018-08 carry 2012–2013 serial numbers), inflating those years&apos; totals. Volume claims are safest for 2019+, where output is a steady 90–165 docs/year with no batch events.</li>
        <li>· &ldquo;其他&rdquo; covers serial-number formats outside the six standard series.</li>
        <li>· The latest year is partial. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Slice the corpus yourself — by theme, issuing organ, or full-text query — via the{" "}
        <Link href="/datasets/policy" className="text-accent hover:underline">State Council policy API</Link>.
        More findings: <Link href="/insights" className="text-accent hover:underline">Data Insights</Link>.
      </p>
    </main>
  );
}
