import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import type {
  CreateForumPost,
  ForumFeedResponse,
  ForumPost,
  LikeResult,
} from "../types";

export const forumsService = {
  feed(page = 1, limit = 10, interestId?: number) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (interestId) query.set("interesId", String(interestId));
    return apiClient.get<ForumFeedResponse>(
      `${API_ENDPOINTS.FORUMS.FEED}?${query.toString()}`,
    );
  },

  create(payload: CreateForumPost) {
    return apiClient.post<ForumPost>(API_ENDPOINTS.FORUMS.POSTS, payload);
  },

  toggleLike(postId: number) {
    return apiClient.post<LikeResult>(API_ENDPOINTS.FORUMS.LIKE(postId));
  },

  delete(postId: number) {
    return apiClient.delete<{ mensaje: string }>(API_ENDPOINTS.FORUMS.POST(postId));
  },
} as const;
