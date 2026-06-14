import { Suspense } from "react";
import { EditProfileForm } from "@/features/profile";

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div className="profile-state">Cargando perfil...</div>}>
      <EditProfileForm />
    </Suspense>
  );
}
