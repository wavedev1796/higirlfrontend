/**
 * Auth feature — useRegisterValidation hook.
 *
 * Centralizes all client-side validation rules for the registration form.
 * Returns an `errors` object with a per-field error string (empty = valid).
 */

"use client";

import { useCallback, useState } from "react";

export interface RegisterFormFields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fechaNacimiento: string;
  ciudadId: string; // stored as string from <select>, parsed to number on submit
}

export type RegisterErrors = Partial<Record<keyof RegisterFormFields, string>>;

/* ── Individual field validators ──────────────────────────────────────── */

const LETTERS_ONLY = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_UPPER = /[A-Z]/;
const HAS_LOWER = /[a-z]/;
const HAS_DIGIT = /\d/;

function validateFirstName(v: string): string {
  if (!v.trim()) return "El nombre es obligatorio";
  if (v.trim().length < 2) return "Mínimo 2 caracteres";
  if (v.trim().length > 50) return "Máximo 50 caracteres";
  if (!LETTERS_ONLY.test(v.trim())) return "Solo letras y espacios";
  return "";
}

function validateLastName(v: string): string {
  if (!v.trim()) return "El apellido es obligatorio";
  if (v.trim().length < 2) return "Mínimo 2 caracteres";
  if (v.trim().length > 50) return "Máximo 50 caracteres";
  if (!LETTERS_ONLY.test(v.trim())) return "Solo letras y espacios";
  return "";
}

function validateEmail(v: string): string {
  if (!v.trim()) return "El correo es obligatorio";
  if (!EMAIL_RE.test(v.trim())) return "Formato de correo inválido";
  return "";
}

function validatePassword(v: string): string {
  if (!v) return "La contraseña es obligatoria";
  if (v.length < 8) return "Mínimo 8 caracteres";
  if (!HAS_UPPER.test(v)) return "Debe incluir al menos 1 mayúscula";
  if (!HAS_LOWER.test(v)) return "Debe incluir al menos 1 minúscula";
  if (!HAS_DIGIT.test(v)) return "Debe incluir al menos 1 número";
  return "";
}

function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm) return "Confirma tu contraseña";
  if (password !== confirm) return "Las contraseñas no coinciden";
  return "";
}

function validateFechaNacimiento(v: string): string {
  if (!v) return "La fecha de nacimiento es obligatoria";
  const nac = new Date(v);
  if (isNaN(nac.getTime())) return "Fecha inválida";
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const yaCumplio =
    hoy >= new Date(hoy.getFullYear(), nac.getMonth(), nac.getDate());
  if (!yaCumplio) edad--;
  if (edad < 18) return "Debes tener al menos 18 años";
  return "";
}

function validateCiudad(v: string): string {
  if (!v || v === "") return "La ciudad es obligatoria";
  return "";
}

/* ── Validators map ───────────────────────────────────────────────────── */

type FieldValidator = (value: string, fields?: RegisterFormFields) => string;

const validators: Record<keyof RegisterFormFields, FieldValidator> = {
  firstName: (v) => validateFirstName(v),
  lastName: (v) => validateLastName(v),
  email: (v) => validateEmail(v),
  password: (v) => validatePassword(v),
  confirmPassword: (v, fields) =>
    validateConfirmPassword(fields?.password ?? "", v),
  fechaNacimiento: (v) => validateFechaNacimiento(v),
  ciudadId: (v) => validateCiudad(v),
};

/* ── Hook ─────────────────────────────────────────────────────────────── */

export function useRegisterValidation() {
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormFields, boolean>>>({});

  /** Validate a single field and update errors state. */
  const validateField = useCallback(
    (name: keyof RegisterFormFields, value: string, fields?: RegisterFormFields) => {
      const error = validators[name](value, fields);
      setErrors((prev) => ({ ...prev, [name]: error }));
      return error;
    },
    [],
  );

  /** Mark a field as touched (triggers error display). */
  const touchField = useCallback((name: keyof RegisterFormFields) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  /** Validate all fields at once (used on submit). Returns true if form is valid. */
  const validateAll = useCallback((fields: RegisterFormFields): boolean => {
    const newErrors: RegisterErrors = {};
    let valid = true;

    (Object.keys(validators) as Array<keyof RegisterFormFields>).forEach(
      (key) => {
        const error = validators[key](fields[key], fields);
        newErrors[key] = error;
        if (error) valid = false;
      },
    );

    setErrors(newErrors);
    // Mark everything as touched so all errors show
    const allTouched = Object.fromEntries(
      Object.keys(validators).map((k) => [k, true]),
    ) as Record<keyof RegisterFormFields, boolean>;
    setTouched(allTouched);

    return valid;
  }, []);

  /** Returns the error for a field only if it has been touched. */
  const getFieldError = useCallback(
    (name: keyof RegisterFormFields): string | undefined => {
      return touched[name] ? errors[name] : undefined;
    },
    [errors, touched],
  );

  return { errors, touched, validateField, touchField, validateAll, getFieldError };
}
