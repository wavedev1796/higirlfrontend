import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import type { BlockedUser, ReportReason } from "../types";

export const moderationService = {
  report: (reportadaId: number, motivo: ReportReason, descripcion?: string) =>
    apiClient.post<{ mensaje: string }>(API_ENDPOINTS.MODERATION.REPORTS, {
      reportadaId,
      motivo,
      descripcion,
    }),

  block: (bloqueadaId: number) =>
    apiClient.post<{ mensaje: string }>(API_ENDPOINTS.MODERATION.BLOCKS, {
      bloqueadaId,
    }),

  unblock: (id: number) =>
    apiClient.delete<{ mensaje: string }>(API_ENDPOINTS.MODERATION.BLOCK(id)),

  listBlocked: () =>
    apiClient.get<BlockedUser[]>(API_ENDPOINTS.MODERATION.BLOCKS),
} as const;
