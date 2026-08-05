/**
 * Auth feature — useRegister hook.
 *
 * Uses the shared `useAsync` pattern.
 */

"use client";

import { useCallback } from "react";
import { useAsync } from "@/shared/hooks/useAsync";
import { authService } from "../services/auth.service";
import type { RegisterResponse, RegisterRequest } from "../types";

export function useRegister() {
  const { status, data, error, execute } = useAsync<RegisterResponse>();

  const register = useCallback(
    async (userData: RegisterRequest) => {
      return execute(() => authService.register(userData));
    },
    [execute],
  );

  return { register, status, error, data };
}
