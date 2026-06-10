const QA = [
  ["数据从哪里来？", "全部来自公开来源：CCTV 官网《新闻联播》文字稿、Y Combinator 官方公司目录。我们只做结构化整理与检索，不索引任何非公开信息。"],
  ["数据多久更新？", "新闻联播每日 21:00 后自动采集入库；YC 目录定期全量重抓。每个数据集的更新节奏都写在数据集卡片里。"],
  ["可以商用吗？", "API 服务可用于产品集成。数据内容的版权归原始来源所有，使用时请遵守来源条款并建议注明出处。"],
  ["有免费额度吗？", "公测期全部免费，默认每个 key 60 次/分钟。需要更高额度发邮件说明用途即可。"],
  ["想要的数据这里没有？", "欢迎提需求。平台架构是可扩展的，新数据集的接入成本很低，合理的需求会优先排期。"],
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
