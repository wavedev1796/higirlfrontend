"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "../providers/AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="route-loading" aria-live="polite">
        <span className="loading-dot" />
        <p>Preparando tu espacio...</p>
      </main>
    );
  }

  return children;
}
