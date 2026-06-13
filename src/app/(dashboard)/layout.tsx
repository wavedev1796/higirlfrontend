"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLockup } from "@/shared/components/layout/BrandLockup";
import { ROUTES } from "@/shared/constants/routes";
import { ProtectedRoute, useAuthStore } from "@/features/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.replace(ROUTES.LOGIN);
  }

  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <header className="dashboard-header">
          <div className="dashboard-nav">
            <Link href={ROUTES.DASHBOARD} aria-label="Ir al inicio">
              <BrandLockup />
            </Link>
            <nav aria-label="Navegación principal">
              <Link href={ROUTES.DASHBOARD}>Inicio</Link>
              <Link href={ROUTES.PROFILE}>Mi perfil</Link>
              <button type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </nav>
            <span className="dashboard-user">
              Hola, {user?.firstName || "Girl"}
            </span>
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
