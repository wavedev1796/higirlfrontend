"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { ROUTES } from "@/shared/constants/routes";
import { authService } from "../services/auth.service";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("Token de recuperación no válido.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      await authService.resetPassword(password, token);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al restablecer la contraseña.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="auth-success-state">
        <h2>Contraseña restablecida</h2>
        <p>Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión.</p>
        <Link href={ROUTES.LOGIN} className="back-link">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-error-state">
        <h2>Enlace no válido</h2>
        <p>El enlace de recuperación es inválido o ha expirado.</p>
        <Link href={ROUTES.FORGOT_PASSWORD} className="back-link">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <header className="form-header">
        <h1>Nueva contraseña</h1>
        <p>Crea una contraseña segura para tu cuenta.</p>
      </header>

      <Input
        label="Nueva contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="Repite tu nueva contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" isLoading={status === "loading"}>
        Restablecer contraseña
      </Button>

      {error && (
        <div className="status-message error">
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
