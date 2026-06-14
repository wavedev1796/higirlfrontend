import { InterestsSelection } from "@/features/profile";

export default function InterestsPage() {
  return (
    <div className="interests-page-container">
      <div className="interests-page-card">
        <div className="modal-header">
          <h2>¿Qué te apasiona?</h2>
          <p>Selecciona al menos 3 temas de tu interés para personalizar tu experiencia.</p>
        </div>
        <div className="modal-body">
          <InterestsSelection />
        </div>
      </div>
    </div>
  );
}
