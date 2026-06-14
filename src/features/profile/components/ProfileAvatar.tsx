import { getProfilePhotoUrl } from "../services/profile.service";

interface ProfileAvatarProps {
  name: string;
  photo?: string | null;
  previewUrl?: string | null;
  className?: string;
}

export function ProfileAvatar({
  name,
  photo,
  previewUrl,
  className = "",
}: ProfileAvatarProps) {
  const imageUrl = previewUrl ?? getProfilePhotoUrl(photo);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`profile-avatar ${className}`}
      style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
      role="img"
      aria-label={`Foto de ${name}`}
    >
      {!imageUrl && <span>{initials || "HG"}</span>}
    </div>
  );
}
