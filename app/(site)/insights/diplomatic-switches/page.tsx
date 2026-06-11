// Insight:八次外交转换在新闻联播里的样子。每国附转换公告当天的播报原文链接(一手信源,可二次核验)。
// 数据快照 lib/insights-data/diplomatic-switches.json(2026-06-11 主编逐项复现)。

import type { Metadata } from "next";
import Link from "next/link";
import { LineChart } from "@/components/trends/charts";
import data from "@/lib/insights-data/diplomatic-switches.json";

export const metadata: Metadata = {
  title: "Eight diplomatic switches, as seen from China's flagship newscast",
  description:
    "Panama, Dominican Republic, El Salvador, Solomon Islands, Kiribati, Nicaragua, Honduras, Nauru — what establishing diplomatic relations with Beijing looks like in CCTV Xinwen Lianbo coverage, with the original announcement broadcast linked for each country.",
  alternates: { canonical: "/insights/diplomatic-switches" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Eight diplomatic switches, as seen from China's flagship newscast",
  description:
    "Year-by-year Xinwen Lianbo mention counts for eight countries that established or restored diplomatic relations with the PRC since 2016, each with the original announcement broadcast linked.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

export default function DiplomaticSwitchesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Insight · Diplomacy</p>
      <h1 className="text-3xl font-bold leading-tight">
        Eight diplomatic switches, as seen from China&apos;s flagship newscast
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Since 2016, eight countries that previously maintained ties with Taipei have established or
        restored diplomatic relations with Beijing. Each switch follows the same visible pattern in
        CCTV Xinwen Lianbo: a near-zero baseline, an announcement-day broadcast (linked below for
        every country), a mention spike in the switch year or the year after, then an elevated
        baseline as state visits and cooperation coverage follows.
      </p>

      <div className="mt-12 space-y-12">
        {data.countries.map((c) => (
          <section key={c.zh}>
            <h2 className="text-xl font-bold">
              {c.en} <span className="ml-1 font-normal text-muted">{c.zh}</span>
            </h2>
            <p className="mt-1 text-sm text-muted">
              relations {c.type} {c.switch_date}
            </p>
            <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3">
              <LineChart byYear={c.by_year as Record<string, number>} />
            </div>
            <p className="mt-2 text-sm text-muted">
              Announcement broadcast ·{" "}
              <a href={c.first.url} target="_blank" rel="noopener" className="text-accent hover:underline">
                {c.first.title}
              </a>{" "}
              <span className="font-mono text-xs">({c.first.date})</span>
            </p>
          </section>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold">Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· Counts: <code className="font-mono text-fg">GET /v1/news?q=&lt;country name in Chinese&gt;&amp;group_by=year</code> — broadcast items containing the exact country name, from full transcripts of every Xinwen Lianbo since 2016.</li>
        <li>· Announcement links are the original CCTV broadcast pages, retrieved from the same dataset (each item stores its source URL) — verify any number yourself with one query.</li>
        <li>· Switch dates are the dates of the joint communiqués as reported in the linked broadcasts.</li>
        <li>· Mentions in non-diplomatic contexts (sports, disasters) are included; counts are items, not phrase frequency. The latest year is partial. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Chart any country&apos;s coverage the same way via the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo full-text API</Link>.
        More findings: <Link href="/insights" className="text-accent hover:underline">Data Insights</Link>.
      </p>
    </main>
  );
}
