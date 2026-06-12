"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DatabaseIcon, MenuIcon, XIcon } from "lucide-react";
import { token } from "@/lib/auth";
import { API_DOCS } from "@/lib/site";
import { NavLink } from "@/components/ui/nav-link";
import { ThemeToggle } from "./theme-toggle";

export function BrandMark({ className = "size-5" }: { className?: string }) {
  return <DatabaseIcon className={className} aria-hidden="true" />;
}

const NAV = [
  { href: "/#datasets", label: "数据集" },
  { href: "/insights", label: "Insights" },
  { href: "/regions", label: "Regions" },
  { href: "/changelog", label: "更新日志" },
];

export function SiteHeader() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setAuthed(Boolean(token.get()));
  }, []);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = (onNavigate?: () => void) => (
    <>
      {NAV.map((n) => (
        <NavLink key={n.href} href={n.href} onClick={onNavigate} className="px-2 py-1 text-muted-foreground hover:text-foreground">
          {n.label}
        </NavLink>
      ))}
      <a href={API_DOCS} target="_blank" rel="noopener" className="px-2 py-1 text-muted-foreground hover:text-foreground">
        文档
      </a>
    </>
  );

  const authActions =
    authed === null ? (
      <span className="w-28" aria-hidden="true" />
    ) : authed ? (
      <NavLink href="/dashboard" className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-85">进入控制台</NavLink>
    ) : (
      <>
        <NavLink href="/login" className="rounded-md border border-border px-3 py-1.5 hover:bg-muted">登录</NavLink>
        <NavLink href="/register" className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-85">注册</NavLink>
      </>
    );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <BrandMark /> data·hub
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navLinks()}
          <span className="mx-2 h-4 w-px bg-border" aria-hidden="true" />
          <span className="flex items-center gap-2">{authActions}</span>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="打开菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md border border-border p-2 hover:bg-muted"
          >
            {menuOpen ? <XIcon className="size-4" aria-hidden="true" /> : <MenuIcon className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div data-testid="mobile-menu" className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-3 text-sm">
            {navLinks(() => setMenuOpen(false))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">{authActions}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
