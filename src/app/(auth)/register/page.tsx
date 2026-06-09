import Link from "next/link";
import { RegisterForm } from "../../../features/auth/components/RegisterForm";
import { ROUTES } from "../../../constants/routes";

export default function RegisterPage() {
  return (
    <main className="register-page">
      <nav className="login-nav register-nav" aria-label="Hi Girl">
          <div className="brand-lockup">
            <span className="logo-mark" aria-hidden="true">
              <span />
            </span>
            <span>Hi Girl</span>
          </div>
          <Link href={ROUTES.LOGIN}>Login</Link>
      </nav>

      <section className="register-center" aria-label="Formulario de registro">
        <div className="login-card register-card">
          <div className="form-heading">
            <p className="eyebrow">Nueva cuenta</p>
            <h2>Registrate</h2>
            <p>Al crear tu cuenta volveras al login para iniciar sesion.</p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
