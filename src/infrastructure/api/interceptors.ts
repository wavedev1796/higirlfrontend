/**
 * Request/response interceptors.
 *
 * Builds auth headers and normalises backend error messages.
 */

import { tokenStorage } from "../storage/tokenStorage";

/** Build default headers, injecting the Bearer token when available. */
export function buildHeaders(custom: HeadersInit = {}): Record<string, string> {
  const token = tokenStorage.get();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(custom as Record<string, string>),
  };
}

/**
 * Extract a human-readable message from an unknown API response body.
 *
 * Supports both `message` (string | string[]) and the Spanish `mensaje`
 * field that the current backend occasionally returns.
 */
export function getResponseMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null) {
    const payload = data as { message?: unknown; mensaje?: unknown };

    if (Array.isArray(payload.message)) {
      return payload.message.join(" ");
    }

    return String(payload.mensaje ?? payload.message ?? fallback);
  }

  return fallback;
}
