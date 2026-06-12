// Insight:新闻联播的年度节律——八个词各自属于哪个月。
// 数据快照 lib/insights-data/xinwen-lianbo-calendar.json(主编直查生成,2026-06-11)。

import type { Metadata } from "next";
import Link from "next/link";
import { MonthBars } from "@/components/trends/charts";
import data from "@/lib/insights-data/xinwen-lianbo-calendar.json";

export const metadata: Metadata = {
  title: "The Xinwen Lianbo calendar: China's official year, month by month",
  description:
    "Two Sessions coverage peaks in March (64% of all mentions), flood control owns July, harvest owns September. Eight recurring topics and their monthly rhythm across a decade of CCTV's flagship newscast.",
  alternates: { canonical: "/insights/xinwen-lianbo-calendar" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Xinwen Lianbo calendar: China's official year, month by month",
  description:
    "Monthly distribution of eight recurring topics across a decade of CCTV Xinwen Lianbo broadcasts.",
  dateModified: data.as_of,
  author: { "@type": "Organization", name: "data-hub" },
  isBasedOn: "https://console.lumina-core.cn/datasets/news",
};

const MONTH_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CalendarPage() {
  const terms = [...data.terms].sort((a, b) => a.peak_month - b.peak_month);
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Insight · Seasonality</p>
      <h1 className="text-3xl font-bold leading-tight">
        The Xinwen Lianbo calendar: China&apos;s official year, month by month
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        A decade of nightly broadcasts has a heartbeat. Aggregate every mention of a recurring
        topic by calendar month and the official year emerges: the Spring Festival travel rush
        owns January–February, the Two Sessions own March (64% of all mentions land there),
        Gaokao owns June, flood control owns July, harvest owns September, and cold waves close
        out the year. Each chart below folds ten years of broadcasts into twelve months.
      </p>

      <div className="mt-12 space-y-10">
        {terms.map((t) => (
          <section key={t.zh}>
            <h2 className="text-xl font-bold">
              {t.en} <span className="ml-1 font-normal text-muted-foreground">{t.zh}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.total} items · peaks in {MONTH_EN[t.peak_month]}
            </p>
            <div className="mt-3 rounded-lg border border-border bg-muted p-4">
              <MonthBars byMonth={t.by_month as Record<string, number>} />
            </div>
          </section>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold">Methodology</h2>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <li>· Counts: <code className="font-mono text-foreground">GET /v1/news?q=&lt;term&gt;&amp;group_by=month</code>, then folded by calendar month across all years (2016–present).</li>
        <li>· Exact-phrase matching; counts are items, not phrase frequency.</li>
        <li>· The current year is partial, which slightly under-weights months still ahead. Data as of {data.as_of}.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-border bg-muted px-5 py-4 text-sm text-muted-foreground">
        Fold any topic into the calendar via the{" "}
        <Link href="/datasets/news" className="text-brand hover:underline">Xinwen Lianbo full-text API</Link>.
        More findings: <Link href="/insights" className="text-brand hover:underline">Data Insights</Link>.
      </p>
    </main>
  );
}
