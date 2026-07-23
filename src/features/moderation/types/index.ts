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

export interface BlockedUser {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  foto?: string | null;
}
