import type { Metadata } from "next";

export const metadata: Metadata = { title: "注册", alternates: { canonical: "/register" } };

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
