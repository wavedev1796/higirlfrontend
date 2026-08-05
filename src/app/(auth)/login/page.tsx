/**
 * Login page — thin wrapper around LoginView.
 */

import { Suspense } from "react";
import { LoginView } from "@/features/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="route-loading">Cargando...</main>}>
      <LoginView />
    </Suspense>
  );
}
