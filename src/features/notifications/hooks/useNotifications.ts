"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationsService } from "../services/notifications.service";
import type { Notification } from "../types";

// ponytail: transporte por polling (60s). Es el ÚNICO punto acoplado al
// mecanismo de entrega: para tiempo real, sustituir el intervalo por una
// suscripción websocket/SSE aquí sin tocar la campana ni el resto.
const POLL_MS = 60_000;

interface UseNotificationsResult {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markRead: (id: number) => Promise<void>;
  refresh: () => void;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await notificationsService.list();
      setNotifications(data);
      setError(null);
    } catch {
      setError("No pudimos cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  const markRead = useCallback(async (id: number) => {
    // Optimista: marca en memoria y confirma contra el backend.
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true } : n)),
    );
    try {
      await notificationsService.markRead(id);
    } catch {
      load();
    }
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.leido).length;

  return { notifications, unreadCount, loading, error, markRead, refresh: load };
}
