export function CodeBlock({ html, className = "" }: { html: string; className?: string }) {
  return (
    <pre className={`overflow-x-auto rounded-lg border border-line bg-bg-soft p-4 font-mono text-[13px] leading-relaxed ${className}`}>
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
