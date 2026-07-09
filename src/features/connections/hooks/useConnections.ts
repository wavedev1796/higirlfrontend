"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { connectionsService } from "../services/connections.service";
import type { Connection, ConnectionStatus } from "../types";

const REFRESH_INTERVAL_MS = 12_000;

interface UseConnectionsOptions {
  status: ConnectionStatus;
  poll?: boolean;
}

export function useConnections({
  status,
  poll = true,
}: UseConnectionsOptions) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const refresh = useCallback(
    async (silent = false) => {
      const currentRequest = ++requestId.current;
      if (silent) setRefreshing(true);
      else setLoading(true);

      try {
        const result = await connectionsService.list(status);
        if (currentRequest !== requestId.current) return;
        setConnections(result);
        setError(null);
      } catch (reason: unknown) {
        if (currentRequest !== requestId.current) return;
        setError(
          reason instanceof ApiError
            ? reason.message
            : "No pudimos cargar tus conexiones.",
        );
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [status],
  );

  useEffect(() => {
    queueMicrotask(() => void refresh());
  }, [refresh]);

  useEffect(() => {
    if (!poll) return;

    const interval = window.setInterval(() => void refresh(true), REFRESH_INTERVAL_MS);
    const handleFocus = () => void refresh(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [poll, refresh]);

  const removeLocally = useCallback((connectionId: number) => {
    setConnections((current) =>
      current.filter((connection) => connection.id !== connectionId),
    );
  }, []);

  return {
    connections,
    loading,
    refreshing,
    error,
    refresh,
    removeLocally,
  };
}
