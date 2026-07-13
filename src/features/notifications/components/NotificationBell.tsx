"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification } from "../types";

const LABELS: Record<Notification["tipo"], string> = {
  nueva_conexion: "te envió una solicitud de conexión",
  conexion_aceptada: "aceptó tu solicitud de conexión",
};

function targetRoute(tipo: Notification["tipo"]): string {
  return tipo === "nueva_conexion" ? ROUTES.REQUESTS : ROUTES.CONNECTIONS;
}

export function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function handleSelect(n: Notification) {
    if (!n.leido) await markRead(n.id);
    setOpen(false);
    router.push(targetRoute(n.tipo));
  }

  return (
    <div className="notif-bell" ref={ref}>
      <button
        type="button"
        className="notif-bell-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`}
        aria-expanded={open}
      >
        <Bell size={18} aria-hidden />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown" role="menu">
          <header className="notif-dropdown-header">Notificaciones</header>
          {notifications.length === 0 ? (
            <p className="notif-empty">No tienes notificaciones.</p>
          ) : (
            <ul className="notif-list">
              {notifications.map((n) => (
                <li key={n.id} className="notif-row">
                  <button
                    type="button"
                    className={`notif-item${n.leido ? "" : " notif-item-unread"}`}
                    onClick={() => handleSelect(n)}
                    role="menuitem"
                  >
                    <span className="notif-item-text">
                      <strong>{n.payload?.actorNombre || "Alguien"}</strong>{" "}
                      {LABELS[n.tipo]}
                    </span>
                    {!n.leido && <span className="notif-dot" aria-hidden />}
                  </button>
                  {!n.leido && (
                    <button
                      type="button"
                      className="notif-mark-read"
                      onClick={() => markRead(n.id)}
                      aria-label={`Marcar como leída la notificación de ${n.payload?.actorNombre || "alguien"}`}
                      title="Marcar como leída"
                    >
                      <Check size={15} aria-hidden />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
