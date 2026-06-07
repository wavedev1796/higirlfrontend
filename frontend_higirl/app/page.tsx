"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type LoginState = "idle" | "loading" | "success" | "error";

type LoginResponse = {
  message?: string | string[];
  mensaje?: string;
  token?: string;
  usuario?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

function getResponseMessage(data: LoginResponse, fallback: string) {
  if (Array.isArray(data.message)) {
    return data.message.join(" ");
  }

  return data.mensaje ?? data.message ?? fallback;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginState>("idle");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<LoginResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setProfile(null);

    if (!email.trim() || !password) {
      setStatus("error");
      setMessage("Ingresa tu correo y contrasena para iniciar sesion.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as LoginResponse;

      if (!response.ok) {
        throw new Error(getResponseMessage(data, "No pudimos iniciar sesion con esos datos."));
      }

      if (data.token) {
        localStorage.setItem("higirl_token", data.token);
      }

      setProfile(data);
      setMessage(getResponseMessage(data, "Login correcto"));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el backend. Revisa que la API este activa.",
      );
    }
  }

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="Bienvenida a Hi Girl">
        <nav className="login-nav" aria-label="Hi Girl">
          <div className="brand-lockup">
            <span className="logo-mark" aria-hidden="true">
              <span />
            </span>
            <span>Hi Girl</span>
          </div>
          <a href="#login-form">Entrar</a>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">A safe space to be you.</p>
          <h1>Conecta con mujeres que comparten tu estilo de vida.</h1>
          <p>
            Encuentra amistades, redes de apoyo y oportunidades reales en una
            comunidad pensada para crecer juntas.
          </p>
        </div>

        <div className="community-preview" aria-label="Vista previa de comunidad">
          <div className="preview-card profile-card">
            <div className="avatar-stack" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <strong>95% compatible</strong>
              <p>Mujeres Tech Ecuador</p>
            </div>
          </div>

          <div className="preview-card message-card">
            <span aria-hidden="true">Hi</span>
            <p>Tu proxima conexion puede empezar hoy.</p>
          </div>
        </div>
      </section>

      <section className="login-panel" aria-label="Inicio de sesion">
        <div className="login-card">
          <div className="form-heading">
            <p className="eyebrow">Bienvenida de vuelta</p>
            <h2>Inicia sesion</h2>
            <p>Accede con tu correo para continuar en Hi Girl.</p>
          </div>

          <form id="login-form" className="login-form" onSubmit={handleSubmit}>
            <label>
              Correo electronico
              <input
                autoComplete="email"
                inputMode="email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                type="email"
                value={email}
              />
            </label>

            <label>
              Contrasena
              <input
                autoComplete="current-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contrasena"
                type="password"
                value={password}
              />
            </label>

            <div className="form-options">
              <label className="remember-option">
                <input type="checkbox" />
                Recordarme
              </label>
              <a href="#recuperar">Olvide mi contrasena</a>
            </div>

            <button className="primary-button" disabled={status === "loading"} type="submit">
              {status === "loading" ? "Conectando..." : "Iniciar sesion"}
            </button>

            <button className="secondary-button" type="button">
              Continuar con Google
            </button>

            {message ? (
              <div className={`status-message ${status}`} role="status">
                <strong>{status === "success" ? "Listo" : "Atencion"}</strong>
                <span>{message}</span>
              </div>
            ) : null}

            {profile ? (
              <div className="session-preview">
                <span>Sesion activa</span>
                <strong>
                  {profile.nombre} {profile.apellido}
                </strong>
                <small>{profile.email}</small>
              </div>
            ) : null}
          </form>

          <p className="signup-note">
            Todavia no tienes cuenta? <Link href="/register">Crear cuenta</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
