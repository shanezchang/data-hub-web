const QA = [
  ["数据从哪里来？", "全部来自公开来源，只做结构化整理与检索，不索引非公开信息。各数据集的来源标注在其详情页。"],
  ["数据多久更新？", "新闻联播每日自动采集，YC 目录定期全量更新。更新节奏见各数据集详情页。"],
  ["可以商用吗？", "API 服务可用于产品集成。数据内容的版权归原始来源所有，使用时请遵守来源条款并注明出处。"],
  ["怎么给 AI Agent 用？", "把 api.lumina-core.cn/llms.txt 交给你的 Agent，端点与参数都在其中；需要精确契约时使用 openapi.json。"],
  ["想要的数据这里没有？", "平台为持续接入新数据集而设计。欢迎提需求，合理的需求会优先排期。"],
];

export function Faq() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">常见问题</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {QA.map(([q, a]) => (
            <div key={q}>
              <dt className="font-semibold">{q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
