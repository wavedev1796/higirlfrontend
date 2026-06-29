"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/shared/constants/routes";
import { CompatibilityBadge } from "./CompatibilityBadge";
import type { DiscoverUser } from "../types";

const MAX_INTERESTS = 3;

function getInitials(nombre: string, apellido: string): string {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

import { getProfilePhotoUrl } from "../../profile/services/profile.service";

interface DiscoverCardProps {
  item: DiscoverUser;
  onIgnore: () => void;
}

export function DiscoverCard({ item, onIgnore }: DiscoverCardProps) {
  const { usuario, compatibilidad } = item;
  const [isIgnoring, setIsIgnoring] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  async function handleIgnore() {
    setIsIgnoring(true);
    setHidden(true);
    onIgnore();
  }

  const visibleInterests = usuario.intereses.slice(0, MAX_INTERESTS);
  const extraCount = usuario.intereses.length - MAX_INTERESTS;

  return (
    <article className="discover-card">
      <div className="discover-card-avatar">
        {usuario.foto ? (
          <Image
            src={getProfilePhotoUrl(usuario.foto) as string}
            alt={`Foto de ${usuario.nombre}`}
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <span className="avatar-initials">
            {getInitials(usuario.nombre, usuario.apellido)}
          </span>
        )}
      </div>

      <div className="discover-card-body">
        <h3 className="discover-card-name">
          {usuario.nombre} {usuario.apellido}
        </h3>

        <CompatibilityBadge value={compatibilidad} />

        {visibleInterests.length > 0 && (
          <div className="discover-card-interests">
            {visibleInterests.map((int) => (
              <span key={int.id} className="interest-tag">
                {int.nombre}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="interest-tag interest-tag-more">
                +{extraCount}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="discover-card-actions">
        <Link
          href={ROUTES.AFFINITY_DETAIL(usuario.id)}
          className="btn btn-secondary"
        >
          Ver perfil
        </Link>
        <button
          type="button"
          className="btn btn-ghost"
          aria-label={`Conectar con ${usuario.nombre}`}
        >
          Conectar
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleIgnore}
          disabled={isIgnoring}
          aria-label={`Ignorar a ${usuario.nombre}`}
        >
          Ignorar
        </button>
      </div>
    </article>
  );
}
