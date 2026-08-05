"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { profileService } from "@/features/profile";
import type { Profile } from "@/features/profile";
import { Skeleton } from "@/shared/components/ui/Skeleton";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getMe()
      .then(setProfile)
      .catch(() => setError("No pudimos cargar los ajustes. Inténtalo de nuevo."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="profile-skeleton">
        <Skeleton style={{ height: "2rem", width: "12rem" }} />
        <Skeleton style={{ height: "1rem", width: "20rem", marginTop: "0.25rem" }} />
        <div className="profile-skeleton-card" style={{ marginTop: "0.5rem" }}>
          <Skeleton style={{ height: "1.25rem", width: "40%" }} />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} style={{ height: "2rem", width: "6rem", borderRadius: "var(--radius-full)" }} />
            ))}
          </div>
        </div>
        <div className="profile-skeleton-card">
          <Skeleton style={{ height: "1.25rem", width: "30%" }} />
          <Skeleton style={{ height: "1rem", width: "55%" }} />
          <Skeleton style={{ height: "1rem", width: "48%" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="profile-state profile-error">{error}</div>;
  }

  return (
    <section className="settings-page">
      <header className="settings-header">
        <h1>Ajustes</h1>
        <p>Gestiona tus intereses y preferencias de la comunidad.</p>
      </header>

      <div className="settings-section">
        <div className="section-header">
          <h2>Mis Intereses</h2>
          <Link href={ROUTES.INTERESTS} className="edit-link">
            Editar
          </Link>
        </div>

        <div className="interests-tags">
          {profile?.intereses.map((interest) => (
            <span key={interest.id} className="interest-tag">
              {interest.nombre}
            </span>
          ))}
          {(!profile?.intereses || profile.intereses.length === 0) && (
            <p>No has seleccionado intereses todavía.</p>
          )}
        </div>
      </div>

      <div className="settings-section">
        <h2>Cuenta</h2>
        <p>Tu correo: <strong>{profile?.email}</strong></p>
        <p>Nombre de usuario: <strong>{profile?.usuario}</strong></p>
      </div>

      <div className="settings-section">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Lock size={18} aria-hidden />
          <h2>Privacidad</h2>
        </div>
        <ul className="settings-list">
          <li>Tu perfil es visible para todas las miembras de la comunidad.</li>
          <li>Tus intereses solo los ven las personas con quienes conectas.</li>
          <li>Puedes solicitar la eliminación de tus datos en cualquier momento.</li>
        </ul>
      </div>

      <div className="settings-section settings-danger-zone">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertTriangle size={18} aria-hidden />
          <h2>Zona peligrosa</h2>
        </div>
        <p>Estas acciones son permanentes y no se pueden deshacer.</p>
        <button type="button" className="btn-danger">
          Eliminar mi cuenta
        </button>
      </div>
    </section>
  );
}
