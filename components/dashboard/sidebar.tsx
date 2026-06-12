"use client";
import { usePathname } from "next/navigation";
import { API_DOCS } from "@/lib/site";
import { NavLink } from "@/components/ui/nav-link";

const NAV = [
  { href: "/dashboard", label: "概览" },
  { href: "/dashboard/keys", label: "API Keys" },
  { href: "/dashboard/usage", label: "用量" },
  { href: "/dashboard/settings", label: "设置" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((n) => {
        const active = pathname === n.href;
        return (
          <NavLink
            key={n.href}
            href={n.href}
            onClick={onClose}
            className={`rounded-md px-3 py-2 text-sm ${active ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            {n.label}
          </NavLink>
        );
      })}
      <a href={API_DOCS} target="_blank" rel="noopener" className="mt-3 px-3 text-xs text-muted-foreground hover:text-foreground">API 文档 ↗</a>
    </nav>
  );
  return (
    <>
      <aside className="hidden w-52 shrink-0 border-r border-border md:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose}>
          <aside className="h-full w-60 border-r border-border bg-background" onClick={(e) => e.stopPropagation()}>{nav}</aside>
        </div>
      )}
    </>
  );
}
