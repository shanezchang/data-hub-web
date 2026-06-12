"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmModal({ open, onClose, onConfirm, title, body, confirmText, pending }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; body: string; confirmText: string; pending?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !pending) onClose(); }}>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={pending}>取消</Button>
          <Button variant="destructive" onClick={onConfirm} pending={pending} pendingText="处理中…">{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
