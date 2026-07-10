/**
 * Auth feature — LoginForm component.
 *
 * Handles form state and submission. Integrates with the auth store
 * for global session management.
 */

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../providers/AuthProvider";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { ROUTES } from "@/shared/constants/routes";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, status, error, data: profile } = useLogin();
  const authStore = useAuthStore();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;

    try {
      const response = await login({ email: email.trim(), password });

      if (response?.token) {
        const interestsCount = (response.intereses ?? []).length;
        authStore.login(
          {
            id: response.id ?? "",
            email: response.email ?? email.trim(),
            firstName: response.nombre ?? "",
            lastName: response.apellido ?? "",
            rol: (response.rol as "user" | "admin") ?? "user",
            interestsCount,
          },
          response.token,
        );

        // First-time login: send to onboarding (interests → profile)
        if (interestsCount === 0) {
          router.replace(`${ROUTES.INTERESTS}?onboarding=1`);
          return;
        }

        const callbackUrl = searchParams.get("callbackUrl");
        router.replace(
          callbackUrl?.startsWith("/") ? callbackUrl : ROUTES.DASHBOARD,
        );
      }
    } catch {
      // Error handled by hook
    }
  }

  return (
    <form id="login-form" className="login-form" onSubmit={handleSubmit}>
      <Input
        label="Correo electrónico"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        inputMode="email"
        required
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      <div className="form-options">
        <label className="remember-option">
          <input type="checkbox" />
          Recordarme
        </label>
        <Link href={ROUTES.FORGOT_PASSWORD}>Olvidé mi contraseña</Link>
      </div>

      <Button type="submit" isLoading={status === "loading"}>
        Iniciar sesión
      </Button>

      <Button 
        type="button" 
        variant="secondary"
        icon={
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        }
      >
        Continuar con Google
      </Button>

      {error && (
        <div className="status-message error" role="status">
          <strong>Atención</strong>
          <span>{error}</span>
        </div>
      )}

      {profile && !error && (
        <div className="session-preview">
          <span>Sesión activa</span>
          <strong>
            {profile.nombre} {profile.apellido}
          </strong>
          <small>{profile.email}</small>
        </div>
      )}

      <p className="signup-note">
        Todavía no tienes cuenta? <Link href={ROUTES.REGISTER}>Crear cuenta</Link>
      </p>
    </form>
  );
}
