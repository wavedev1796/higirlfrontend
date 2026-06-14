/**
 * Auth feature — types.
 *
 * Request/response shapes specific to authentication.
 * The global `User` type lives in `shared/types/user.types.ts`.
 */

export type { User } from "@/shared/types/user.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string | string[];
  mensaje?: string;
  token?: string;
  usuario?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
  intereses?: Array<{ id: number; nombre: string }>;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message?: string | string[];
  mensaje?: string;
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    usuario: string;
    rol: string;
  };
}
