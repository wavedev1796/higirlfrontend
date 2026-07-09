import Image from "next/image";
import { getProfilePhotoUrl } from "@/features/profile";
import type { ConnectionUser } from "../types";

export function ConnectionAvatar({ user }: { user: ConnectionUser }) {
  const photoUrl = getProfilePhotoUrl(user.foto);
  const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();

  return (
    <span className="connection-avatar" aria-hidden="true">
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          width={64}
          height={64}
          unoptimized
        />
      ) : (
        initials
      )}
    </span>
  );
}
