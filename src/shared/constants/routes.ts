/**
 * Shared — Navigation routes.
 *
 * Only client-side navigation paths. API endpoints live in
 * `infrastructure/api/endpoints.ts`.
 */

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/feed",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  INTERESTS: "/intereses",
  SETTINGS: "/ajustes",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;
