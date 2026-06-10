import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { CURL_QUICKSTART } from "@/lib/snippets";

const STEPS = [
  { n: "01", t: "注册账号", d: "邮箱 + 验证码，30 秒完成。", body: <Link href="/register" className="text-sm text-accent hover:underline">免费注册 →</Link> },
  { n: "02", t: "生成 API key", d: "控制台一键生成，按 key 限流，可随时吊销。", body: <p className="font-mono text-xs text-muted">dh_xxxxxxxx…（只展示一次）</p> },
  { n: "03", t: "调用", d: "任何语言任何环境，一个 header 即可。", body: <CodeBlock html={CURL_QUICKSTART} className="text-xs" /> },
];

export function Quickstart() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <h2 className="text-2xl font-bold">三步接入</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-lg border border-line p-6">
            <p className="font-mono text-xs text-accent">{s.n}</p>
            <h3 className="mt-2 font-semibold">{s.t}</h3>
            <p className="mb-4 mt-1 text-sm text-muted">{s.d}</p>
            {s.body}
          </div>
        ))}
      </div>
    </section>
  );
}
