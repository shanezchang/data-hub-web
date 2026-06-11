// Regions 省页(动态路由,注册表+数据快照驱动)。
// 数据 lib/regions-data/<slug>.json;查询形态纪律见 Methodology 与 lib/regions.ts 注释。

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LineChart } from "@/components/trends/charts";
import { PUBLISHED_REGIONS } from "@/lib/regions-published";

type CityData = {
  zh: string; pinyin: string; query: string; total: number;
  by_year: Record<string, number>;
  recent: { date: string; title: string; url: string }[];
};
type ProvinceData = {
  as_of: string;
  province: { zh: string; en: string; slug: string };
  cities: CityData[];
};

export function generateStaticParams() {
  return PUBLISHED_REGIONS.map((r) => ({ slug: r.slug }));
}

async function loadData(slug: string): Promise<ProvinceData | null> {
  if (!PUBLISHED_REGIONS.some((r) => r.slug === slug)) return null;
  return (await import(`@/lib/regions-data/${slug}.json`)).default as ProvinceData;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await loadData((await params).slug);
  if (!data) return {};
  const { en, zh, slug } = data.province;
  const n = data.cities.length;
  const top = [...data.cities].sort((a, b) => b.total - a.total)[0];
  return {
    title: `${en} on Xinwen Lianbo: ${n} cities, ten years of flagship-news coverage`,
    description: `How often does each of ${en} (${zh})'s ${n} prefecture-level cities appear on CCTV Xinwen Lianbo? Year-by-year mention counts since 2016, led by ${top.pinyin} (${top.total} items), with original broadcast links for every city.`,
    alternates: { canonical: `/regions/${slug}` },
  };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await loadData((await params).slug);
  if (!data) notFound();

  const { en, zh } = data.province;
  const cities = [...data.cities].sort((a, b) => b.total - a.total);
  const top = cities[0];
  const suffixed = cities.filter((c) => c.query !== c.zh);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${en} on Xinwen Lianbo: ${cities.length} cities, ten years of coverage`,
    description: `Year-by-year CCTV Xinwen Lianbo mention counts for all ${cities.length} prefecture-level cities of ${en} province, with original broadcast links.`,
    dateModified: data.as_of,
    author: { "@type": "Organization", name: "data-hub" },
    isBasedOn: "https://console.lumina-core.cn/datasets/news",
  };

  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Regions · {en} {zh}</p>
      <h1 className="text-3xl font-bold leading-tight">
        {en} on Xinwen Lianbo: {cities.length} cities, ten years of coverage
      </h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted">
        Appearing on Xinwen Lianbo — China&apos;s most-watched, most tightly scripted news
        broadcast — is a signal of what the center wants the country to see. This page indexes how
        often each of {en}&apos;s {cities.length} prefecture-level cities has appeared since 2016,
        with original CCTV broadcast links for every city. Coverage is steeply concentrated:{" "}
        {top.pinyin} leads with {top.total} items, while the quietest cities surface only a handful
        of times in a decade.
      </p>

      <h2 className="mt-12 text-xl font-bold">All {cities.length} cities, ranked</h2>
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
                <LineChart byYear={c.by_year} />
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
        <li>· Query forms: nationally unique city names are queried bare (higher recall); ambiguous names use a suffixed form{suffixed.length > 0 ? ` — here: ${suffixed.map((c) => c.query).join(", ")}` : ""} — trading recall for precision. Suffixed counts are lower bounds.</li>
        <li>· Mentions include any context (economy, weather, disasters, sports). Counts are items, not phrase frequency. The latest year is partial. Data as of {data.as_of}.</li>
        <li>· Listed broadcasts link to the original CCTV pages for independent verification.</li>
      </ul>

      <p className="mt-10 rounded-lg border border-line bg-bg-soft px-5 py-4 text-sm text-muted">
        Run the same index for any region via the{" "}
        <Link href="/datasets/news" className="text-accent hover:underline">Xinwen Lianbo full-text API</Link>.
        All provinces: <Link href="/regions" className="text-accent hover:underline">Regions</Link>
        {" · "}more findings: <Link href="/insights" className="text-accent hover:underline">Data Insights</Link>.
      </p>
    </main>
  );
}
