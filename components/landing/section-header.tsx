/** 落地页区块标题统一节奏:mono 大写 kicker + 标题 + 一句说明。 */
export function SectionHeader({ kicker, title, desc }: { kicker: string; title: string; desc?: React.ReactNode }) {
  return (
    <header>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand">{kicker}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
      {desc ? <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{desc}</p> : null}
    </header>
  );
}
