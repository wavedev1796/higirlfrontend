import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import { apiClient } from "@/lib/api";
import type {
  DescubrirFilters,
  DiscoverResponse,
  MatchingRecommendation,
  MatchingRecommendationsResponse,
} from "../types";

function recommendationsEndpoint(page: number, limit: number): string {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return `${API_ENDPOINTS.MATCHING.RECOMMENDATIONS}?${params.toString()}`;
}

function discoverEndpoint(
  filters: DescubrirFilters,
  page: number,
  limit: number,
): string {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (filters.ciudadId) params.set("ciudadId", String(filters.ciudadId));
  if (filters.categoriaId) params.set("categoriaId", String(filters.categoriaId));
  if (filters.interesId) params.set("interesId", String(filters.interesId));
  return `${API_ENDPOINTS.MATCHING.DISCOVER}?${params.toString()}`;
}

export const matchingService = {
  getRecommendations: (page = 1, limit = 10) =>
    apiClient.get<MatchingRecommendationsResponse>(
      recommendationsEndpoint(page, limit),
    ),

  async getRecommendationByUserId(
    userId: number,
  ): Promise<MatchingRecommendation | null> {
    const response = await this.getRecommendations(1, 50);

    return (
      response.recomendaciones.find(
        (recommendation) => recommendation.usuario.id === userId,
      ) ?? null
    );
  },

  getDiscover: (filters: DescubrirFilters = {}, page = 1, limit = 10) =>
    apiClient.get<DiscoverResponse>(discoverEndpoint(filters, page, limit)),

  ignoreUser: (userId: number) =>
    apiClient.post<{ mensaje: string }>(API_ENDPOINTS.MATCHING.IGNORE(userId)),
} as const;
