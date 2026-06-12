"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { token } from "@/lib/auth";
import { BrandMark } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthCard({ title, sub, children, redirectIfAuthed = true }: {
  title: string; sub?: string; children: React.ReactNode; redirectIfAuthed?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (redirectIfAuthed && token.get()) router.replace("/dashboard");
  }, [redirectIfAuthed, router]);
  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-5 py-14 sm:py-16">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 self-center font-mono text-sm font-semibold">
        <BrandMark className="size-5 text-brand" /> data·hub
      </Link>
      <div className="rounded-xl border bg-card p-6 shadow-xs sm:p-8">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {sub ? <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{sub}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

/** 表单字段:Label + 任意控件,统一间距。 */
export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export { Input };
