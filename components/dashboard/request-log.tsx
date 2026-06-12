"use client";
import { RequestRow, useRequests } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";

function statusClass(status: number): string {
  if (status < 300) return "text-brand border-brand/40";
  if (status === 429) return "text-[var(--warn,#b45309)] border-border";
  return "text-[var(--destructive)] border-[var(--destructive)]/40";
}

function Row({ r }: { r: RequestRow }) {
  const time = new Date(r.ts).toLocaleString("zh-CN", { hour12: false });
  return (
    <div className="grid grid-cols-[150px_1fr_auto_auto] items-baseline gap-3 border-t border-border px-5 py-2.5 text-sm first:border-t-0 max-sm:grid-cols-[1fr_auto]">
      <span className="font-mono text-xs text-muted-foreground">{time}</span>
      <span className="min-w-0">
        <span className="font-mono text-xs">
          <span className="text-muted-foreground">{r.method}</span> {r.path}
        </span>
        {(r.query || r.body) && (
          <span className="mt-0.5 block truncate font-mono text-[11px] text-muted-foreground">{r.query || r.body}</span>
        )}
      </span>
      <span className={`rounded border px-1.5 font-mono text-[11px] ${statusClass(r.status)}`}>{r.status}</span>
      <span className="font-mono text-xs text-muted-foreground">{r.duration_ms}ms</span>
    </div>
  );
}

export function RequestLogTable() {
  const { data } = useRequests();
  return (
    <div data-testid="request-log" className="mt-5 rounded-lg border bg-card shadow-xs">
      <p className="border-b border-border px-5 py-3 text-sm font-semibold">
        最近调用
        {data && <span className="ml-2 font-normal text-muted-foreground">共 {data.total.toLocaleString()} 条记录</span>}
      </p>
      {!data ? (
        <div className="space-y-2 p-5"><Skeleton className="h-5" /><Skeleton className="h-5" /><Skeleton className="h-5" /></div>
      ) : data.items.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">还没有调用记录。</p>
      ) : (
        data.items.map((r) => <Row key={`${r.ts}-${r.path}-${r.duration_ms}`} r={r} />)
      )}
    </div>
  );
}
