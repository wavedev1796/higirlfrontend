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
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
  },
  PROFILE: {
    ME: "/perfil/me",
    PHOTO: "/perfil/me/foto",
    INTERESTS: "/perfil/me/intereses",
  },
  CATALOGS: {
    INTERESTS: "/intereses",
    CATEGORIES: "/categorias",
    CITIES: "/ciudades",
  },
  MATCHING: {
    RECOMMENDATIONS: "/matching/recomendaciones",
    DISCOVER: "/descubrir",
    IGNORE: (id: number) => `/matching/ignorar/${id}`,
  },
  CONNECTIONS: {
    LIST: "/conexiones",
    DETAIL: (id: number) => `/conexiones/${id}`,
  },
  CHATS: {
    LIST: "/chats",
    MESSAGES: (id: number) => `/chats/${id}/mensajes`,
  },
  FORUMS: {
    FEED: "/feed",
    POSTS: "/publicaciones",
    LIKE: (id: number) => `/publicaciones/${id}/likes`,
    POST: (id: number) => `/publicaciones/${id}`,
  },
  NOTIFICATIONS: {
    LIST: "/notificaciones",
    MARK_READ: (id: number) => `/notificaciones/${id}/leido`,
  },
  MODERATION: {
    REPORTS: "/reportes",
    BLOCKS: "/bloqueos",
    BLOCK: (id: number) => `/bloqueos/${id}`,
  },
} as const;
