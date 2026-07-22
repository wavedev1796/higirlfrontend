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
  AFFINITY: "/afinidad",
  AFFINITY_DETAIL: (id: number | string) => `/afinidad/${id}`,
  SETTINGS: "/ajustes",
  DISCOVER: "/descubrir",
  REQUESTS: "/solicitudes",
  CONNECTIONS: "/conexiones",
  CHATS: "/chats",
  CHAT_WITH: (participantId: number | string) =>
    `/chats?participante=${participantId}`,
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;
