"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { token } from "@/lib/auth";
import { API_DOCS } from "@/lib/site";
import { NavLink } from "@/components/ui/nav-link";
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

const NAV = [
  { href: "/#datasets", label: "数据集" },
  { href: "/insights", label: "Insights" },
  { href: "/regions", label: "Regions" },
  { href: "/#agents", label: "Agent 接入" },
  { href: "/changelog", label: "更新日志" },
  { href: "/about", label: "关于" },
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
        <NavLink key={n.href} href={n.href} onClick={onNavigate} className="px-2 py-1 text-muted hover:text-fg">
          {n.label}
        </NavLink>
      ))}
      <a href={API_DOCS} target="_blank" rel="noopener" className="px-2 py-1 text-muted hover:text-fg">
        文档
      </a>
    </>
  );

  const authActions =
    authed === null ? (
      <span className="w-28" aria-hidden="true" />
    ) : authed ? (
      <NavLink href="/dashboard" className="rounded-md bg-fg px-3 py-1.5 text-sm font-medium text-bg hover:opacity-85">进入控制台</NavLink>
    ) : (
      <>
        <NavLink href="/login" className="rounded-md border border-line px-3 py-1.5 hover:bg-bg-soft">登录</NavLink>
        <NavLink href="/register" className="rounded-md bg-fg px-3 py-1.5 font-medium text-bg hover:opacity-85">注册</NavLink>
      </>
    );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <BrandMark /> data·hub
        </Link>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navLinks()}
          <span className="mx-2 h-4 w-px bg-line" aria-hidden="true" />
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
            className="rounded-md border border-line p-2 hover:bg-bg-soft"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div data-testid="mobile-menu" className="border-t border-line bg-bg md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-3 text-sm">
            {navLinks(() => setMenuOpen(false))}
            <div className="mt-2 flex items-center gap-2 border-t border-line pt-3">{authActions}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
