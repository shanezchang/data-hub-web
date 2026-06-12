import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-xs">
      {value === undefined ? <Skeleton className="h-8 w-20" /> : <p className="font-mono text-2xl font-semibold tracking-tight">{value}</p>}
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
