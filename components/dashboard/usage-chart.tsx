import type { Usage } from "@/lib/hooks";

export function UsageChart({ daily }: { daily: Usage["daily"] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div data-chart className="flex h-28 items-end gap-[3px]">
      {daily.map((d) => {
        const h = d.count > 0 ? Math.max(6, Math.round((d.count / max) * 100)) : 2;
        return (
          <span
            key={d.date}
            title={`${d.date} · ${d.count} 次`}
            className={`flex-1 rounded-t-sm ${d.count ? "bg-primary/70" : "bg-border"}`}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}
