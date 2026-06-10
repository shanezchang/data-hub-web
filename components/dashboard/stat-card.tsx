import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div className="rounded-lg border border-line p-5">
      {value === undefined ? <Skeleton className="h-8 w-20" /> : <p className="font-mono text-2xl font-semibold">{value}</p>}
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
