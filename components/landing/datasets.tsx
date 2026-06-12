import { LandmarkIcon, NewspaperIcon, RocketIcon, TvIcon, DatabaseIcon, ArrowRightIcon, type LucideIcon } from "lucide-react";
import { DATASETS } from "@/lib/datasets";
import { NavLink } from "@/components/ui/nav-link";
import { SectionHeader } from "./section-header";

const ICONS: Record<string, LucideIcon> = {
  news: TvIcon,
  yc: RocketIcon,
  policy: LandmarkIcon,
  opinion: NewspaperIcon,
};

export function Datasets() {
  return (
    <section id="datasets" className="scroll-mt-14 border-t bg-muted/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <SectionHeader
          kicker="Datasets"
          title="数据集"
          desc={<>每个数据集一套独立端点（<code className="font-mono">/v1/{"{dataset}"}/*</code>），统一认证与限流。持续扩展中。</>}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {DATASETS.map((d) => {
            const Icon = ICONS[d.slug] ?? DatabaseIcon;
            return (
              <article
                key={d.slug}
                className="group flex flex-col rounded-lg border bg-card p-6 shadow-xs transition-colors hover:border-brand/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-md border bg-muted/60 text-muted-foreground transition-colors group-hover:border-brand/40 group-hover:text-brand">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <p className="font-mono text-xs text-brand">{d.slug}</p>
                </div>
                <h3 className="mt-4 font-semibold">
                  <NavLink href={`/datasets/${d.slug}`} className="hover:underline">{d.name}</NavLink>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{d.tagline}</p>
                <p className="mt-3 text-sm text-muted-foreground">{d.coverage[0]}</p>
                <NavLink href={`/datasets/${d.slug}`} className="mt-4 inline-flex items-center gap-1 self-start text-sm text-brand hover:underline">
                  端点与示例
                  <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </NavLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
