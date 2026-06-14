"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLockup } from "@/shared/components/layout/BrandLockup";
import { ROUTES } from "@/shared/constants/routes";
import { ProtectedRoute, useAuthStore } from "@/features/auth";

const NAV_LINKS = [
  { href: ROUTES.DASHBOARD, label: "Inicio" },
  { href: ROUTES.PROFILE, label: "Mi Perfil" },
  { href: ROUTES.SETTINGS, label: "Ajustes" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
            <nav>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? "nav-active" : ""}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="dashboard-user">
              <span>{user?.firstName || "Girl"}</span>
              <button type="button" onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="dashboard-main">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
