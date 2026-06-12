import Link from "next/link";
import { ArrowRightIcon, BotIcon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react";
import { TerminalBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { CURL_NEWS } from "@/lib/snippets";
import { API_DOCS } from "@/lib/site";
import { DATASETS } from "@/lib/datasets";
import changelog from "@/public/changelog.json";

const FACTS = [
  { icon: RefreshCwIcon, text: "每日自动更新" },
  { icon: BotIcon, text: "llms.txt / OpenAPI,Agent 直接可用" },
  { icon: ShieldCheckIcon, text: "公测期免费,注册即用" },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-16 sm:pt-20">
      <Link
        href="/changelog"
        className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
      >
        <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
        平台 v{changelog.current} · {DATASETS.length} 个数据集在线
        <ArrowRightIcon className="size-3" aria-hidden="true" />
      </Link>
      <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        把结构化数据，<br />变成给 AI 调用的接口。
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
        持续维护的公开数据集，统一的查询原语、认证与限流。注册生成 API key 即可调用。
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Button size="lg" className="px-5" asChild>
          <Link href="/register">免费注册</Link>
        </Button>
        <Button size="lg" variant="outline" className="px-5" asChild>
          <a href={API_DOCS} target="_blank" rel="noopener">查看文档</a>
        </Button>
      </div>
      <TerminalBlock html={CURL_NEWS} title="bash" className="mt-8 max-w-2xl" />
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {FACTS.map((f) => (
          <li key={f.text} className="flex items-center gap-1.5">
            <f.icon className="size-3.5 text-brand" aria-hidden="true" />
            {f.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
