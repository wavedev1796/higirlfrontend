import type { UserSummary } from "@/shared/types/user.types";

export type ChatParticipant = UserSummary;

export interface Chat {
  id: number;
  conexionId: number;
  participantes: ChatParticipant[];
  createdAt: string;
  updatedAt: string;
}

export type DeliveryStatus = "sending" | "sent" | "error";

export interface ChatMessage {
  id: number;
  chatId: number;
  remitenteId: number;
  contenido: string;
  fecha: string;
  clientId?: string;
  deliveryStatus?: DeliveryStatus;
}

export interface MessagePage {
  datos: ChatMessage[];
  total: number;
  pagina: number;
  limite: number;
}
