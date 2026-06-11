/**
 * Configured HTTP client for the Hi Girl backend.
 *
 * All API calls go through `fetchApi<T>()` so auth headers, error
 * parsing, and base URL are handled in one place.
 */

import { env } from "../config/env";
import { buildHeaders, getResponseMessage } from "./interceptors";

export interface ApiError extends Error {
  status: number;
  data: unknown;
}

/**
 * Typed fetch wrapper.
 *
 * @example
 * const user = await fetchApi<User>("/auth/perfil");
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = buildHeaders(options.headers as Record<string, string>);

  const response = await fetch(`${env.API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      getResponseMessage(data, "Error en la petición."),
    ) as ApiError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
