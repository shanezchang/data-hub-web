"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function SendCodeButton({ getEmail, endpoint }: { getEmail: () => string; endpoint: string }) {
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  async function send() {
    const email = getEmail().trim();
    if (!email) return toast("请先填邮箱", "err");
    setPending(true);
    try {
      await api(endpoint, { method: "POST", body: { email } });
      toast("验证码已发送，请查收邮箱", "ok");
      setCount(60);
      timer.current = setInterval(() => {
        setCount((c) => {
          if (c <= 1 && timer.current) clearInterval(timer.current);
          return c - 1;
        });
      }, 1000);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={send} pending={pending} pendingText="发送中…"
      disabled={count > 0} className="shrink-0 whitespace-nowrap px-3 py-2 text-xs">
      {count > 0 ? `${count}s 后重发` : "发送验证码"}
    </Button>
  );
}
