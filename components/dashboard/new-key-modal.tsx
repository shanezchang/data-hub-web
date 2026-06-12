"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={(v) => { if (!v && !pending) onClose(); }}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>生成新 Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={create} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-key-name">Key 名称</Label>
            <Input
              id="new-key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="标记它的用途，如:我的应用"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>取消</Button>
            <Button type="submit" pending={pending} pendingText="生成中…">生成</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
