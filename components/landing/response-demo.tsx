"use client";
import { useState } from "react";
import { CodeBlock, TerminalBlock } from "@/components/code-block";
import { highlightJson } from "@/lib/highlight";
import { CURL_NEWS, CURL_YC } from "@/lib/snippets";
import newsSnap from "@/lib/snapshots/news.json";
import ycSnap from "@/lib/snapshots/yc.json";
import { SectionHeader } from "./section-header";

const TABS = [
  { key: "news", label: "新闻联播", curl: CURL_NEWS, json: highlightJson(JSON.stringify(newsSnap, null, 2)) },
  { key: "yc", label: "YC 公司目录", curl: CURL_YC, json: highlightJson(JSON.stringify(ycSnap, null, 2)) },
];

export function ResponseDemo() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <section id="response-demo" className="border-t bg-muted/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <SectionHeader kicker="Live Response" title="真实响应示例" desc="生产 API 的响应快照。" />
        <div className="mt-6 inline-flex rounded-lg border bg-muted/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              aria-pressed={tab.key === t.key}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${tab.key === t.key ? "bg-card font-medium text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <TerminalBlock html={tab.curl} title="bash" className="mt-4" />
        <CodeBlock html={tab.json} className="mt-3 max-h-96 overflow-y-auto text-xs" />
      </div>
    </section>
  );
}
