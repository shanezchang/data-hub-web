"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { token } from "@/lib/auth";

export function AuthCard({ title, sub, children, redirectIfAuthed = true }: {
  title: string; sub?: string; children: React.ReactNode; redirectIfAuthed?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (redirectIfAuthed && token.get()) router.replace("/dashboard");
  }, [redirectIfAuthed, router]);
  return (
    <main className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="text-2xl font-bold">{title}</h1>
      {sub ? <p className="mt-2 text-sm text-muted-foreground">{sub}</p> : null}
      <div className="mt-7">{children}</div>
    </main>
  );
}

export const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground-foreground/60 focus:border-foreground";
export const labelCls = "block space-y-1.5 text-sm font-medium";
