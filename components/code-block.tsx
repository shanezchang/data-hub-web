export function CodeBlock({ html, className = "" }: { html: string; className?: string }) {
  return (
    <pre className={`overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-[13px] leading-relaxed ${className}`}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}

/** 终端窗口外框版 CodeBlock:三个窗口点 + 标题栏,落地页展示用。 */
export function TerminalBlock({ html, title = "终端", className = "" }: { html: string; title?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg border bg-card shadow-xs ${className}`}>
      <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-2.5 rounded-full bg-border" />
          <i className="size-2.5 rounded-full bg-border" />
          <i className="size-2.5 rounded-full bg-border" />
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{title}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
