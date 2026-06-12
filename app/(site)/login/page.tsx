"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { token } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { AuthCard, Field, Input } from "@/components/auth/auth-card";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await api<{ access_token: string }>("/portal/login", {
        method: "POST",
        body: { email: emailRef.current!.value.trim(), password: pwdRef.current!.value },
      });
      token.set(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      toast((err as Error).message, "err");
      setPending(false);
    }
  }

  return (
    <AuthCard title="登录">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="邮箱" htmlFor="login-email">
          <Input id="login-email" ref={emailRef} type="email" required placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="密码" htmlFor="login-password">
          <Input id="login-password" ref={pwdRef} type="password" required placeholder="密码" autoComplete="current-password" />
        </Field>
        <Button type="submit" pending={pending} pendingText="登录中…" className="w-full">登录</Button>
      </form>
      <p className="mt-5 text-sm text-muted-foreground">
        还没有账号？<Link href="/register" className="text-brand hover:underline">去注册</Link>
        <span className="mx-2">·</span>
        <Link href="/reset" className="text-brand hover:underline">忘记密码？</Link>
      </p>
    </AuthCard>
  );
}
