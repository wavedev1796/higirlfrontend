"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Calendar, MapPin } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { useCities } from "../hooks/useCities";
import {
  useRegisterValidation,
  type RegisterFormFields,
} from "../hooks/useRegisterValidation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { ROUTES } from "@/shared/constants/routes";

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormFields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    fechaNacimiento: "",
    ciudadId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const { register, status, error } = useRegister();
  const { cities, loading: citiesLoading } = useCities();

  const { validateField, touchField, validateAll, getFieldError } =
    useRegisterValidation();

  /* ── Handlers ─────────────────────────────────────────────────────── */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate on change only if already touched
    validateField(
      name as keyof RegisterFormFields,
      value,
      { ...formData, [name]: value },
    );
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    touchField(name as keyof RegisterFormFields);
    validateField(name as keyof RegisterFormFields, value, formData);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = validateAll(formData);
    if (!isValid) return;

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        ciudadId: Number(formData.ciudadId),
        fechaNacimiento: formData.fechaNacimiento,
      });
      setSentTo(formData.email.trim());
    } catch {
      // Error mostrado por el hook (banner de error abajo)
    }
  }

  /* ── Max date for date picker (must be ≥18 years old) ─────────────── */
  const maxDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
  })();

  /* ── Render ────────────────────────────────────────────────────────── */

  if (sentTo) {
    return (
      <div className="verify-notice" role="status">
        <h2>Revisa tu correo</h2>
        <p>
          Te hemos enviado la activación de cuenta al correo: <strong>{sentTo}</strong>.
        </p>
        <p>Haz click en el enlace del correo para activar tu cuenta y luego inicia sesión.</p>
        <Link href={ROUTES.LOGIN} className="btn btn-secondary">Ir a iniciar sesión</Link>
      </div>
    );
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {/* Name row */}
      <div className="field-grid">
        <Input
          id="reg-firstName"
          label="Nombre"
          name="firstName"
          placeholder="Magaly"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          icon={<User size={20} aria-hidden />}
          error={getFieldError("firstName")}
          autoComplete="given-name"
        />
        <Input
          id="reg-lastName"
          label="Apellido"
          name="lastName"
          placeholder="Vinueza"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          icon={<User size={20} aria-hidden />}
          error={getFieldError("lastName")}
          autoComplete="family-name"
        />
      </div>

      {/* Email */}
      <Input
        id="reg-email"
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="tu@email.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        icon={<Mail size={20} aria-hidden />}
        error={getFieldError("email")}
        autoComplete="email"
      />

      {/* Password row */}
      <div className="field-grid">
        <Input
          id="reg-password"
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          icon={<Lock size={20} aria-hidden />}
          error={getFieldError("password")}
          autoComplete="new-password"
          trailingAction={
            <button
              type="button"
              className="input-eye-btn"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
          }
        />
        <Input
          id="reg-confirmPassword"
          label="Confirmar contraseña"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Repite tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          icon={<Lock size={20} aria-hidden />}
          error={getFieldError("confirmPassword")}
          autoComplete="new-password"
          trailingAction={
            <button
              type="button"
              className="input-eye-btn"
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
            </button>
          }
        />
      </div>

      {/* Birth date + City row */}
      <div className="field-grid">
        <Input
          id="reg-fechaNacimiento"
          label="Fecha de nacimiento"
          name="fechaNacimiento"
          type="date"
          max={maxDate}
          value={formData.fechaNacimiento}
          onChange={handleChange}
          onBlur={handleBlur}
          icon={<Calendar size={20} aria-hidden />}
          error={getFieldError("fechaNacimiento")}
        />

        {/* City — uses a <select> styled via .login-form select */}
        <label htmlFor="reg-ciudadId">
          Ciudad
          <span className="input-with-icon">
            <MapPin size={20} aria-hidden />
            <select
              id="reg-ciudadId"
              name="ciudadId"
              value={formData.ciudadId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={citiesLoading}
              aria-label="Ciudad"
            >
              <option value="">
                {citiesLoading ? "Cargando…" : "Selecciona tu ciudad"}
              </option>
              {cities.map((city) => (
                <option key={city.id} value={String(city.id)}>
                  {city.nombre}
                </option>
              ))}
            </select>
          </span>
          {getFieldError("ciudadId") && (
            <span className="error-message">{getFieldError("ciudadId")}</span>
          )}
        </label>
      </div>

      <Button type="submit" isLoading={status === "loading"}>
        Crear cuenta
      </Button>

      {error && (
        <div className="status-message error" role="alert">
          <strong>Atención</strong>
          <span>{error}</span>
        </div>
      )}

      <p className="signup-note">
        ¿Ya tienes cuenta? <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
      </p>
    </form>
  );
}
