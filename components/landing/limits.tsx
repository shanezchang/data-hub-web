import { ReactNode } from "react";
import { SectionHeader } from "./section-header";

const ROWS: [string, ReactNode][] = [
  ["请求限流", "60 次 / 分钟（按 key）"],
  ["免费额度", "1000 次 / 天（按 key，北京时间次日 0 点重置）"],
  ["数据范围", "完整字段返回，无降级"],
  ["费用", "公测期免费"],
  ["更高额度", "公测期按统一额度提供，更高额度后续开放申请"],
];

export function Limits() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <SectionHeader kicker="Limits" title="限流与额度" />
      <div className="mt-6 max-w-2xl overflow-hidden rounded-lg border bg-card shadow-xs">
        {ROWS.map(([k, v], i) => (
          <div key={k} className={`flex justify-between gap-6 px-5 py-3.5 text-sm ${i ? "border-t" : ""}`}>
            <span className="shrink-0 text-muted-foreground">{k}</span>
            <span className="text-right">{v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
