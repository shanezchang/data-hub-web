"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";

type Kind = "ok" | "err" | "";
type ToastItem = { id: number; msg: string; kind: Kind };
const ToastCtx = createContext<(msg: string, kind?: Kind) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);
  const toast = useCallback((msg: string, kind: Kind = "") => {
    const id = ++seq.current;
    setItems((p) => [...p, { id, msg, kind }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className="rounded-md border border-line bg-bg-soft px-4 py-2 text-sm shadow-lg"
            style={{ color: t.kind === "err" ? "var(--err)" : t.kind === "ok" ? "var(--accent)" : "var(--fg)" }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
