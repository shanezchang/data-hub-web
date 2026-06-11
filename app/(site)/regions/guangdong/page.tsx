// Regions 试点:广东 21 地级市的新闻联播出场记录(总量/逐年曲线/原文直链)。
// 数据快照 lib/regions-data/guangdong.json。查询形态纪律见页面 Methodology
// (中山/河源用市后缀防歧义,其余裸词)——详见 data-hub 仓库 docs/content-playbook.md。

import type { Metadata } from "next";
import Link from "next/link";
import { LineChart } from "@/components/trends/charts";
import data from "@/lib/regions-data/guangdong.json";

export const metadata: Metadata = {
  title: "Guangdong on Xinwen Lianbo: 21 cities, ten years of flagship-news coverage",
  description:
    "How often does each of Guangdong's 21 cities appear on CCTV Xinwen Lianbo? Year-by-year mention counts since 2016 — from Guangzhou (1,000+) to Yunfu (11) — with original broadcast links for every city.",
  alternates: { canonical: "/regions/guangdong" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guangdong on Xinwen Lianbo: 21 cities, ten years of coverage",
  description:
    "Year-by-year CCTV Xinwen Lianbo mention counts for all 21 prefecture-level cities of Guangdong province, with original broadcast links.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

export default function GuangdongPage() {
  const cities = [...data.cities].sort((a, b) => b.total - a.total);
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Regions · {data.province.en} 广东</p>
      <h1 className="text-3xl font-bold leading-tight">
        Guangdong on Xinwen Lianbo: 21 cities, ten years of coverage
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Appearing on Xinwen Lianbo — China&apos;s most-watched, most tightly scripted news
        broadcast — is a signal of what the center wants the country to see. This page indexes how
        often each of Guangdong&apos;s 21 prefecture-level cities has appeared since 2016, with the
        original CCTV broadcast linked for every city. Coverage is steeply concentrated: Guangzhou
        and Shenzhen each clear 1,000 items, the provincial median is in the dozens, and the
        quietest cities surface only a handful of times in a decade.
      </p>

      <h2 className="mt-12 text-xl font-bold">All 21 cities, ranked</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">City</th>
              <th className="px-3 py-2 font-semibold">Items (2016–present)</th>
              <th className="px-3 py-2 font-semibold">Query form</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.zh} className="border-t border-line">
                <td className="px-3 py-1.5"><a href={`#${c.pinyin.toLowerCase()}`} className="text-accent hover:underline">{c.pinyin} {c.zh}</a></td>
                <td className="px-3 py-1.5 font-mono text-muted">{c.total}</td>
                <td className="px-3 py-1.5 font-mono text-xs text-muted">{c.query}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 space-y-12">
        {cities.map((c) => (
          <section key={c.zh} id={c.pinyin.toLowerCase()}>
            <h2 className="text-xl font-bold">
              {c.pinyin} <span className="ml-1 font-normal text-muted">{c.zh}</span>
            </h2>
            <p className="mt-1 text-sm text-muted">{c.total} items since 2016</p>
            {Object.keys(c.by_year).length >= 2 && (
              <div className="mt-3 rounded-lg border border-line bg-bg-soft p-3">
                <LineChart byYear={c.by_year as Record<string, number>} />
              </div>
            )}
            {c.recent.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {c.recent.map((r) => (
                  <li key={r.url}>
                    <span className="font-mono text-xs">{r.date}</span> ·{" "}
                    <a href={r.url} target="_blank" rel="noopener" className="text-accent hover:underline">{r.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold">Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· Counts: <code className="font-mono text-fg">GET /v1/news?q=&lt;city&gt;&amp;group_by=year</code> — broadcast items whose transcript contains the query form shown in the table.</li>
        <li>· Query forms: nationally unique city names are queried bare (higher recall); ambiguous names use the 市-suffixed form — 中山市 (中山 collides with Sun Yat-sen namesakes) and 河源市 — trading recall for precision. Suffixed counts are lower bounds.</li>
        <li>· Mentions include any context (economy, weather, disasters, sports). Counts are items, not phrase frequency. The latest year is partial. Data as of {data.as_of}.</li>
        <li>· Listed broadcasts link to the original CCTV pages for independent verification.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Run the same index for any region via the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo full-text API</Link>.
        More findings: <Link href="/insights" className="text-accent hover:underline">Data Insights</Link>.
      </p>
    </main>
  );
}
