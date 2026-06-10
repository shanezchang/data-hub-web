import Link from "next/link";
import changelog from "@/public/changelog.json";
import { API_BASE, API_DOCS, CONTACT } from "@/lib/site";
import { BrandMark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted">
        <Link href="/" className="flex items-center gap-2 font-mono font-semibold text-fg">
          <BrandMark className="size-4" /> data·hub
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/changelog" className="hover:text-fg">更新日志</Link>
          <Link href="/about" className="hover:text-fg">关于</Link>
          <a href={API_DOCS} target="_blank" rel="noopener" className="hover:text-fg">API 文档</a>
          <a href={`${API_BASE}/llms.txt`} target="_blank" rel="noopener" className="hover:text-fg">llms.txt</a>
          <a href={`mailto:${CONTACT}`} className="hover:text-fg">联系</a>
        </nav>
        <span className="font-mono text-xs">
          <Link href="/changelog" className="rounded border border-line px-2 py-0.5 hover:text-fg">平台 v{changelog.current}</Link>
          <span className="mx-2">·</span>© 2026 data·hub
        </span>
      </div>
    </footer>
  );
}
