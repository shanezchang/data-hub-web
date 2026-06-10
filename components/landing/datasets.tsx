import { API_DOCS } from "@/lib/site";

const DATASETS = [
  {
    name: "CCTV《新闻联播》",
    tag: "news",
    desc: "2016 年至今每日文字稿，SQLite FTS5 全文检索，支持聚合趋势、高亮片段、结构化查询。",
    facts: ["56,350 条 · 日覆盖 99.9%", "跨度 2016-02 → 至今", "每日 21:00 后自动入库"],
    example: "GET /v1/news?q=新能源&start_date=2026-05-01",
  },
  {
    name: "Y Combinator 公司目录",
    tag: "yc",
    desc: "全量 YC 公司与创始人档案，支持按批次 / 行业 / 状态筛选、创始人全文检索、二维交叉聚合。",
    facts: ["5,956 家公司 · 11,258 位创始人", "覆盖 2005 → 最新批次", "目录定期重抓保持时效"],
    example: "POST /v1/yc/companies/search {group_by: [batch_year, status]}",
  },
];

export function Datasets() {
  return (
    <section className="border-t border-line bg-bg-soft/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">数据集</h2>
        <p className="mt-2 text-sm text-muted">每个数据集一套独立端点，统一用 X-API-Key 认证。持续接入中。</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {DATASETS.map((d) => (
            <article key={d.tag} className="rounded-lg border border-line bg-bg p-6">
              <h3 className="font-semibold">{d.name}</h3>
              <p className="mt-2 text-sm text-muted">{d.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {d.facts.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 overflow-x-auto rounded border border-line bg-bg-soft px-3 py-2 font-mono text-xs text-muted">{d.example}</p>
              <a href={API_DOCS} target="_blank" rel="noopener" className="mt-4 inline-block text-sm text-accent hover:underline">查看文档 →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
