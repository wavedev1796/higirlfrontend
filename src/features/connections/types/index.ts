export type ConnectionStatus = "pendiente" | "aceptada" | "rechazada";

export interface ConnectionUser {
  id: number;
  nombre: string;
  apellido: string;
  usuario: string;
  foto?: string | null;
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
