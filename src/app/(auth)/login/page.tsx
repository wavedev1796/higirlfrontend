import { LoginForm } from "../../../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="Bienvenida a Hi Girl">
        <nav className="login-nav" aria-label="Hi Girl">
          <div className="brand-lockup">
            <span className="logo-mark" aria-hidden="true">
              <span />
            </span>
            <span>Hi Girl</span>
          </div>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">A safe space to be you.</p>
          <h1>Conecta con mujeres que comparten tu estilo de vida.</h1>
          <p>
            Encuentra amistades, redes de apoyo y oportunidades reales en una
            comunidad pensada para crecer juntas.
          </p>
        </div>

        <div className="community-preview" aria-label="Vista previa de comunidad">
          <div className="preview-card profile-card">
            <div className="avatar-stack" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <strong>95% compatible</strong>
              <p>Mujeres Tech Ecuador</p>
            </div>
          </div>

          <div className="preview-card message-card">
            <span aria-hidden="true">Hi</span>
            <p>Tu proxima conexión puede empezar hoy.</p>
          </div>
        </div>
      </section>

      <section className="login-panel" aria-label="Inicio de sesion">
        <div className="login-card">
          <div className="form-heading">
            <p className="eyebrow">Bienvenida de vuelta</p>
            <h2>Inicia sesión</h2>
            <p>Accede con tu correo para continuar en Hi Girl.</p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
