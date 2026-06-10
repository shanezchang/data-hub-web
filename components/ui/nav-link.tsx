"use client";
import Link, { useLinkStatus } from "next/link";
import { ComponentProps } from "react";

function PendingDot() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <svg data-testid="nav-pending" className="size-3 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** 站内跳转链接:导航期间在文字后追加小 spinner(useLinkStatus),消除"点了没反应"。 */
export function NavLink({ children, className = "", ...rest }: ComponentProps<typeof Link>) {
  return (
    <Link {...rest} className={`inline-flex items-center gap-1.5 ${className}`}>
      {children}
      <PendingDot />
    </Link>
  );
}
