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
  goToPage: (nextPage: number) => void;
  refresh: () => void;
  ignore: (userId: number) => Promise<void>;
}

const DISCOVER_PAGE_SIZE = 5;

export function useDiscover(filters: DescubrirFilters): UseDiscoverResult {
  const [results, setResults] = useState<DiscoverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filtersRef = useRef(filters);
  
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchPage = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchingService.getDiscover(
        filtersRef.current,
        targetPage,
        DISCOVER_PAGE_SIZE,
      );
      setResults(data.usuarias);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      setError("No pudimos cargar los resultados. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults([]);
    setPage(1);
    fetchPage(1);
  }, [filters, fetchPage]);

  const goToPage = useCallback(
    (nextPage: number) => {
      if (loading || nextPage < 1 || nextPage > totalPages || nextPage === page) {
        return;
      }
      fetchPage(nextPage);
    },
    [page, totalPages, loading, fetchPage],
  );

  const refresh = useCallback(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  const ignore = useCallback(
    async (userId: number) => {
      await matchingService.ignoreUser(userId);
      const nextResults = results.filter((item) => item.usuario.id !== userId);
      setResults(nextResults);

      if (nextResults.length === 0 && page > 1) {
        fetchPage(page - 1);
        return;
      }

      fetchPage(page);
    },
    [results, page, fetchPage],
  );

  return { results, loading, error, page, totalPages, goToPage, refresh, ignore };
}
