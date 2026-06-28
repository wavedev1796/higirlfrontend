"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { matchingService } from "../services/matching.service";
import type { DescubrirFilters, DiscoverUser } from "../types";

interface UseDiscoverResult {
  results: DiscoverUser[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  loadMore: () => void;
  refresh: () => void;
  ignore: (userId: number) => Promise<void>;
}

export function useDiscover(filters: DescubrirFilters): UseDiscoverResult {
  const [results, setResults] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchPage = useCallback(async (targetPage: number, reset: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchingService.getDiscover(
        filtersRef.current,
        targetPage,
        10,
      );
      setResults((prev) => (reset ? data.usuarias : [...prev, ...data.usuarias]));
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setError("No pudimos cargar los resultados. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchPage(1, true);
  }, [filters, fetchPage]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      fetchPage(page + 1, false);
    }
  }, [page, totalPages, loading, fetchPage]);

  const refresh = useCallback(() => {
    setPage(1);
    setResults([]);
    fetchPage(1, true);
  }, [fetchPage]);

  const ignore = useCallback(
    async (userId: number) => {
      await matchingService.ignoreUser(userId);
      setResults((prev) => {
        const next = prev.filter((item) => item.usuario.id !== userId);
        if (next.length < 3 && page < totalPages) {
          fetchPage(page + 1, false);
        }
        return next;
      });
    },
    [page, totalPages, fetchPage],
  );

  return { results, loading, error, page, totalPages, loadMore, refresh, ignore };
}
