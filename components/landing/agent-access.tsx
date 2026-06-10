"use client";
import { useState } from "react";
import { API_BASE, API_DOCS } from "@/lib/site";

const LLMS_TXT = `${API_BASE}/llms.txt`;

const LAYERS = [
  { name: "llms.txt", href: LLMS_TXT, desc: "极简 Markdown 概览，Agent 第一眼就能开始调" },
  { name: "openapi.json", href: `${API_BASE}/openapi.json`, desc: "完整机器可读契约，需要精确参数时" },
  { name: "/docs", href: API_DOCS, desc: "Swagger 交互文档，给人看" },
];

export function AgentAccess() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(LLMS_TXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时,链接本身可手动选中复制 */
    }
  }
  return (
    <section id="agents" className="scroll-mt-14 border-t border-line bg-bg-soft/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">给 AI Agent，一个链接就够</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          上面三步是给人看的。如果调用方是 Claude、ChatGPT 或任何 Agent 框架——把这个链接发给它，它能自己读懂全部端点和参数。
        </p>
        <div className="mt-6 flex max-w-2xl items-center gap-2 overflow-hidden rounded-lg border border-line bg-bg px-4 py-3">
          <a href={LLMS_TXT} target="_blank" rel="noopener" className="min-w-0 flex-1 truncate font-mono text-sm text-accent hover:underline">
            {LLMS_TXT}
          </a>
          <button
            type="button"
            onClick={copy}
            className="shrink-0 rounded-md border border-line px-3 py-1 text-xs hover:bg-bg-soft"
          >
            {copied ? "已复制 ✓" : "复制"}
          </button>
        </div>
        <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
          {LAYERS.map((l) => (
            <a key={l.name} href={l.href} target="_blank" rel="noopener" className="rounded-lg border border-line bg-bg p-4 hover:border-fg/30">
              <p className="font-mono text-sm font-semibold">{l.name}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{l.desc}</p>
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          认证只有一个 <code className="font-mono text-fg">X-API-Key</code> header——注册后在控制台生成，发给你的 Agent 即可。
        </p>
      </div>
    </section>
  );
}
