"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { profileService } from "../services/profile.service";
import type { Profile } from "../types";
import { ProfileAvatar } from "./ProfileAvatar";

const civilStatusLabels = {
  soltera: "Soltera",
  casada: "Casada",
  union_libre: "Unión libre",
  divorciada: "Divorciada",
  viuda: "Viuda",
};

export function ProfileView() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getMe()
      .then(setProfile)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No pudimos cargar tu perfil.",
        );
      });
  }, []);

  if (error) {
    return <div className="profile-state profile-error">{error}</div>;
  }

  if (!profile) {
    return <div className="profile-state">Cargando tu perfil...</div>;
  }

  const fullName = `${profile.nombre} ${profile.apellido}`.trim();

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-copy">
          <p className="eyebrow">Tu espacio personal</p>
          <h1>Mi perfil</h1>
          <p>
            Esta es la historia que compartes con la comunidad. Hazla tan tuya
            como quieras.
          </p>
        </div>
        <Link className="profile-edit-link" href={ROUTES.PROFILE_EDIT}>
          Editar perfil
        </Link>
      </div>

      <div className="profile-grid">
        <article className="profile-summary-card">
          <ProfileAvatar name={fullName} photo={profile.foto} />
          <div>
            <h2>{fullName}</h2>
            <p>@{profile.usuario}</p>
            <span>{profile.email}</span>
          </div>
          {profile.bio ? (
            <blockquote>{profile.bio}</blockquote>
          ) : (
            <p className="profile-empty">
              Aún no has agregado una biografía. Cuéntanos un poco sobre ti.
            </p>
          )}
        </article>

        <article className="profile-details-card">
          <h2>Sobre mí</h2>
          <dl className="profile-details">
            <div>
              <dt>Ciudad</dt>
              <dd>{profile.ciudad || "Sin completar"}</dd>
            </div>
            <div>
              <dt>Profesión</dt>
              <dd>{profile.profesion || "Sin completar"}</dd>
            </div>
            <div>
              <dt>Empresa</dt>
              <dd>{profile.empresa || "Sin completar"}</dd>
            </div>
            <div>
              <dt>Fecha de nacimiento</dt>
              <dd>{profile.fechaNacimiento || "Sin completar"}</dd>
            </div>
            <div>
              <dt>Estado civil</dt>
              <dd>
                {profile.estadoCivil
                  ? civilStatusLabels[profile.estadoCivil]
                  : "Sin completar"}
              </dd>
            </div>
            <div>
              <dt>Hijos</dt>
              <dd>
                {profile.tieneHijos
                  ? `${profile.numeroHijos} ${profile.numeroHijos === 1 ? "hijo" : "hijos"}`
                  : "No"}
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <article className="profile-interests-card">
        <div>
          <p className="eyebrow">Lo que te mueve</p>
          <h2>Intereses y categorías</h2>
        </div>
        <div className="profile-tags">
          {[...profile.intereses, ...profile.categorias].length ? (
            [...profile.intereses, ...profile.categorias].map((item) => (
              <span key={`${item.nombre}-${item.id}`}>{item.nombre}</span>
            ))
          ) : (
            <p className="profile-empty">Todavía no elegiste intereses.</p>
          )}
        </div>
      </article>
    </section>
  );
}
