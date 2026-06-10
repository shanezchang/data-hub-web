"use client";
import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { highlightJson } from "@/lib/highlight";
import { CURL_NEWS, CURL_YC } from "@/lib/snippets";
import newsSnap from "@/lib/snapshots/news.json";
import ycSnap from "@/lib/snapshots/yc.json";

const TABS = [
  { key: "news", label: "新闻联播", curl: CURL_NEWS, json: highlightJson(JSON.stringify(newsSnap, null, 2)) },
  { key: "yc", label: "YC 公司目录", curl: CURL_YC, json: highlightJson(JSON.stringify(ycSnap, null, 2)) },
];

export function ResponseDemo() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <section id="response-demo" className="border-t border-line bg-bg-soft/50">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-2xl font-bold">真实响应示例</h2>
        <p className="mt-2 text-sm text-muted">下面是生产 API 的真实返回（快照），注册前就能看到数据长什么样。</p>
        <div className="mt-6 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm ${tab.key === t.key ? "bg-fg font-medium text-bg" : "border border-line text-muted hover:bg-bg-soft"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <CodeBlock html={tab.curl} className="mt-4" />
        <CodeBlock html={tab.json} className="mt-3 max-h-96 overflow-y-auto text-xs" />
      </div>
    </section>
  );
}
