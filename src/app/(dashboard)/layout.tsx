"use client";

import { useState, useEffect, ViewTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, User, Settings, UsersRound } from "lucide-react";
import { BrandLockup } from "@/shared/components/layout/BrandLockup";
import { ROUTES } from "@/shared/constants/routes";
import { ProtectedRoute, useAuthStore } from "@/features/auth";
import { NotificationBell } from "@/features/notifications";

const NAV_LINKS = [
  { href: ROUTES.DASHBOARD, label: "Inicio", Icon: Home },
  { href: ROUTES.DISCOVER, label: "Descubrir", Icon: Compass },
  { href: ROUTES.REQUESTS, label: "Conexiones", Icon: UsersRound },
  { href: ROUTES.PROFILE, label: "Mi Perfil", Icon: User },
  { href: ROUTES.SETTINGS, label: "Ajustes", Icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLogout() {
    logout();
    router.replace(ROUTES.LOGIN);
  }

  function isNavActive(href: string) {
    if (href === ROUTES.REQUESTS) {
      return pathname === ROUTES.REQUESTS || pathname === ROUTES.CONNECTIONS;
    }
    return pathname === href;
  }

  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <header
          className={`dashboard-header ${isScrolled ? "scrolled" : ""}`}
          style={{ viewTransitionName: "dashboard-header" }}
        >
          <div className="dashboard-nav">
            <Link href={ROUTES.DASHBOARD} aria-label="Ir al inicio">
              <BrandLockup />
            </Link>
            <nav aria-label="Navegación principal">
              {NAV_LINKS.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={isNavActive(href) ? "nav-active" : ""}
                >
                  <Icon size={15} aria-hidden />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="dashboard-user">
              <NotificationBell />
              <span>{user?.firstName || "Girl"}</span>
              <button type="button" onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <ViewTransition enter="page-enter" default="none">
            {children}
          </ViewTransition>
        </main>

        <nav className="bottom-nav" aria-label="Navegación móvil">
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`bottom-nav-link${isNavActive(href) ? " nav-active" : ""}`}
            >
              <Icon size={20} aria-hidden />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </ProtectedRoute>
  );
}
