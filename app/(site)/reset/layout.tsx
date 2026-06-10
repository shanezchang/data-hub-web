import type { Metadata } from "next";

export const metadata: Metadata = { title: "重置密码", alternates: { canonical: "/reset" } };

export default function ResetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
