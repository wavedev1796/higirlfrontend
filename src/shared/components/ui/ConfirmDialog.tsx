"use client";

import { useEffect } from "react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div
        className="modal-content"
        style={{ maxWidth: "26rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
        </header>
        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
