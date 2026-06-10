/**
 * Typed environment variables.
 *
 * Centralises every `process.env.*` read so the rest of the codebase
 * never accesses `process.env` directly.
 */

export const env = {
  /** Base URL for the backend API (includes version prefix). */
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1",
} as const;
