import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://console.lumina-core.cn"),
  title: { default: "data·hub · 数据 API 控制台", template: "%s · data·hub" },
  description: "data·hub — 可扩展的数据 API 平台。注册即可生成 API key，接入新闻联播、YC 公司目录等数据能力。",
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  openGraph: {
    type: "website",
    siteName: "data·hub",
    locale: "zh_CN",
    title: "data·hub · 数据 API 控制台",
    description: "把结构化数据，变成给 AI 调用的接口。注册即可自助生成 API key，一行 curl 就能用。",
    url: "https://console.lumina-core.cn/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "data·hub · 数据 API 控制台", images: ["/og.png"] },
};

const themeInit = `(function(){try{if(localStorage.getItem("datahub_theme")==="dark"){document.documentElement.setAttribute("data-theme","dark");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","#0d1117")}}catch(e){}})()`;

// 站点级结构化数据(静态字面量,无用户输入)
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://console.lumina-core.cn/#org",
      name: "data-hub",
      url: "https://console.lumina-core.cn",
      description: "Structured data APIs for AI agents: CCTV Xinwen Lianbo transcripts, Y Combinator company directory, China State Council policy documents.",
    },
    {
      "@type": "WebSite",
      name: "data·hub",
      url: "https://console.lumina-core.cn",
      publisher: { "@id": "https://console.lumina-core.cn/#org" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#faf9f7" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </head>
      <body>
        <AnalyticsBeacon />
        <ToastProvider>{children}</ToastProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
