"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { REPORT_REASONS, type ReportReason } from "../types";

interface ReportDialogProps {
  targetName: string;
  onSubmit: (motivo: ReportReason, descripcion?: string) => void;
  onClose: () => void;
}

export function ReportDialog({ targetName, onSubmit, onClose }: ReportDialogProps) {
  const [motivo, setMotivo] = useState<ReportReason>("acoso");
  const [descripcion, setDescripcion] = useState("");

  return createPortal(
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`Reportar a ${targetName}`} onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: "26rem" }} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div>
            <h2>Reportar a {targetName}</h2>
            <p>Cuéntanos qué está pasando. Tu reporte es confidencial.</p>
          </div>
        </header>
        {/* .modal-body aporta el padding lateral del resto de modales; sin él
            los radios y el textarea quedaban pegados al borde de la card. */}
        <div className="modal-body">
          <div className="report-reasons">
            {REPORT_REASONS.map((r) => (
              <label key={r.value} className="report-reason">
                <input
                  type="radio"
                  name="motivo"
                  value={r.value}
                  checked={motivo === r.value}
                  onChange={() => setMotivo(r.value)}
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
          <textarea
            className="report-comment"
            placeholder="Detalle (opcional)"
            maxLength={500}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => onSubmit(motivo, descripcion.trim() || undefined)}
          >
            Enviar reporte
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
