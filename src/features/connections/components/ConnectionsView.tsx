"use client";

import Link from "next/link";
import { MessageCircle, UsersRound } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { ModerationMenu } from "@/features/moderation";
import { ROUTES } from "@/shared/constants/routes";
import { useConnections } from "../hooks/useConnections";
import { ConnectionAvatar } from "./ConnectionAvatar";
import { ConnectionsTabs } from "./ConnectionsTabs";

export function ConnectionsView() {
  const { user } = useAuthStore();
  const { connections, loading, refreshing, error, refresh } = useConnections({
    status: "aceptada",
  });

  return (
    <section className="connections-page">
      <header className="connections-header">
        <div>
          <p className="connections-eyebrow">Tu red</p>
          <h1>Mis conexiones</h1>
          <p>Personas con las que ya puedes compartir y conversar.</p>
        </div>
        {refreshing && <span className="sync-indicator">Actualizando...</span>}
      </header>

      <ConnectionsTabs />

      <div className="connections-list" aria-live="polite">
        {loading ? (
          <div className="connections-state">Cargando conexiones...</div>
        ) : error ? (
          <div className="connections-state error">
            <p>{error}</p>
            <button type="button" onClick={() => void refresh()}>Reintentar</button>
          </div>
        ) : connections.length === 0 ? (
          <div className="connections-state">
            <span className="connections-empty-icon"><UsersRound size={26} aria-hidden /></span>
            <h2>Aún no tienes conexiones</h2>
            <p>Explora perfiles y envía tu primera solicitud.</p>
            <Link href={ROUTES.DISCOVER} className="btn btn-secondary">
              Descubrir personas
            </Link>
          </div>
        ) : (
          connections.map((connection) => {
            const person =
              connection.origenId === user?.id
                ? connection.destino
                : connection.origen;
            const fullName = `${person.nombre} ${person.apellido}`.trim();

            return (
              <article className="connection-row" key={connection.id}>
                <ConnectionAvatar user={person} />
                <div className="connection-person">
                  <h2>{fullName}</h2>
                  <p>@{person.usuario}</p>
                  <span>{person.profesion || "Conexión de Hi Girl"}</span>
                </div>
                <Link
                  href={ROUTES.CHAT_WITH(person.id)}
                  className="connection-icon-button message"
                  aria-label={`Enviar mensaje a ${fullName}`}
                  title={`Conversar con ${fullName}`}
                >
                  <MessageCircle size={19} aria-hidden />
                </Link>
                <ModerationMenu
                  targetId={person.id}
                  targetName={fullName}
                  onBlocked={() => void refresh()}
                />
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
