"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { InterestsSelection } from "./InterestsSelection";

interface InterestsModalProps {
  onSuccess: () => void;
  onClose?: () => void;
}

export function InterestsModal({ onSuccess, onClose }: InterestsModalProps) {
  useEffect(() => {
    if (!onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <div>
            <h2>¿Qué te apasiona?</h2>
            <p>Selecciona al menos 3 temas para personalizar tu experiencia en Hi Girl.</p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              style={{
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                padding: "0.25rem",
                borderRadius: "var(--radius-xs)",
                lineHeight: 0,
              }}
            >
              <X size={20} aria-hidden />
            </button>
          )}
        </header>
        <div className="modal-body">
          <InterestsSelection onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
