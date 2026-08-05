"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Flag, Ban } from "lucide-react";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import { Toast } from "@/shared/components/ui/Toast";
import { moderationService } from "../services/moderation.service";
import type { ReportReason } from "../types";
import { ReportDialog } from "./ReportDialog";

interface ModerationMenuProps {
  targetId: number;
  targetName: string;
  onBlocked?: () => void;
}

type Feedback = { message: string; variant: "success" | "error" };

export function ModerationMenu({ targetId, targetName, onBlocked }: ModerationMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function handleBlock() {
    setConfirmBlock(false);
    try {
      await moderationService.block(targetId);
      setFeedback({ message: `Bloqueaste a ${targetName}`, variant: "success" });
      onBlocked?.();
    } catch {
      setFeedback({ message: "No pudimos bloquear. Intenta de nuevo.", variant: "error" });
    }
  }

  async function handleReport(motivo: ReportReason, descripcion?: string) {
    setReporting(false);
    try {
      await moderationService.report(targetId, motivo, descripcion);
      setFeedback({ message: "Reporte enviado. Gracias.", variant: "success" });
    } catch {
      setFeedback({ message: "No pudimos enviar el reporte.", variant: "error" });
    }
  }

  return (
    <div className="moderation-menu" ref={ref}>
      <button
        type="button"
        className="moderation-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Opciones para ${targetName}`}
        aria-expanded={open}
      >
        <MoreVertical size={18} aria-hidden />
      </button>

      {open && (
        <div className="moderation-dropdown" role="menu">
          <button type="button" role="menuitem" onClick={() => { setOpen(false); setReporting(true); }}>
            <Flag size={15} aria-hidden /> Reportar
          </button>
          <button type="button" role="menuitem" className="danger" onClick={() => { setOpen(false); setConfirmBlock(true); }}>
            <Ban size={15} aria-hidden /> Bloquear
          </button>
        </div>
      )}

      {confirmBlock && (
        <ConfirmDialog
          title={`¿Quieres bloquear a ${targetName}?`}
          message="Esta persona no podrá enviarte mensajes. No sabrá que la bloqueaste ni que la reportaste."
          confirmLabel="Bloquear"
          cancelLabel="Cancelar"
          onConfirm={handleBlock}
          onCancel={() => setConfirmBlock(false)}
        />
      )}

      {reporting && (
        <ReportDialog targetName={targetName} onSubmit={handleReport} onClose={() => setReporting(false)} />
      )}

      {feedback && (
        <Toast
          message={feedback.message}
          variant={feedback.variant}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
}
