export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("higirl_token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(getResponseMessage(data, "Error en la petición.")) as Error & { status: number; data: unknown };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

function getResponseMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null) {
    const payload = data as { message?: unknown; mensaje?: unknown };

    if (Array.isArray(payload.message)) {
      return payload.message.join(" ");
    }

    return String(payload.mensaje ?? payload.message ?? fallback);
  }

  return fallback;
}
