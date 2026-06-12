"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AuthCard, inputCls, labelCls } from "@/components/auth/auth-card";
import { SendCodeButton } from "@/components/auth/send-code-button";

export default function ResetPage() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await api("/portal/reset-password", {
        method: "POST",
        body: {
          email: emailRef.current!.value.trim(),
          code: codeRef.current!.value.trim(),
          new_password: pwdRef.current!.value,
        },
      });
      toast("密码已重置，请用新密码登录", "ok");
      router.push("/login");
    } catch (err) {
      toast((err as Error).message, "err");
      setPending(false);
    }
  }

  return (
    <AuthCard title="重置密码" sub="填注册邮箱，我们发一个 6 位验证码，验证后即可设置新密码。" redirectIfAuthed={false}>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className={labelCls}>邮箱
          <div className="flex gap-2">
            <input ref={emailRef} type="email" required placeholder="you@example.com" autoComplete="email" className={inputCls} />
            <SendCodeButton getEmail={() => emailRef.current?.value ?? ""} endpoint="/portal/forgot-password" />
          </div>
        </label>
        <label className={labelCls}>验证码
          <input ref={codeRef} required maxLength={6} inputMode="numeric" placeholder="6 位数字" className={inputCls} />
        </label>
        <label className={labelCls}>新密码
          <input ref={pwdRef} type="password" required minLength={8} placeholder="至少 8 位" autoComplete="new-password" className={inputCls} />
        </label>
        <Button type="submit" pending={pending} pendingText="提交中…" className="w-full">重置密码</Button>
      </form>
      <p className="mt-5 text-sm text-muted-foreground">想起来了？<Link href="/login" className="text-brand hover:underline">去登录</Link></p>
    </AuthCard>
  );
}
