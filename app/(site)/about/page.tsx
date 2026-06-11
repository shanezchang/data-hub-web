import type { Metadata } from "next";
import Link from "next/link";
import { DATASETS } from "@/lib/datasets";
import { API_DOCS, CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "关于", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">About</p>
      <h1 className="text-3xl font-bold leading-tight">一个人维护的<br />数据 API 平台。</h1>
      <p className="mt-5 max-w-xl leading-relaxed text-muted">
        data·hub 把零散的公开数据整理成结构化、可检索、能被 AI 直接调用的接口。
        {/* 数据集名单从注册表渲染,新数据集上线自动跟上(此前手写"两个数据集"已漂移过一次) */}
        已上线 {DATASETS.length} 个数据集：{DATASETS.map((d, i) => (
          <span key={d.slug}>
            {i > 0 && "、"}
            <Link href={`/datasets/${d.slug}`} className="text-accent hover:underline">{d.name}</Link>
          </span>
        ))}，后续会持续接入更多数据源。
      </p>
      <div className="mt-12">
        <h2 className="font-semibold">联系方式</h2>
        <p className="mt-2 text-sm text-muted">有数据需求、合作或问题，欢迎直接联系。</p>
        <p className="mt-3 text-sm">邮箱 · <a href={`mailto:${CONTACT}`} className="text-accent hover:underline">{CONTACT}</a></p>
        <p className="mt-1 text-sm">文档 · <a href={API_DOCS} target="_blank" rel="noopener" className="text-accent hover:underline">api.lumina-core.cn/docs</a></p>
      </div>
    </main>
  );
}
