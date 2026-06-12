import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CURL_QUICKSTART } from "@/lib/snippets";

const STEPS = [
  { n: "01", t: "注册账号", d: "邮箱验证即可开通。", body: <Link href="/register" className="text-sm text-brand hover:underline">注册 →</Link> },
  { n: "02", t: "生成 API key", d: "控制台生成，按 key 限流，可随时吊销。", body: <p className="font-mono text-xs text-muted-foreground">dh_xxxxxxxx…（仅展示一次）</p> },
  { n: "03", t: "调用", d: "一个 header 完成认证。", body: <CodeBlock html={CURL_QUICKSTART} className="text-xs" /> },
];

export function Quickstart() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-2xl font-bold">三步接入</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-lg border border-border p-6">
            <p className="font-mono text-xs text-brand">{s.n}</p>
            <h3 className="mt-2 font-semibold">{s.t}</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">{s.d}</p>
            {s.body}
          </div>
        ))}
      </div>
    </section>
  );
}
