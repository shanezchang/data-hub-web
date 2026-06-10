"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function NewKeyModal({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: (fullKey: string) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("我的应用");
  const [pending, setPending] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await api<{ api_key: string }>("/portal/keys", { method: "POST", auth: true, body: { name: name.trim() } });
      onCreated(res.api_key);
      toast("已生成，请立即复制保存", "ok");
      onClose();
    } catch (err) {
      toast((err as Error).message, "err");
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="生成新 Key">
      <form onSubmit={create} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">Key 名称
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            placeholder="标记它的用途，如:我的应用"
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-fg"
          />
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>取消</Button>
          <Button type="submit" pending={pending} pendingText="生成中…">生成</Button>
        </div>
      </form>
    </Modal>
  );
}
