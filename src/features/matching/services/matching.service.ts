import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import { apiClient } from "@/lib/api";
import type {
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
} as const;
