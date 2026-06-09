import { useState } from "react";
import { authService } from "../services/authService";
import { LoginResponse } from "../types";

export function useLogin() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  type LoginCredentials = { email: string; password: string; [key: string]: unknown };
  const login = async (credentials: LoginCredentials) => {
    setStatus("loading");
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.token) {
        localStorage.setItem("higirl_token", response.token);
      }
      setData(response);
      setStatus("success");
      return response;
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      throw err;
    }
  };

  return { login, status, error, data };
}
