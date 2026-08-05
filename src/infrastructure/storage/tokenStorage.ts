/**
 * Token storage abstraction.
 *
 * All token persistence goes through this module so we can swap the
 * underlying mechanism (localStorage → cookies → secure storage)
 * without touching business logic.
 */

const TOKEN_KEY = "higirl_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  /** Retrieve the stored auth token, or `null` if absent. */
  get(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Persist an auth token. */
  set(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  /** Remove the stored auth token. */
  remove(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
  },
} as const;
