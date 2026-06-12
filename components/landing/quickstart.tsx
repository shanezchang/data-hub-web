import Link from "next/link";
import { KeyRoundIcon, TerminalIcon, UserPlusIcon, type LucideIcon } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { CURL_QUICKSTART } from "@/lib/snippets";
import { SectionHeader } from "./section-header";

const STEPS: { n: string; icon: LucideIcon; t: string; d: string; body: React.ReactNode }[] = [
  { n: "01", icon: UserPlusIcon, t: "注册账号", d: "邮箱验证即可开通。", body: <Link href="/register" className="text-sm text-brand hover:underline">注册 →</Link> },
  { n: "02", icon: KeyRoundIcon, t: "生成 API key", d: "控制台生成，按 key 限流，可随时吊销。", body: <p className="font-mono text-xs text-muted-foreground">dh_xxxxxxxx…（仅展示一次）</p> },
  { n: "03", icon: TerminalIcon, t: "调用", d: "一个 header 完成认证。", body: <CodeBlock html={CURL_QUICKSTART} className="text-xs" /> },
];

export function Quickstart() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <SectionHeader kicker="Quickstart" title="三步接入" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="relative rounded-lg border bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-md border bg-muted/60 text-muted-foreground">
                <s.icon className="size-4.5" aria-hidden="true" />
              </span>
              <p className="font-mono text-xs text-brand">{s.n}</p>
            </div>
            <h3 className="mt-4 font-semibold">{s.t}</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">{s.d}</p>
            {s.body}
          </div>
        ))}
      </div>
    </section>
  );
}
