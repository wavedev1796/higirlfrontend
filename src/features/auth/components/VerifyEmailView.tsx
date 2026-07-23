"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";
import { authService } from "../services/auth.service";

type Status = "loading" | "success" | "error";

export function VerifyEmailView({ token }: { token?: string }) {
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Falta el token de activación en el enlace.",
  );
  const done = useRef(false);

  useEffect(() => {
    if (!token || done.current) return;
    done.current = true;
    authService
      .verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.mensaje);
      })
      .catch((err: unknown) => {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "No pudimos activar tu cuenta.",
        );
      });
  }, [token]);

  return (
    <div className="verify-notice" role="status">
      {status === "loading" && <p>Activando tu cuenta…</p>}
      {status === "success" && (
        <>
          <h2>¡Cuenta activada!</h2>
          <p>{message}</p>
          <Link href={ROUTES.LOGIN} className="btn btn-secondary">Iniciar sesión</Link>
        </>
      )}
      {status === "error" && (
        <>
          <h2>No se pudo activar</h2>
          <p>{message}</p>
          <Link href={ROUTES.LOGIN} className="btn btn-secondary">Ir a iniciar sesión</Link>
        </>
      )}
    </div>
  );
}
