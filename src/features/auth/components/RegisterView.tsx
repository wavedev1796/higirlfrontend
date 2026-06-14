/**
 * Auth feature — RegisterView.
 *
 * Full-page composition: brand nav + register form.
 * The `(auth)/register/page.tsx` is a thin wrapper around this.
 */

import Link from "next/link";
import { RegisterForm } from "./RegisterForm";
import { BrandLockup } from "@/shared/components/layout/BrandLockup";
import { ROUTES } from "@/shared/constants/routes";

export function RegisterView() {
  return (
    <main className="register-page">
      <nav className="login-nav register-nav" aria-label="Hi Girl">
        <BrandLockup />
        <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
      </nav>

      <section className="register-center" aria-label="Formulario de registro">
        <div className="login-card register-card">
          <div className="form-heading">
            <p className="eyebrow">Nueva cuenta</p>
            <h2>Regístrate</h2>
            <p>Al crear tu cuenta volverás al inicio de sesión.</p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
