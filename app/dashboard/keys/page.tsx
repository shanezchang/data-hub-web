"use client";
import { useState } from "react";
import { useKeys, type ApiKeyRow } from "@/lib/hooks";
import { api } from "@/lib/api";
import { CheckIcon, CopyIcon, KeyRoundIcon, PlusIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { NewKeyModal } from "@/components/dashboard/new-key-modal";
import { ConfirmModal } from "@/components/dashboard/confirm-modal";

export default function KeysPage() {
  const toast = useToast();
  const { data: keys, mutate } = useKeys();
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<ApiKeyRow | null>(null);
  const [revokePending, setRevokePending] = useState(false);

  async function revoke() {
    if (!revoking) return;
    setRevokePending(true);
    try {
      await api(`/portal/keys/${revoking.id}`, { method: "DELETE", auth: true });
      toast("已吊销", "ok");
      setRevoking(null);
      mutate();
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setRevokePending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">API Keys</h1>
        <Button onClick={() => setCreating(true)}><PlusIcon aria-hidden="true" /> 生成新 Key</Button>
      </div>

      {newKey && (
        <div className="mt-5 rounded-lg border border-brand/40 bg-card p-4 shadow-xs">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <KeyRoundIcon className="size-4 text-brand" aria-hidden="true" />
            新 key 已生成 —— 只显示这一次，请立即复制保存：
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <code className="overflow-x-auto rounded border bg-muted px-3 py-1.5 font-mono text-xs">{newKey}</code>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => navigator.clipboard.writeText(newKey).then(() => toast("已复制", "ok"))}
            >
              <CopyIcon aria-hidden="true" /> 复制
            </Button>
          </div>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border bg-card shadow-xs">
        {!keys ? (
          <div className="space-y-2 p-5"><Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" /></div>
        ) : keys.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">还没有 key，点右上角「生成新 Key」。</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["名称", "前缀", "权限", "限流", "日配额", "状态", ""].map((h, i) => (
                  <TableHead key={i}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell>{k.name}</TableCell>
                  <TableCell className="font-mono text-xs">{k.key_prefix}…</TableCell>
                  <TableCell className="font-mono text-xs">{k.scopes.join(", ")}</TableCell>
                  <TableCell className="font-mono text-xs">{k.rate_limit_per_min}/min</TableCell>
                  <TableCell className="font-mono text-xs">{k.daily_quota ? `${k.daily_quota}/天` : "不限"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-mono text-[11px] ${k.revoked ? "text-muted-foreground" : "border-brand/40 text-brand"}`}>
                      {k.revoked ? "已吊销" : "有效"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {!k.revoked && (
                      <button onClick={() => setRevoking(k)} className="text-xs text-[var(--destructive)] hover:underline">吊销</button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <NewKeyModal open={creating} onClose={() => setCreating(false)} onCreated={(k) => { setNewKey(k); mutate(); }} />
      <ConfirmModal
        open={Boolean(revoking)}
        onClose={() => setRevoking(null)}
        onConfirm={revoke}
        title={`吊销「${revoking?.name ?? ""}」`}
        body="吊销后该 key 立即失效，使用它的应用会立刻收到 401。此操作不可撤销。"
        confirmText="确认吊销"
        pending={revokePending}
      />
    </div>
  );
}
