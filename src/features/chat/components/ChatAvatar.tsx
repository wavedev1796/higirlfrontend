import Image from "next/image";
import { getProfilePhotoUrl } from "@/features/profile";
import type { ChatParticipant } from "../types";

export function ChatAvatar({ person }: { person: ChatParticipant }) {
  const photo = getProfilePhotoUrl(person.foto);
  const initials = `${person.nombre.charAt(0)}${person.apellido.charAt(0)}`.toUpperCase();

  return (
    <span className="chat-avatar" aria-hidden="true">
      {photo ? (
        <Image src={photo} alt="" width={52} height={52} unoptimized />
      ) : initials}
    </span>
  );
}
