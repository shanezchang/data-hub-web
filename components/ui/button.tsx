"use client";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  pending?: boolean;
  pendingText?: string;
};

export function Button({ variant = "primary", pending, pendingText, children, className = "", disabled, ...rest }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary: "bg-fg text-bg hover:opacity-85",
    ghost: "border border-line text-fg hover:bg-bg-soft",
    danger: "border border-line text-[var(--err)] hover:bg-bg-soft",
  }[variant];
  return (
    <button {...rest} disabled={pending || disabled} className={`${base} ${styles} ${className}`}>
      {pending && (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
