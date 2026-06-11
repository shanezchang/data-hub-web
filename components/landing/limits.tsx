import Link from "next/link";
import { ReactNode } from "react";

const ROWS: [string, ReactNode][] = [
  ["请求限流", "60 次 / 分钟（按 key）"],
  ["数据范围", "完整字段返回，无降级"],
  ["费用", "公测期免费"],
  [
    "更高额度",
    <>
      公测期按统一额度提供，更高额度后续开放申请
    </>,
  ],
];

export function Limits() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-2xl font-bold">限流与额度</h2>
      <div className="mt-6 max-w-2xl overflow-hidden rounded-lg border border-line">
        {ROWS.map(([k, v], i) => (
          <div key={k} className={`flex justify-between gap-6 px-5 py-3 text-sm ${i ? "border-t border-line" : ""}`}>
            <span className="text-muted">{k}</span>
            <span className="text-right">{v}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
