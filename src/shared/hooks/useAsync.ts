/**
 * Shared hook — useAsync.
 *
 * Generic async operation state manager. Eliminates the repeated
 * idle/loading/success/error + data + error pattern across hooks.
 *
 * @example
 * const { execute, status, data, error } = useAsync<LoginResponse>();
 * await execute(() => authService.login(credentials));
 */

"use client";

import { useCallback, useState } from "react";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T> => {
    setState({ status: "loading", data: null, error: null });
    try {
      const result = await asyncFn();
      setState({ status: "success", data: result, error: null });
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error inesperado";
      setState({ status: "error", data: null, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle", data: null, error: null });
  }, []);

  return { ...state, execute, reset };
}
