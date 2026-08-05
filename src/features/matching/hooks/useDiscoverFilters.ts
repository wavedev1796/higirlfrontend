"use client";

import { useCallback, useState } from "react";
import type { DescubrirFilters } from "../types";

interface UseDiscoverFiltersResult {
  filters: DescubrirFilters;
  setFilter: <K extends keyof DescubrirFilters>(
    key: K,
    value: DescubrirFilters[K],
  ) => void;
  resetFilters: () => void;
}

const EMPTY_FILTERS: DescubrirFilters = {};

export function useDiscoverFilters(): UseDiscoverFiltersResult {
  const [filters, setFilters] = useState<DescubrirFilters>(EMPTY_FILTERS);

  const setFilter = useCallback(
    <K extends keyof DescubrirFilters>(key: K, value: DescubrirFilters[K]) => {
      setFilters((prev) => {
        if (!value) {
          const next = { ...prev };
          delete next[key];
          return next;
        }
        return { ...prev, [key]: value };
      });
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return { filters, setFilter, resetFilters };
}
