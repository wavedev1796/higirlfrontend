import { env } from "@/infrastructure/config/env";
import { tokenStorage } from "@/infrastructure/storage/tokenStorage";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getErrorMessage(data: unknown): string {
  if (typeof data !== "object" || data === null) {
    return "No se pudo completar la solicitud.";
  }

  const payload = data as { message?: unknown; mensaje?: unknown };

  if (Array.isArray(payload.message)) {
    return payload.message.join(" ");
  }

  if (typeof payload.mensaje === "string") return payload.mensaje;
  if (typeof payload.message === "string") return payload.message;

  return "No se pudo completar la solicitud.";
}

function buildHeaders(body: BodyInit | null | undefined, custom?: HeadersInit) {
  const headers = new Headers(custom);
  const token = tokenStorage.get();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${env.API_URL}${endpoint}`, {
    ...options,
    headers: buildHeaders(options.body, options.headers),
  });

  const contentType = response.headers.get("content-type");
  const data: unknown = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.remove();
    }

    throw new ApiError(getErrorMessage(data), response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    api<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    api<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    api<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
    api<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    api<T>(endpoint, { ...options, method: "DELETE" }),
} as const;
