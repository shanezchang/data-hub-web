// Insight:新词出生证——11 个术语首次登上新闻联播的精确日期与首播原文链接。
// 数据快照 lib/insights-data/vocabulary-birth-certificates.json(主编直查生成,2026-06-11;
// 专精特新因语料左截断剔除——t0 距 2016 语料起点过近,词实际 2011 已有)。

import type { Metadata } from "next";
import Link from "next/link";
import data from "@/lib/insights-data/vocabulary-birth-certificates.json";

export const metadata: Metadata = {
  title: "Birth certificates: when new vocabulary first hit China's flagship newscast",
  description:
    "The exact first broadcast of 碳中和 (via Nordic news, 2019), 双循环 (Politburo meeting, 2020), 新质生产力 (a Xi inspection trip, 2023) and eight more terms — each with the original CCTV broadcast linked.",
  alternates: { canonical: "/insights/vocabulary-birth-certificates" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Birth certificates: when new vocabulary first hit China's flagship newscast",
  description:
    "First-appearance dates of new policy and technology vocabulary in CCTV Xinwen Lianbo, each with the original broadcast linked.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

export default function BirthCertificatesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Insight · Vocabulary</p>
      <h1 className="text-3xl font-bold leading-tight">
        Birth certificates: when new vocabulary first hit the broadcast
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Every term that enters China&apos;s official vocabulary has an exact first night on Xinwen
        Lianbo — and the corpus records it. Some debuts are the coining event itself: 新质生产力
        first aired on 2023-09-08, in coverage of an inspection trip to Heilongjiang. Some arrive
        from abroad before becoming domestic policy: 碳中和 (carbon neutrality) entered the
        broadcast in January 2019 — in a story about five Nordic countries — a year and a half
        before China&apos;s own pledge. Each row links the original first broadcast.
      </p>

      <div className="mt-10 overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-soft text-left">
              <th className="px-3 py-2 font-semibold">First aired</th>
              <th className="px-3 py-2 font-semibold">Term</th>
              <th className="px-3 py-2 font-semibold">Items since</th>
            </tr>
          </thead>
          <tbody>
            {data.terms.map((t) => (
              <tr key={t.zh} className="border-t border-line">
                <td className="px-3 py-2 font-mono whitespace-nowrap">{t.first!.date}</td>
                <td className="px-3 py-2">
                  <span className="font-semibold">{t.zh}</span>
                  <span className="ml-1.5 text-muted">{t.en}</span>
                </td>
                <td className="px-3 py-2 font-mono text-muted">{t.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-bold">The first broadcasts</h2>
      <div className="mt-4 space-y-4">
        {data.terms.map((t) => (
          <div key={t.zh} className="rounded-lg border border-line px-5 py-4">
            <p className="text-sm font-semibold">{t.zh} <span className="font-normal text-muted">· first aired {t.first!.date}</span></p>
            <p className="mt-1.5 text-sm text-muted">
              <a href={t.first!.url} target="_blank" rel="noopener" className="text-accent hover:underline">{t.first!.title}</a>
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold">Methodology &amp; caveats</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        <li>· First appearance: <code className="font-mono text-fg">GET /v1/news?q=&lt;term&gt;&amp;order_dir=asc&amp;limit=1</code> — the earliest broadcast item containing the exact phrase.</li>
        <li>· The corpus starts 2016-02; terms established before then would show a false &ldquo;birth&rdquo; — one candidate (专精特新, coined 2011) was excluded for exactly this reason. All listed terms first aired 2017 or later.</li>
        <li>· Exact-phrase matching: earlier paraphrases or variant forms are not counted.</li>
        <li>· Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Date-stamp any term&apos;s debut via the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo full-text API</Link>.
        Related: <Link href="/insights/new-quality-productive-forces" className="text-accent hover:underline">the cold start of 新质生产力</Link>
        {" · "}<Link href="/insights" className="text-accent hover:underline">all insights</Link>.
      </p>
    </main>
  );
}
