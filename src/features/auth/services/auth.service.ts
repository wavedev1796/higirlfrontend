import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import type { Profile } from "@/features/profile/types";
import type { LoginResponse, RegisterResponse } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (userData: RegisterUserData) =>
    apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, userData),

  getProfile: () => apiClient.get<Profile>(API_ENDPOINTS.PROFILE.ME),

  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    }),

  resetPassword: (password: string, token: string) =>
    apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      password,
      token,
    }),
} as const;
