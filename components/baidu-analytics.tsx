"use client";
// 百度统计(hm.js):大陆考公受众为主,GA 在国内数据不全,百度统计补这一面。
// 仅当 NEXT_PUBLIC_BAIDU_ANALYTICS_ID 配置后才注入;未配置时整组件为 null(零网络请求)。
// /dashboard 鉴权区不打点,与 AnalyticsBeacon 保持一致。

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    _hmt?: unknown[][];
  }
}

const SITE_ID = process.env.NEXT_PUBLIC_BAIDU_ANALYTICS_ID;

export function BaiduAnalytics() {
  const pathname = usePathname();

  // SPA 路由切换时手动上报 pageview —— hm.js 默认只记录首屏。
  useEffect(() => {
    if (!SITE_ID || !pathname || pathname.startsWith("/dashboard")) return;
    window._hmt = window._hmt || [];
    window._hmt.push(["_trackPageview", pathname]);
  }, [pathname]);

  if (!SITE_ID) return null;

  return (
    <Script id="baidu-analytics" strategy="afterInteractive">
      {`var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?${SITE_ID}";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`}
    </Script>
  );
}
