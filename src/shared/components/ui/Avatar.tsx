import Image from "next/image";
import { getProfilePhotoUrl } from "@/features/profile";
import type { UserSummary } from "@/shared/types/user.types";

interface AvatarProps {
  person: UserSummary;
  /** Clase que aporta forma y tamaño visual (ej. "chat-avatar"). */
  className: string;
  /** Lado en px de la imagen; debe coincidir con el tamaño que fija la clase. */
  size: number;
}

/**
 * Foto de la usuaria, o sus iniciales si no tiene.
 *
 * Reemplaza a ChatAvatar y ConnectionAvatar, que eran el mismo componente con
 * distinta clase CSS y tamaño. ProfileAvatar NO se unificó aquí: pinta la foto
 * como background-image y admite previsualización de subida, es otro caso.
 */
export function Avatar({ person, className, size }: AvatarProps) {
  const photo = getProfilePhotoUrl(person.foto);
  const initials =
    `${person.nombre.charAt(0)}${person.apellido.charAt(0)}`.toUpperCase();

  return (
    <span className={className} aria-hidden="true">
      {photo ? (
        <Image src={photo} alt="" width={size} height={size} unoptimized />
      ) : (
        initials
      )}
    </span>
  );
}
