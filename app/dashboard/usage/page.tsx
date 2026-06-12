"use client";
import { useUsage } from "@/lib/hooks";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { RequestLogTable } from "@/components/dashboard/request-log";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsagePage() {
  const { data: usage } = useUsage();
  const byKey = usage?.by_key.filter((k) => k.count > 0).sort((a, b) => b.count - a.count) ?? [];
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold">用量</h1>
      <div className="mt-5 rounded-lg border bg-card p-5 shadow-xs">
        <p className="mb-4 text-sm text-muted-foreground">近 30 天调用趋势</p>
        {usage ? <UsageChart daily={usage.daily} /> : <Skeleton className="h-28" />}
      </div>
      <div className="mt-5 rounded-lg border bg-card shadow-xs">
        <p className="border-b border-border px-5 py-3 text-sm font-semibold">按 key 明细</p>
        {!usage ? (
          <div className="space-y-2 p-5"><Skeleton className="h-5" /><Skeleton className="h-5" /></div>
        ) : byKey.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">还没有调用记录。</p>
        ) : (
          byKey.map((k) => (
            <div key={k.name} className="flex justify-between border-t border-border px-5 py-3 text-sm first:border-t-0">
              <span>{k.name}</span>
              <span className="font-mono">{k.count.toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
      <RequestLogTable />
    </div>
  );
}
