"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../../../store/authStore";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ROUTES } from "../../../constants/routes";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, status, error, data: profile } = useLogin();
  const authStore = useAuthStore();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password) return;

    try {
      const response = await login({ email: email.trim(), password });

      // Integrar con el auth store global
      if (response && response.token) {
        authStore.login(
          {
            id: response.usuario ?? "",
            email: response.email ?? email.trim(),
            firstName: response.nombre ?? "",
            lastName: response.apellido ?? "",
            rol: response.rol ?? "user",
          },
          response.token,
        );

        // Redirigir al dashboard
        router.push(ROUTES.DASHBOARD);
      }
    } catch {
      // Error handled by hook
    }
  }

  return (
    <form id="login-form" className="login-form" onSubmit={handleSubmit}>
      <Input
        label="Correo electronico"
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
        <a href="#recuperar">Olvide mi contraseña</a>
      </div>

      <Button type="submit" isLoading={status === "loading"}>
        Iniciar sesión
      </Button>

      <Button type="button" variant="secondary">
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

