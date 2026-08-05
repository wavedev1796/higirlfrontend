import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import type { Chat, ChatMessage, MessagePage } from "../types";

export const chatService = {
  list(): Promise<Chat[]> {
    return apiClient.get<Chat[]>(API_ENDPOINTS.CHATS.LIST);
  },

  create(participantId: number): Promise<Chat> {
    return apiClient.post<Chat>(API_ENDPOINTS.CHATS.LIST, {
      participanteId: participantId,
    });
  },

  messages(chatId: number, page = 1, limit = 50): Promise<MessagePage> {
    const query = new URLSearchParams({ pagina: String(page), limite: String(limit) });
    return apiClient.get<MessagePage>(
      `${API_ENDPOINTS.CHATS.MESSAGES(chatId)}?${query.toString()}`,
    );
  },

  send(chatId: number, content: string): Promise<ChatMessage> {
    return apiClient.post<ChatMessage>(API_ENDPOINTS.CHATS.MESSAGES(chatId), {
      contenido: content,
    });
  },
};
