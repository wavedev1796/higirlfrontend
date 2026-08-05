"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, UserRoundPlus, X } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { ApiError } from "@/lib/api";
import { Toast } from "@/shared/components/ui/Toast";
import { connectionsService } from "../services/connections.service";
import { useConnections } from "../hooks/useConnections";
import type { Connection, ConnectionUser } from "../types";
import { Avatar } from "@/shared/components/ui/Avatar";
import { ConnectionsTabs } from "./ConnectionsTabs";

type RequestMode = "recibidas" | "enviadas";

function RequestCard({
  connection,
  user,
  received,
  pendingAction,
  onRespond,
}: {
  connection: Connection;
  user: ConnectionUser;
  received: boolean;
  pendingAction: number | null;
  onRespond: (connection: Connection, status: "aceptada" | "rechazada") => void;
}) {
  const fullName = `${user.nombre} ${user.apellido}`.trim();
  const busy = pendingAction === connection.id;

  return (
    <article className="connection-row">
      <Avatar person={user} className="connection-avatar" size={64} />
      <div className="connection-person">
        <h2>{fullName}</h2>
        <p>@{user.usuario}</p>
        <span>
          {received ? "Quiere conectar contigo" : "Esperando respuesta"}
        </span>
      </div>
      {received ? (
        <div className="request-actions">
          <button
            type="button"
            className="connection-icon-button accept"
            onClick={() => onRespond(connection, "aceptada")}
            disabled={busy}
            aria-label={`Aceptar solicitud de ${fullName}`}
            title="Aceptar"
          >
            <Check size={19} aria-hidden />
          </button>
          <button
            type="button"
            className="connection-icon-button reject"
            onClick={() => onRespond(connection, "rechazada")}
            disabled={busy}
            aria-label={`Rechazar solicitud de ${fullName}`}
            title="Rechazar"
          >
            <X size={19} aria-hidden />
          </button>
        </div>
      ) : (
        <span className="request-status">
          <Clock3 size={16} aria-hidden />
          Pendiente
        </span>
      )}
    </article>
  );
}

export function RequestsView() {
  const { user } = useAuthStore();
  const [mode, setMode] = useState<RequestMode>("recibidas");
  const [pendingAction, setPendingAction] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);
  const { connections, loading, refreshing, error, refresh, removeLocally } =
    useConnections({ status: "pendiente" });

  const visibleRequests = useMemo(
    () =>
      connections.filter((connection) =>
        mode === "recibidas"
          ? connection.destinoId === user?.id
          : connection.origenId === user?.id,
      ),
    [connections, mode, user?.id],
  );

  async function handleRespond(
    connection: Connection,
    status: "aceptada" | "rechazada",
  ) {
    setPendingAction(connection.id);
    removeLocally(connection.id);

    try {
      await connectionsService.respond(connection.id, status);
      setToast({
        message:
          status === "aceptada"
            ? "Solicitud aceptada"
            : "Solicitud rechazada",
        variant: "success",
      });
      await refresh(true);
    } catch (reason: unknown) {
      setToast({
        message:
          reason instanceof ApiError
            ? reason.message
            : "No se pudo responder la solicitud.",
        variant: "error",
      });
      await refresh(true);
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section className="connections-page">
      {toast && (
        <Toast
          key={toast.message}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      <header className="connections-header">
        <div>
          <p className="connections-eyebrow">Tu comunidad</p>
          <h1>Solicitudes</h1>
          <p>Gestiona quién quiere conectar contigo y revisa tus envíos.</p>
        </div>
        {refreshing && <span className="sync-indicator">Actualizando...</span>}
      </header>

      <ConnectionsTabs />

      <div className="request-mode" role="tablist" aria-label="Tipo de solicitud">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "recibidas"}
          className={mode === "recibidas" ? "active" : ""}
          onClick={() => setMode("recibidas")}
        >
          Recibidas
          <span>{connections.filter((item) => item.destinoId === user?.id).length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "enviadas"}
          className={mode === "enviadas" ? "active" : ""}
          onClick={() => setMode("enviadas")}
        >
          Enviadas
          <span>{connections.filter((item) => item.origenId === user?.id).length}</span>
        </button>
      </div>

      <div className="connections-list" aria-live="polite">
        {loading ? (
          <div className="connections-state">Cargando solicitudes...</div>
        ) : error ? (
          <div className="connections-state error">
            <p>{error}</p>
            <button type="button" onClick={() => void refresh()}>Reintentar</button>
          </div>
        ) : visibleRequests.length === 0 ? (
          <div className="connections-state">
            <UserRoundPlusEmpty />
            <h2>No hay solicitudes {mode}</h2>
            <p>Cuando haya novedades aparecerán aquí automáticamente.</p>
          </div>
        ) : (
          visibleRequests.map((connection) => {
            const received = connection.destinoId === user?.id;
            return (
              <RequestCard
                key={connection.id}
                connection={connection}
                user={received ? connection.origen : connection.destino}
                received={received}
                pendingAction={pendingAction}
                onRespond={handleRespond}
              />
            );
          })
        )}
      </div>
    </section>
  );
}

function UserRoundPlusEmpty() {
  return <span className="connections-empty-icon"><UserRoundPlus size={26} aria-hidden /></span>;
}
