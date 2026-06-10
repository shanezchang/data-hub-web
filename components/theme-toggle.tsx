"use client";

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
    <button
      aria-label="切换主题"
      onClick={toggle}
      className="flex size-8 items-center justify-center rounded-md border border-line text-muted hover:bg-bg-soft"
    >
      {/* 两个图标都渲染,显隐交给 CSS 按 data-theme 决定 —— 避免首帧状态错位与水合不一致 */}
      <svg className="theme-icon-light size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <svg className="theme-icon-dark size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
