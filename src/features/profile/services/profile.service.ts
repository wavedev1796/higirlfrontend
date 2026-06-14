import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import { env } from "@/infrastructure/config/env";
import { apiClient } from "@/lib/api";
import type { CatalogItem, Profile, UpdateProfileRequest } from "../types";

export function getProfilePhotoUrl(photo?: string | null): string | null {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  return `${env.API_ORIGIN}${photo}`;
}

export const profileService = {
  getMe: () => apiClient.get<Profile>(API_ENDPOINTS.PROFILE.ME),

  updateMe: (data: UpdateProfileRequest) =>
    apiClient.patch<Profile>(API_ENDPOINTS.PROFILE.ME, data),

  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append("foto", file);
    return apiClient.post<{ foto: string }>(
      API_ENDPOINTS.PROFILE.PHOTO,
      formData,
    );
  },

  deletePhoto: () =>
    apiClient.delete<{ foto: null }>(API_ENDPOINTS.PROFILE.PHOTO),

  getCategories: () =>
    apiClient.get<CatalogItem[]>(API_ENDPOINTS.CATALOGS.CATEGORIES),

  getInterests: () =>
    apiClient.get<CatalogItem[]>(API_ENDPOINTS.CATALOGS.INTERESTS),

  updateInterests: (ids: number[]) =>
    apiClient.put<{ message: string }>(API_ENDPOINTS.PROFILE.INTERESTS, {
      interesIds: ids,
    }),
} as const;
