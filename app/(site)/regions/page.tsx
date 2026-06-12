// Regions 索引页:已发布省份清单(lib/regions-published.ts 驱动)。

import type { Metadata } from "next";
import Link from "next/link";
import { PUBLISHED_REGIONS } from "@/lib/regions-published";

export const metadata: Metadata = {
  title: "Regions · Chinese provinces on Xinwen Lianbo",
  description:
    "Province-by-province indexes of how Chinese cities appear on CCTV Xinwen Lianbo — mention counts, yearly curves, and original broadcast links for every prefecture-level city.",
  alternates: { canonical: "/regions" },
};

export default async function RegionsIndexPage() {
  const entries = await Promise.all(
    PUBLISHED_REGIONS.map(async (r) => {
      const data = (await import(`@/lib/regions-data/${r.slug}.json`)).default;
      const cities = data.cities as { total: number; pinyin: string }[];
      const top = [...cities].sort((a, b) => b.total - a.total)[0];
      return { ...r, cityCount: cities.length, top };
    })
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Regions</p>
      <h1 className="text-3xl font-bold leading-tight">Chinese provinces on Xinwen Lianbo</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        How often does each Chinese city appear on the country&apos;s flagship newscast? One page
        per province: every prefecture-level city&apos;s mention count since 2016, yearly curves,
        and original CCTV broadcast links. More provinces are added regularly.
      </p>

      <div className="mt-10 space-y-4">
        {entries.map((r) => (
          <article key={r.slug} className="rounded-lg border border-border px-6 py-5">
            <h2 className="text-lg font-bold">
              <Link href={`/regions/${r.slug}`} className="hover:text-brand">{r.en} {r.zh}</Link>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {r.cityCount} cities · led by {r.top.pinyin} ({r.top.total} items)
            </p>
          </article>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Related: <Link href="/insights" className="text-brand hover:underline">Data Insights</Link>
        {" · "}
        <Link href="/datasets/news" className="text-brand hover:underline">Xinwen Lianbo API</Link>
      </p>
    </main>
  );
}
