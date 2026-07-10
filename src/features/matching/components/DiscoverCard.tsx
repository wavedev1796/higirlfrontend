"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/shared/constants/routes";
import { connectionsService } from "@/features/connections";
import { ApiError } from "@/lib/api";
import { Toast } from "@/shared/components/ui/Toast";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [confirmingIgnore, setConfirmingIgnore] = useState(false);

  if (hidden) return null;

  async function handleIgnore() {
    setIsIgnoring(true);
    setHidden(true);
    onIgnore();
  }

  async function handleConnect() {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      await connectionsService.send(usuario.id);
      setConnectionSent(true);
    } catch (reason: unknown) {
      setConnectionError(
        reason instanceof ApiError
          ? reason.message
          : "No se pudo enviar la solicitud.",
      );
    } finally {
      setIsConnecting(false);
    }
  }

  const visibleInterests = usuario.intereses.slice(0, MAX_INTERESTS);
  const extraCount = usuario.intereses.length - MAX_INTERESTS;

  return (
    <article className="discover-card">
      {connectionError && (
        <Toast
          message={connectionError}
          onClose={() => setConnectionError(null)}
        />
      )}
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
          onClick={handleConnect}
          disabled={isConnecting || connectionSent}
          aria-label={`Conectar con ${usuario.nombre}`}
        >
          {connectionSent
            ? "Solicitud enviada"
            : isConnecting
              ? "Enviando..."
              : "Conectar"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setConfirmingIgnore(true)}
          disabled={isIgnoring}
          aria-label={`Ignorar a ${usuario.nombre}`}
        >
          Ignorar
        </button>
      </div>

      {confirmingIgnore && (
        <ConfirmDialog
          title="Dejar de ver esta recomendación"
          message={`¿Seguro que quieres dejar de ver a ${usuario.nombre} como recomendación? No volverá a aparecer en Descubrir.`}
          confirmLabel="Sí, ignorar"
          cancelLabel="Cancelar"
          onCancel={() => setConfirmingIgnore(false)}
          onConfirm={() => {
            setConfirmingIgnore(false);
            handleIgnore();
          }}
        />
      )}
    </article>
  );
}
