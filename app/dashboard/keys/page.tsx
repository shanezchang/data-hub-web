"use client";
import { useState } from "react";
import { useKeys, type ApiKeyRow } from "@/lib/hooks";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
        <Button onClick={() => setCreating(true)}>＋ 生成新 Key</Button>
      </div>

      {newKey && (
        <div className="mt-5 rounded-lg border border-brand/40 bg-muted p-4">
          <p className="text-sm font-semibold">新 key 已生成 —— 只显示这一次，请立即复制保存：</p>
          <div className="mt-2 flex items-center gap-3">
            <code className="overflow-x-auto rounded border border-border bg-background px-3 py-1.5 font-mono text-xs">{newKey}</code>
            <Button
              variant="outline"
              className="shrink-0 px-3 py-1.5 text-xs"
              onClick={() => navigator.clipboard.writeText(newKey).then(() => toast("已复制", "ok"))}
            >
              复制
            </Button>
          </div>
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border border-border">
        {!keys ? (
          <div className="space-y-2 p-5"><Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" /></div>
        ) : keys.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">还没有 key，点右上角「生成新 Key」。</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {["名称", "前缀", "权限", "限流", "状态", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.key_prefix}…</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.scopes.join(", ")}</td>
                  <td className="px-4 py-3 font-mono text-xs">{k.rate_limit_per_min}/min</td>
                  <td className="px-4 py-3">
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${k.revoked ? "border-border text-muted-foreground" : "border-brand/40 text-brand"}`}>
                      {k.revoked ? "已吊销" : "有效"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!k.revoked && (
                      <button onClick={() => setRevoking(k)} className="text-xs text-[var(--destructive)] hover:underline">吊销</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
