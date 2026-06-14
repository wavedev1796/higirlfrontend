"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/features/auth";
import { profileService } from "../services/profile.service";
import type {
  CivilStatus,
  Profile,
  UpdateProfileRequest,
} from "../types";
import { ProfileAvatar } from "./ProfileAvatar";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FormState {
  ciudad: string;
  fechaNacimiento: string;
  profesion: string;
  empresa: string;
  estadoCivil: CivilStatus | "";
  tieneHijos: boolean;
  numeroHijos: number;
  bio: string;
}

function toFormState(profile: Profile): FormState {
  return {
    ciudad: profile.ciudad ?? "",
    fechaNacimiento: profile.fechaNacimiento ?? "",
    profesion: profile.profesion ?? "",
    empresa: profile.empresa ?? "",
    estadoCivil: profile.estadoCivil ?? "",
    tieneHijos: profile.tieneHijos,
    numeroHijos: profile.numeroHijos,
    bio: profile.bio ?? "",
  };
}

export function EditProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuthStore();
  const isOnboarding = searchParams.get("onboarding") === "1";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService
      .getMe()
      .then((data) => {
        setProfile(data);
        setForm(toFormState(data));
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No pudimos cargar tu perfil.",
        );
      });
  }, []);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type)) {
      setError("La foto debe ser JPEG, PNG o WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setError("La foto no puede superar los 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }

  async function handleDeletePhoto() {
    if (!profile?.foto && !previewUrl) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setPhotoFile(null);
    }

    if (profile?.foto) {
      try {
        await profileService.deletePhoto();
        setProfile({ ...profile, foto: null });
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "No pudimos eliminar la foto.",
        );
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    setStatus("saving");
    setError(null);

    const payload: UpdateProfileRequest = {
      ciudad: form.ciudad.trim(),
      fechaNacimiento: form.fechaNacimiento || undefined,
      profesion: form.profesion.trim(),
      empresa: form.empresa.trim(),
      estadoCivil: form.estadoCivil || undefined,
      tieneHijos: form.tieneHijos,
      numeroHijos: form.tieneHijos ? form.numeroHijos : 0,
      bio: form.bio.trim(),
    };

    try {
      await profileService.updateMe(payload);
      if (photoFile) {
        await profileService.uploadPhoto(photoFile);
      }
      await refreshUser();
      router.replace(ROUTES.PROFILE);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No pudimos guardar los cambios.",
      );
      setStatus("idle");
    }
  }

  if (error && !form) {
    return <div className="profile-state profile-error">{error}</div>;
  }

  if (!profile || !form) {
    return <div className="profile-state">Cargando tu perfil...</div>;
  }

  const fullName = `${profile.nombre} ${profile.apellido}`.trim();

  return (
    <section className="profile-page edit-profile-page">
      {isOnboarding && (
        <div className="onboarding-banner">
          <span>Paso final</span>
          <div>
            <strong>Haz que tu perfil hable de ti</strong>
            <p>
              Tu cuenta ya está lista. Completa estos datos para presentarte a
              la comunidad.
            </p>
          </div>
        </div>
      )}

      <div className="profile-hero">
        <div className="profile-hero-copy">
          <p className="eyebrow">
            {isOnboarding ? "Bienvenida a Hi Girl" : "Tu información"}
          </p>
          <h1>{isOnboarding ? "Completa tu perfil" : "Editar perfil"}</h1>
          <p>
            Puedes actualizar estos datos cuando quieras. Tu correo y nombre
            de cuenta permanecen protegidos.
          </p>
        </div>
      </div>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <aside className="photo-editor">
          <ProfileAvatar
            name={fullName}
            photo={profile.foto}
            previewUrl={previewUrl}
          />
          <div>
            <h2>{fullName}</h2>
            <p>@{profile.usuario}</p>
          </div>
          <label className="photo-input">
            Elegir foto
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhoto}
            />
          </label>
          <small>JPEG, PNG o WebP. Máximo 5 MB.</small>
          {(profile.foto || previewUrl) && (
            <button
              className="photo-delete"
              type="button"
              onClick={handleDeletePhoto}
            >
              Eliminar foto
            </button>
          )}
        </aside>

        <div className="profile-fields">
          <div className="readonly-fields">
            <label>
              Nombre
              <input value={fullName} disabled />
            </label>
            <label>
              Correo electrónico
              <input value={profile.email} disabled />
            </label>
          </div>

          <div className="profile-form-grid">
            <label>
              Ciudad
              <input
                value={form.ciudad}
                maxLength={100}
                onChange={(event) => updateField("ciudad", event.target.value)}
                placeholder="Ej. Quito"
              />
            </label>
            <label>
              Fecha de nacimiento
              <input
                type="date"
                value={form.fechaNacimiento}
                onChange={(event) =>
                  updateField("fechaNacimiento", event.target.value)
                }
              />
            </label>
            <label>
              Profesión
              <input
                value={form.profesion}
                maxLength={100}
                onChange={(event) =>
                  updateField("profesion", event.target.value)
                }
                placeholder="Ej. Diseñadora"
              />
            </label>
            <label>
              Empresa
              <input
                value={form.empresa}
                maxLength={100}
                onChange={(event) => updateField("empresa", event.target.value)}
                placeholder="Ej. Estudio independiente"
              />
            </label>
            <label>
              Estado civil
              <select
                value={form.estadoCivil}
                onChange={(event) =>
                  updateField(
                    "estadoCivil",
                    event.target.value as CivilStatus | "",
                  )
                }
              >
                <option value="">Selecciona una opción</option>
                <option value="soltera">Soltera</option>
                <option value="casada">Casada</option>
                <option value="union_libre">Unión libre</option>
                <option value="divorciada">Divorciada</option>
                <option value="viuda">Viuda</option>
              </select>
            </label>
            <label>
              Número de hijos
              <input
                type="number"
                min={0}
                max={20}
                disabled={!form.tieneHijos}
                value={form.tieneHijos ? form.numeroHijos : 0}
                onChange={(event) =>
                  updateField("numeroHijos", Number(event.target.value))
                }
              />
            </label>
          </div>

          <label className="children-toggle">
            <input
              type="checkbox"
              checked={form.tieneHijos}
              onChange={(event) =>
                updateField("tieneHijos", event.target.checked)
              }
            />
            Tengo hijos
          </label>

          <label className="bio-field">
            Biografía
            <textarea
              value={form.bio}
              maxLength={1000}
              rows={6}
              onChange={(event) => updateField("bio", event.target.value)}
              placeholder="Cuéntanos qué te inspira, qué estás construyendo o qué conexiones buscas."
            />
            <span>{form.bio.length}/1000</span>
          </label>

          {error && (
            <div className="status-message" role="alert">
              <strong>No pudimos guardar</strong>
              <span>{error}</span>
            </div>
          )}

          <div className="profile-form-actions">
            {!isOnboarding && (
              <Link href={ROUTES.PROFILE}>Cancelar</Link>
            )}
            <Button type="submit" isLoading={status === "saving"}>
              {isOnboarding ? "Completar perfil" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
