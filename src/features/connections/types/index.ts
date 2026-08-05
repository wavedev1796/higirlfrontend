import type { UserSummary } from "@/shared/types/user.types";

export type ConnectionStatus = "pendiente" | "aceptada" | "rechazada";

export interface ConnectionUser extends UserSummary {
  bio?: string | null;
  profesion?: string | null;
}

export interface Connection {
  id: number;
  origenId: number;
  origen: ConnectionUser;
  destinoId: number;
  destino: ConnectionUser;
  estado: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}
