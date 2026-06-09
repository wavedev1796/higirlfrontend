"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/useRegister";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { ROUTES } from "../../../constants/routes";

function FieldIcon({ name }: { name: "user" | "mail" | "lock" }) {
  const paths = {
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    mail: (
      <>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" width="20" height="20">
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {paths[name]}
      </g>
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register, status, error, data } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      router.push(ROUTES.LOGIN);
    } catch {
      // Error handled by hook
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <Input
          label="Nombre"
          name="firstName"
          placeholder="Magaly"
          value={formData.firstName}
          onChange={handleChange}
          icon={<FieldIcon name="user" />}
          required
        />
        <Input
          label="Apellido"
          name="lastName"
          placeholder="Vinueza"
          value={formData.lastName}
          onChange={handleChange}
          icon={<FieldIcon name="user" />}
          required
        />
      </div>

      <Input
        label="Correo electronico"
        name="email"
        type="email"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        icon={<FieldIcon name="mail" />}
        required
      />

      <div className="field-grid">
        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={formData.password}
          onChange={handleChange}
          icon={<FieldIcon name="lock" />}
          required
        />
        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<FieldIcon name="lock" />}
          required
        />
      </div>

      <Button type="submit" isLoading={status === "loading"}>
        Crear cuenta
      </Button>

      {error && (
        <div className="status-message error" role="status">
          <strong>Atención</strong>
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="status-message success" role="status">
          <strong>Listo</strong>
          <span>Cuenta creada exitosamente.</span>
        </div>
      )}

      <p className="signup-note">
        Ya tienes cuenta? <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
      </p>
    </form>
  );
}
