import { DATASETS } from "@/lib/datasets";
import { NavLink } from "@/components/ui/nav-link";

export function Datasets() {
  return (
    <section id="datasets" className="scroll-mt-14 border-t border-line bg-bg-soft/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">数据集</h2>
        <p className="mt-2 text-sm text-muted">每个数据集一套独立端点（<code className="font-mono">/v1/{"{dataset}"}/*</code>），统一认证与限流。持续扩展中。</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {DATASETS.map((d) => (
            <article key={d.slug} className="flex flex-col rounded-lg border border-line bg-bg p-6">
              <p className="font-mono text-xs text-accent">{d.slug}</p>
              <h3 className="mt-1.5 font-semibold">
                <NavLink href={`/datasets/${d.slug}`} className="hover:underline">{d.name}</NavLink>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{d.tagline}</p>
              <p className="mt-3 text-sm text-muted">{d.coverage[0]}</p>
              <NavLink href={`/datasets/${d.slug}`} className="mt-4 self-start text-sm text-accent hover:underline">
                端点与示例 →
              </NavLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
