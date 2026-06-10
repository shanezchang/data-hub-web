import type { Metadata } from "next";
import "./globals.css";
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

const themeInit = `(function(){try{if(localStorage.getItem("datahub_theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#faf9f7" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
