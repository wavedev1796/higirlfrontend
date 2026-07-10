export type NotificationType = "nueva_conexion" | "conexion_aceptada";

export interface NotificationPayload {
  conexionId: number;
  actorId: number;
  actorNombre: string;
}

export interface Notification {
  id: number;
  usuarioId: number;
  tipo: NotificationType;
  leido: boolean;
  payload: NotificationPayload | null;
  createdAt: string;
}
