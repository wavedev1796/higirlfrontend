import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
