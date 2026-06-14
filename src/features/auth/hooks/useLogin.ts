/**
 * Auth feature — useLogin hook.
 *
 * Uses the shared `useAsync` pattern and delegates token
 * storage to the AuthProvider (no direct localStorage access).
 */

"use client";

import { useCallback } from "react";
import { useAsync } from "@/shared/hooks/useAsync";
import { authService } from "../services/auth.service";
import type { LoginResponse } from "../types";

export function useLogin() {
  const { status, data, error, execute } = useAsync<LoginResponse>();

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      return execute(() => authService.login(credentials));
    },
    [execute],
  );

  return { login, status, error, data };
}
