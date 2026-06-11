"use client";
// 自建访问打点:路由变化时 sendBeacon 到后端 /t(经 /api 重写)。
// 隐私:服务端不存原始 IP/UA(日轮换匿名哈希),referrer 只留主机名;/dashboard 不打。
// 打点失败完全静默 —— 它永远不该影响页面。

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;
    try {
      const payload = JSON.stringify({ path: pathname, ref: document.referrer || null });
      const blob = new Blob([payload], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/t", blob)) {
        fetch("/api/t", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
      }
    } catch {
      /* 打点静默失败 */
    }
  }, [pathname]);

  return null;
}
