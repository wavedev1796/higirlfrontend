import type { UserSummary } from "@/shared/types/user.types";

export type ReportReason =
  | "acoso"
  | "spam"
  | "perfil_falso"
  | "contenido_inapropiado";

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "acoso", label: "Acoso" },
  { value: "spam", label: "Spam" },
  { value: "perfil_falso", label: "Perfil falso" },
  { value: "contenido_inapropiado", label: "Contenido inapropiado" },
];

export type BlockedUser = UserSummary;
