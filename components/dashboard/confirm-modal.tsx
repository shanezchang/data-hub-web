"use client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function ConfirmModal({ open, onClose, onConfirm, title, body, confirmText, pending }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; body: string; confirmText: string; pending?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted">{body}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>取消</Button>
        <Button variant="danger" onClick={onConfirm} pending={pending} pendingText="处理中…">{confirmText}</Button>
      </div>
    </Modal>
  );
}
