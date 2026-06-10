import { CONTACT } from "@/lib/site";

const ROWS = [
  ["请求限流", "60 次 / 分钟（按 key）"],
  ["数据范围", "全量数据，无字段阉割"],
  ["费用", "公测期免费"],
  ["更高额度", "邮件说明用途即可调整"],
];

export function Limits() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-2xl font-bold">限流与额度</h2>
      <p className="mt-2 text-sm text-muted">先说清楚你能拿到什么，注册后没有落差。</p>
      <div className="mt-6 max-w-2xl overflow-hidden rounded-lg border border-line">
        {ROWS.map(([k, v], i) => (
          <div key={k} className={`flex justify-between gap-6 px-5 py-3 text-sm ${i ? "border-t border-line" : ""}`}>
            <span className="text-muted">{k}</span>
            <span className="text-right">{v}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">联系：<a href={`mailto:${CONTACT}`} className="text-accent hover:underline">{CONTACT}</a></p>
    </section>
  );
}
