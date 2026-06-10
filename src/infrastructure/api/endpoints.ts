/**
 * Backend API endpoint paths.
 *
 * Only raw paths here — no base URL. The API client prepends `env.API_URL`.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    ME: "/auth/perfil",
  },
} as const;
