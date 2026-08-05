"use client";

import { useSearchParams } from "next/navigation";
import { InterestsSelection } from "@/features/profile";

export default function InterestsPage() {
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "1";

  return (
    <div className="interests-page-container">
      <div className="interests-page-card">
        {isOnboarding && (
          <div className="onboarding-banner">
            <span>Paso 1 de 2</span>
            <div>
              <strong>Elige tus intereses</strong>
              <p>
                Cuéntanos qué te apasiona para personalizar tu experiencia en
                Hi Girl.
              </p>
            </div>
          </div>
        )}
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
