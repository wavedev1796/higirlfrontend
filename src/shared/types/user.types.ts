/**
 * Shared — Global user types.
 *
 * `User` is a domain-wide concept used by auth, profile, feed, etc.
 * It lives in shared so no feature "owns" it.
 */

export type UserRole = "user" | "admin";

export interface User {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  rol: UserRole;
  interestsCount?: number;
}

/**
 * Datos mínimos con los que el backend identifica a otra usuaria: lo que hace
 * falta para pintarla en una lista, un chat o un avatar.
 *
 * Los features la extienden con lo suyo (bio, compatibilidad…) en vez de
 * redeclarar estos cinco campos, que es lo que ocurría en chat, connections,
 * matching y moderation.
 */
export interface UserSummary {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  foto?: string | null;
}
