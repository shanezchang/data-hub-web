"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { token } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";

export function BrandMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}

export function SiteHeader() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => {
    setAuthed(Boolean(token.get()));
  }, []);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <BrandMark /> data·hub
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/changelog" className="hidden px-2 text-muted hover:text-fg sm:block">更新日志</Link>
          <Link href="/about" className="hidden px-2 text-muted hover:text-fg sm:block">关于</Link>
          {authed === null ? (
            <span className="w-28" aria-hidden="true" />
          ) : authed ? (
            <Link href="/dashboard" className="rounded-md bg-fg px-3 py-1.5 text-sm font-medium text-bg hover:opacity-85">进入控制台</Link>
          ) : (
            <>
              <Link href="/login" className="rounded-md border border-line px-3 py-1.5 hover:bg-bg-soft">登录</Link>
              <Link href="/register" className="rounded-md bg-fg px-3 py-1.5 font-medium text-bg hover:opacity-85">注册</Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
