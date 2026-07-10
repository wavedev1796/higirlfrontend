import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import { apiClient } from "@/lib/api";
import type { Notification } from "../types";

export const notificationsService = {
  list: () =>
    apiClient.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.LIST),

  markRead: (id: number) =>
    apiClient.patch<Notification>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
} as const;
