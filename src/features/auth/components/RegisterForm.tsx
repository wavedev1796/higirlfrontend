/**
 * Auth feature — RegisterForm component.
 *
 * Handles registration form state and submission.
 * Icons are now imported from shared/components/icons.
 */

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/useRegister";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../providers/AuthProvider";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { FieldIcon } from "@/shared/components/icons/FieldIcon";
import { ROUTES } from "@/shared/constants/routes";

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
  const { login } = useLogin();
  const authStore = useAuthStore();

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
      const session = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!session.token) {
        router.replace(
          `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(`${ROUTES.PROFILE_EDIT}?onboarding=1`)}`,
        );
        return;
      }

      authStore.login(
        {
          id: session.usuario ?? "",
          email: session.email ?? formData.email.trim(),
          firstName: session.nombre ?? formData.firstName.trim(),
          lastName: session.apellido ?? formData.lastName.trim(),
          rol: (session.rol as "user" | "admin") ?? "user",
        },
        session.token,
      );
      router.replace(`${ROUTES.PROFILE_EDIT}?onboarding=1`);
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
        label="Correo electrónico"
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
        ¿Ya tienes cuenta? <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
      </p>
    </form>
  );
}
