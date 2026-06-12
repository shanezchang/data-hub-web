"use client";
import { usePathname } from "next/navigation";
import { ChartColumnIcon, ExternalLinkIcon, KeyRoundIcon, LayoutDashboardIcon, SettingsIcon, type LucideIcon } from "lucide-react";
import { API_DOCS } from "@/lib/site";
import { NavLink } from "@/components/ui/nav-link";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "概览", icon: LayoutDashboardIcon },
  { href: "/dashboard/keys", label: "API Keys", icon: KeyRoundIcon },
  { href: "/dashboard/usage", label: "用量", icon: ChartColumnIcon },
  { href: "/dashboard/settings", label: "设置", icon: SettingsIcon },
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
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
          >
            <n.icon className={`size-4 shrink-0 ${active ? "text-brand" : ""}`} aria-hidden="true" />
            {n.label}
          </NavLink>
        );
      })}
      <a
        href={API_DOCS}
        target="_blank"
        rel="noopener"
        className="mt-3 inline-flex items-center gap-1.5 px-3 text-xs text-muted-foreground hover:text-foreground"
      >
        API 文档 <ExternalLinkIcon className="size-3" aria-hidden="true" />
      </a>
    </nav>
  );
  return (
    <>
      <aside className="hidden w-52 shrink-0 border-r md:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose}>
          <aside className="h-full w-60 border-r bg-background" onClick={(e) => e.stopPropagation()}>{nav}</aside>
        </div>
      )}
    </>
  );
}
