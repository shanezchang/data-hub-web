"use client";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/hooks";
import { clearSession, token } from "@/lib/auth";
import { isAuthError } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/site-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const { data: me, error, isLoading, mutate } = useMe();

  useEffect(() => {
    const t = Boolean(token.get());
    setHasToken(t);
    if (!t) router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (error && isAuthError(error)) {
      clearSession();
      toast("登录已失效，请重新登录", "err");
      router.replace("/login");
    }
  }, [error, router, toast]);

  if (hasToken === null || hasToken === false || (error && isAuthError(error))) return <DashSkeleton />;

  function logout() {
    clearSession();
    toast("已退出");
    router.replace("/");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="菜单"
            onClick={() => setMenuOpen(true)}
            className="flex size-8 items-center justify-center rounded-md border border-border md:hidden"
          >
            <MenuIcon className="size-4" aria-hidden="true" />
          </button>
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
            <BrandMark /> data·hub
          </Link>
          <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">控制台</span>
        </div>
        <div className="flex items-center gap-3">
          {me ? <span className="hidden font-mono text-xs text-muted-foreground sm:block">{me.email}</span> : <Skeleton className="h-4 w-36" />}
          <ThemeToggle />
          <button onClick={logout} className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">退出</button>
        </div>
      </header>
      <div className="flex flex-1">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 p-5 md:p-8">
          {isLoading ? (
            <MainSkeleton />
          ) : error ? (
            <div className="mx-auto mt-20 max-w-sm text-center">
              <p className="text-sm text-muted-foreground">无法连接服务器，请稍后重试。你的登录状态已保留。</p>
              <Button variant="outline" className="mt-4" onClick={() => mutate()}>重试</Button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

function MainSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-7 w-40" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}

function DashSkeleton() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex h-14 items-center border-b border-border px-4"><Skeleton className="h-5 w-28" /></div>
      <div className="flex flex-1">
        <div className="hidden w-52 border-r border-border p-3 md:block">
          <div className="space-y-2">
            <Skeleton className="h-8" /><Skeleton className="h-8" /><Skeleton className="h-8" /><Skeleton className="h-8" />
          </div>
        </div>
        <div className="flex-1 p-8"><MainSkeleton /></div>
      </div>
    </div>
  );
}
