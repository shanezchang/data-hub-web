"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { token } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AuthCard, inputCls, labelCls } from "@/components/auth/auth-card";
import { SendCodeButton } from "@/components/auth/send-code-button";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await api<{ access_token: string }>("/portal/register", {
        method: "POST",
        body: {
          email: emailRef.current!.value.trim(),
          code: codeRef.current!.value.trim(),
          password: pwdRef.current!.value,
          name: nameRef.current!.value.trim() || null,
        },
      });
      token.set(res.access_token);
      toast("注册成功 🎉", "ok");
      router.push("/dashboard");
    } catch (err) {
      toast((err as Error).message, "err");
      setPending(false);
    }
  }

  return (
    <AuthCard title="注册" sub="用邮箱注册，我们会发一个 6 位验证码。">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className={labelCls}>邮箱
          <div className="flex gap-2">
            <input ref={emailRef} type="email" required placeholder="you@example.com" autoComplete="email" className={inputCls} />
            <SendCodeButton getEmail={() => emailRef.current?.value ?? ""} endpoint="/portal/send-code" />
          </div>
        </label>
        <label className={labelCls}>验证码
          <input ref={codeRef} required maxLength={6} inputMode="numeric" placeholder="6 位数字" className={inputCls} />
        </label>
        <label className={labelCls}>密码
          <input ref={pwdRef} type="password" required minLength={8} placeholder="至少 8 位" autoComplete="new-password" className={inputCls} />
        </label>
        <label className={labelCls}>昵称（可选）
          <input ref={nameRef} placeholder="怎么称呼你" className={inputCls} />
        </label>
        <Button type="submit" pending={pending} pendingText="注册中…" className="w-full">注册并登录</Button>
      </form>
      <p className="mt-5 text-sm text-muted-foreground">已有账号？<Link href="/login" className="text-brand hover:underline">去登录</Link></p>
    </AuthCard>
  );
}
