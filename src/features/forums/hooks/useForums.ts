"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profileService } from "@/features/profile";
import type { CatalogItem } from "@/features/profile";
import { ApiError } from "@/lib/api";
import { forumsService } from "../services/forums.service";
import type { CreateForumPost, ForumPost } from "../types";

const PAGE_SIZE = 10;

function messageFor(reason: unknown, fallback: string) {
  return reason instanceof ApiError ? reason.message : fallback;
}

export function useForums() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [interests, setInterests] = useState<CatalogItem[]>([]);
  const [interestId, setInterestId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pendingLikes, setPendingLikes] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (targetPage = 1, append = false) => {
    const currentRequest = ++requestId.current;
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const result = await forumsService.feed(targetPage, PAGE_SIZE, interestId);
      if (currentRequest !== requestId.current) return;
      setPosts((current) => append
        ? [...current, ...result.publicaciones.filter(
          (post) => !current.some((item) => item.id === post.id),
        )]
        : result.publicaciones,
      );
      setPage(result.page);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (reason) {
      if (currentRequest === requestId.current) {
        setError(messageFor(reason, "No pudimos cargar las publicaciones."));
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [interestId]);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  useEffect(() => {
    let active = true;
    void profileService.getInterests()
      .then((result) => {
        if (active) setInterests(result);
      })
      .catch(() => {
        if (active) setError("No pudimos cargar los temas de interés.");
      });
    return () => { active = false; };
  }, []);

  const publish = useCallback(async (payload: CreateForumPost) => {
    setPublishing(true);
    try {
      const created = await forumsService.create(payload);
      if (!interestId || created.interes?.id === interestId) {
        setPosts((current) => [created, ...current]);
      }
      setError(null);
      return true;
    } catch (reason) {
      setError(messageFor(reason, "No pudimos publicar tu mensaje."));
      return false;
    } finally {
      setPublishing(false);
    }
  }, [interestId]);

  const toggleLike = useCallback(async (postId: number) => {
    let previous: ForumPost | undefined;
    setPendingLikes((current) => new Set(current).add(postId));
    setPosts((current) => current.map((post) => {
      if (post.id !== postId) return post;
      previous = post;
      return {
        ...post,
        likedByMe: !post.likedByMe,
        likes: Math.max(0, post.likes + (post.likedByMe ? -1 : 1)),
      };
    }));

    try {
      const result = await forumsService.toggleLike(postId);
      setPosts((current) => current.map((post) => post.id === postId
        ? { ...post, likedByMe: result.liked, likes: result.likes }
        : post,
      ));
      setError(null);
    } catch (reason) {
      if (previous) {
        const rollback = previous;
        setPosts((current) => current.map((post) =>
          post.id === postId ? rollback : post,
        ));
      }
      setError(messageFor(reason, "No pudimos actualizar tu reacción."));
    } finally {
      setPendingLikes((current) => {
        const next = new Set(current);
        next.delete(postId);
        return next;
      });
    }
  }, []);

  const remove = useCallback(async (postId: number) => {
    setDeletingId(postId);
    try {
      await forumsService.delete(postId);
      setPosts((current) => current.filter((post) => post.id !== postId));
      setError(null);
      return true;
    } catch (reason) {
      setError(messageFor(reason, "No pudimos eliminar la publicación."));
      return false;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    posts, interests, interestId, page, totalPages, loading, loadingMore,
    publishing, pendingLikes, deletingId, error, setInterestId, publish,
    toggleLike, remove, reload: () => load(1),
    loadMore: () => load(page + 1, true),
  };
}
