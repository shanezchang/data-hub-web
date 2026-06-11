import Link from "next/link";
import changelog from "@/public/changelog.json";
import { BrandMark } from "./site-header";

// 页脚极简纪律(2026-06-11 Shane):不放导航(与顶部重复显乱)、不放联系方式。
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted">
        <Link href="/" className="flex items-center gap-2 font-mono font-semibold text-fg">
          <BrandMark className="size-4" /> data·hub
        </Link>
        <span className="font-mono text-xs">
          <Link href="/changelog" className="rounded border border-line px-2 py-0.5 hover:text-fg">平台 v{changelog.current}</Link>
          <span className="mx-2">·</span>© 2026 data·hub
        </span>
      </div>
    </footer>
  );
}
