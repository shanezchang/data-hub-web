// Insights 索引页:全部数据发现的入口(注册表驱动,sitemap 同源)。

import type { Metadata } from "next";
import Link from "next/link";
import { INSIGHTS } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Data Insights · Findings from Chinese public data",
  description:
    "Data-driven findings from CCTV Xinwen Lianbo transcripts, China State Council policy documents, and the Y Combinator directory. Every number reproducible via the data-hub API.",
  alternates: { canonical: "/insights" },
};

export default function InsightsIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Insights</p>
      <h1 className="text-3xl font-bold leading-tight">Data Insights</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Findings mined from the datasets behind data-hub — official Chinese news, central policy
        documents, and startup records. Every chart and every number on these pages can be
        reproduced with a single API query, documented in each page&apos;s methodology section.
      </p>

      <div className="mt-10 space-y-6">
        {INSIGHTS.map((i) => (
          <article key={i.slug} className="rounded-lg border border-border px-6 py-5">
            <h2 className="text-lg font-bold">
              <Link href={`/insights/${i.slug}`} className="hover:text-brand">{i.title}</Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.description}</p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {i.publishedAt} · data as of {i.dataAsOf}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Related: <Link href="/trends/xinwen-lianbo-keywords" className="text-brand hover:underline">Xinwen Lianbo keyword trends</Link>
        {" · "}
        <Link href="/trends/yc-batch-survival" className="text-brand hover:underline">YC batch survival rates</Link>
      </p>
    </main>
  );
}
