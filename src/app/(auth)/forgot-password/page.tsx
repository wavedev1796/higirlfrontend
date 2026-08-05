import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { BrandLockup } from "@/shared/components/layout/BrandLockup";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-page">
      <nav className="login-nav" style={{ position: "absolute", top: "2rem", left: "2rem" }}>
        <Link href={ROUTES.HOME}>
          <BrandLockup />
        </Link>
      </nav>
      <div className="login-card">
        <Suspense fallback={<div className="route-loading" />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
