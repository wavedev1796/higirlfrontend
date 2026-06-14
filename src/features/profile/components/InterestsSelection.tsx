"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/features/auth";
import { profileService } from "../services/profile.service";
import type { CatalogItem } from "../types";

export function InterestsSelection({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const { refreshUser } = useAuthStore();
  const [interests, setInterests] = useState<CatalogItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([profileService.getInterests(), profileService.getMe()])
      .then(([allInterests, myProfile]) => {
        setInterests(allInterests);
        setSelectedIds(myProfile.intereses.map((i) => i.id));
      })
      .catch(() => {
        setError("No pudimos cargar los intereses.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const toggleInterest = (id: number) => {
    setError(null);
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const handleSave = async () => {
    if (selectedIds.length < 3) {
      setError("Por favor selecciona al menos 3 intereses.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await profileService.updateInterests(selectedIds);
      await refreshUser();
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar intereses.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="profile-state">Cargando temas...</div>;
  }

  return (
    <>
      <div className="interests-grid">
        {interests.map((interest) => (
          <button
            key={interest.id}
            type="button"
            className={`interest-card ${
              selectedIds.includes(interest.id) ? "selected" : ""
            }`}
            onClick={() => toggleInterest(interest.id)}
          >
            {interest.nombre}
          </button>
        ))}
      </div>

      <div className="modal-footer">
        {error && <p className="selection-error">{error}</p>}
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          disabled={selectedIds.length < 3}
        >
          Guardar y continuar
        </Button>
      </div>
    </>
  );
}
