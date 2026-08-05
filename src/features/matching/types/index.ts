import type { UserSummary } from "@/shared/types/user.types";

import type { CatalogItem } from "@/features/profile/types";

export interface MatchingUser extends UserSummary {
  ciudad?: number | null;
  bio?: string | null;
  intereses: CatalogItem[];
}

export interface MatchingBreakdown {
  ciudad: number;
  intereses: number;
  estiloVida: number;
  edad: number;
  laboral: number;
}

export interface MatchingRecommendation {
  usuario: MatchingUser;
  compatibilidad: number;
  desglose: MatchingBreakdown;
}

export interface MatchingRecommendationsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  recomendaciones: MatchingRecommendation[];
}

export interface DescubrirFilters {
  ciudadId?: number;
  categoriaId?: number;
  interesId?: number;
}

export interface DiscoverUser {
  usuario: MatchingUser;
  compatibilidad: number;
}

export interface DiscoverResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  usuarias: DiscoverUser[];
}
