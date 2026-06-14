"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ROUTES } from "@/shared/constants/routes";
import { profileService } from "@/features/profile";
import type { Profile } from "@/features/profile";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileService
      .getMe()
      .then(setProfile)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="profile-state">Cargando ajustes...</div>;
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
    </section>
  );
}
