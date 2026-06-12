"use client";
import { useEffect, useRef, useState } from "react";
import { useMe } from "@/lib/hooks";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { inputCls, labelCls } from "@/components/auth/auth-card";

export default function SettingsPage() {
  const toast = useToast();
  const { data: me, mutate } = useMe();
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const cur = useRef<HTMLInputElement>(null);
  const next = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (me) setName(me.name ?? "");
  }, [me]);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    try {
      await api("/portal/me", { method: "PATCH", auth: true, body: { name: name.trim() || null } });
      mutate();
      toast("昵称已保存", "ok");
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setSavingName(false);
    }
  }

  async function savePwd(e: React.FormEvent) {
    e.preventDefault();
    setSavingPwd(true);
    try {
      await api("/portal/change-password", {
        method: "POST",
        auth: true,
        body: { current_password: cur.current!.value, new_password: next.current!.value },
      });
      cur.current!.value = "";
      next.current!.value = "";
      toast("密码已修改", "ok");
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold">设置</h1>
      {me ? <p className="mt-1 font-mono text-sm text-muted-foreground">{me.email}</p> : <Skeleton className="mt-2 h-4 w-44" />}

      <form onSubmit={saveName} className="mt-7 rounded-lg border border-border p-5">
        <h2 className="mb-4 font-semibold">资料</h2>
        <label className={labelCls}>昵称
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="怎么称呼你" className={inputCls} />
        </label>
        <Button type="submit" pending={savingName} pendingText="保存中…" className="mt-4">保存昵称</Button>
      </form>

      <form onSubmit={savePwd} className="mt-5 rounded-lg border border-border p-5">
        <h2 className="mb-4 font-semibold">修改密码</h2>
        <div className="space-y-4">
          <label className={labelCls}>当前密码
            <input ref={cur} type="password" required autoComplete="current-password" className={inputCls} />
          </label>
          <label className={labelCls}>新密码
            <input ref={next} type="password" required minLength={8} placeholder="至少 8 位" autoComplete="new-password" className={inputCls} />
          </label>
        </div>
        <Button type="submit" pending={savingPwd} pendingText="修改中…" className="mt-4">修改密码</Button>
      </form>
    </div>
  );
}
