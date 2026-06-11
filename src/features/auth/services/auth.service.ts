/**
 * Auth feature — auth service.
 *
 * Handles all API calls related to authentication.
 */

import { fetchApi } from "@/infrastructure/api/client";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import type { LoginResponse, RegisterResponse } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rol?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterUserData): Promise<RegisterResponse> => {
    return fetchApi<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        rol: userData.rol ?? "user",
      }),
    });
  },

  getProfile: async (): Promise<unknown> => {
    return fetchApi<unknown>(API_ENDPOINTS.AUTH.ME);
  },
} as const;
