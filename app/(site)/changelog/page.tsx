import type { Metadata } from "next";
import changelog from "@/public/changelog.json";

export const metadata: Metadata = { title: "更新日志", alternates: { canonical: "/changelog" } };

const TYPE_LABEL: Record<string, string> = { added: "新增", changed: "优化", fixed: "修复", removed: "移除", security: "安全" };
const TYPE_CLASS: Record<string, string> = {
  added: "text-brand border-brand/40",
  security: "text-[var(--destructive)] border-[var(--destructive)]/40",
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand">Changelog</p>
      <h1 className="text-3xl font-bold">我们一直在迭代。</h1>
      <p className="mt-3 text-muted-foreground">每一次变更都记录在这里，版本号与代码 tag 一一对应。</p>
      <div className="mt-12 space-y-12">
        {changelog.releases.map((r) => (
          <article key={r.version} className="grid gap-3 sm:grid-cols-[110px_1fr]">
            <div>
              <p className="font-mono text-sm font-semibold">v{r.version}</p>
              <time className="text-xs text-muted-foreground">{r.date}</time>
            </div>
            <div>
              {"title" in r && r.title ? <h2 className="mb-2 font-semibold">{r.title}</h2> : null}
              <ul className="space-y-2">
                {r.changes.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed">
                    <span className={`mt-0.5 h-fit shrink-0 rounded border px-1.5 py-0 font-mono text-[11px] ${TYPE_CLASS[c.type] ?? "border-border text-muted-foreground"}`}>
                      {TYPE_LABEL[c.type] ?? c.type}
                    </span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
