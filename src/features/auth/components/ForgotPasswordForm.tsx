"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { ROUTES } from "@/shared/constants/routes";
import { authService } from "../services/auth.service";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      await authService.forgotPassword(email.trim());
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el correo.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="auth-success-state">
        <h2>Correo enviado</h2>
        <p>
          Si el correo {email} está registrado, recibirás un enlace para
          restablecer tu contraseña en unos minutos.
        </p>
        <Link href={ROUTES.LOGIN} className="back-link">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <header className="form-header">
        <h1>Recuperar contraseña</h1>
        <p>Ingresa tu correo para recibir un enlace de recuperación.</p>
      </header>

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Button type="submit" isLoading={status === "loading"}>
        Enviar enlace
      </Button>

      {error && (
        <div className="status-message error">
          <span>{error}</span>
        </div>
      )}

      <p className="signup-note">
        ¿Te acordaste? <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
      </p>
    </form>
  );
}
