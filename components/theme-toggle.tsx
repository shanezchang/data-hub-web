"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const THEME_COLOR = { light: "#faf9f7", dark: "#0d1117" } as const;

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("datahub_theme", next);
    } catch {}
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
  }
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="切换主题"
      onClick={toggle}
      className="text-muted-foreground"
    >
      {/* 两个图标都渲染,显隐交给 CSS 按 data-theme 决定 —— 避免首帧状态错位与水合不一致 */}
      <MoonIcon className="theme-icon-light" aria-hidden="true" />
      <SunIcon className="theme-icon-dark" aria-hidden="true" />
    </Button>
  );
}
