import { useState } from "react";
import { authService } from "../services/authService";
import { RegisterResponse } from "../types";

export function useRegister() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegisterResponse | null>(null);

  const register = async (userData: any) => {
    setStatus("loading");
    setError(null);
    try {
      const response = await authService.register(userData);
      setData(response);
      setStatus("success");
      return response;
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Error al crear cuenta");
      throw err;
    }
  };

  return { register, status, error, data };
}
