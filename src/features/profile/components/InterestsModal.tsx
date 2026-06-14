"use client";

import { InterestsSelection } from "./InterestsSelection";

interface InterestsModalProps {
  onSuccess: () => void;
}

export function InterestsModal({ onSuccess }: InterestsModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h2>¿Qué te apasiona?</h2>
          <p>Selecciona al menos 3 temas para personalizar tu experiencia en Hi Girl.</p>
        </header>
        <div className="modal-body">
          <InterestsSelection onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
