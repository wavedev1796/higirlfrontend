/**
 * Shared — API response types.
 *
 * Generic wrappers for typed API responses and errors.
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  message?: string | string[];
  mensaje?: string;
  statusCode?: number;
}
