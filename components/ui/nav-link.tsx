"use client";
import Link, { useLinkStatus } from "next/link";
import { ComponentProps } from "react";
import { Loader2Icon } from "lucide-react";

function PendingDot() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Loader2Icon data-testid="nav-pending" className="size-3 shrink-0 animate-spin" aria-hidden="true" />;
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
