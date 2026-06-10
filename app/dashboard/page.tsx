"use client";
import { useKeys, useUsage } from "@/lib/hooks";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewPage() {
  const { data: usage } = useUsage();
  const { data: keys } = useKeys();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold">概览</h1>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="总调用" value={usage?.total.toLocaleString()} />
        <StatCard label="今日" value={usage?.today.toLocaleString()} />
        <StatCard label="有效 key" value={keys?.filter((k) => !k.revoked).length} />
      </div>
      <div className="mt-5 rounded-lg border border-line p-5">
        <p className="mb-4 text-sm text-muted">近 30 天调用</p>
        {usage ? <UsageChart daily={usage.daily} /> : <Skeleton className="h-28" />}
      </div>
    </div>
  );
}
