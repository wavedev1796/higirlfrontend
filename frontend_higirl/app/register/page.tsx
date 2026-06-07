"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterState = "idle" | "loading" | "success" | "error";

type RegisterResponse = {
  mensaje?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

function FieldIcon({ name }: { name: "user" | "mail" | "lock" }) {
  const paths = {
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    mail: (
      <>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {paths[name]}
      </g>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<RegisterState>("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      firstName.trim().length >= 2 &&
      lastName.trim().length >= 2 &&
      email.trim().length > 0 &&
      password.length >= 8 &&
      confirmPassword.length >= 8 &&
      status !== "loading",
    [confirmPassword, email, firstName, lastName, password, status],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Las contrasenas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as RegisterResponse;

      if (!response.ok) {
        throw new Error(data.mensaje ?? "No pudimos crear la cuenta.");
      }

      setStatus("success");
      setMessage(data.mensaje ?? "Cuenta creada exitosamente.");
      router.push("/");
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
    <main className="register-page">
      <nav className="login-nav register-nav" aria-label="Hi Girl">
          <div className="brand-lockup">
            <span className="logo-mark" aria-hidden="true">
              <span />
            </span>
            <span>Hi Girl</span>
          </div>
          <Link href="/">Login</Link>
      </nav>

      <section className="register-center" aria-label="Formulario de registro">
        <div className="login-card register-card">
          <div className="form-heading">
            <p className="eyebrow">Nueva cuenta</p>
            <h2>Registrate</h2>
            <p>Al crear tu cuenta volveras al login para iniciar sesion.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field-grid">
              <label>
                Nombre
                <span className="input-with-icon">
                  <FieldIcon name="user" />
                  <input
                    autoComplete="given-name"
                    name="firstName"
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Magaly"
                    type="text"
                    value={firstName}
                  />
                </span>
              </label>

              <label>
                Apellido
                <span className="input-with-icon">
                  <FieldIcon name="user" />
                  <input
                    autoComplete="family-name"
                    name="lastName"
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Vinueza"
                    type="text"
                    value={lastName}
                  />
                </span>
              </label>
            </div>

            <label>
              Correo electronico
              <span className="input-with-icon">
                <FieldIcon name="mail" />
                <input
                  autoComplete="email"
                  inputMode="email"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="tu@email.com"
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <div className="field-grid">
              <label>
                Contrasena
                <span className="input-with-icon">
                  <FieldIcon name="lock" />
                  <input
                    autoComplete="new-password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimo 8 caracteres"
                    type="password"
                    value={password}
                  />
                </span>
              </label>

              <label>
                Confirmar contrasena
                <span className="input-with-icon">
                  <FieldIcon name="lock" />
                  <input
                    autoComplete="new-password"
                    name="confirmPassword"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repite tu contrasena"
                    type="password"
                    value={confirmPassword}
                  />
                </span>
              </label>
            </div>

            <button className="primary-button" disabled={!canSubmit} type="submit">
              {status === "loading" ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {message ? (
              <div className={`status-message ${status}`} role="status">
                <strong>{status === "success" ? "Listo" : "Atencion"}</strong>
                <span>{message}</span>
              </div>
            ) : null}
          </form>

          <p className="signup-note">
            Ya tienes cuenta? <Link href="/">Iniciar sesion</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
