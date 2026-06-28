"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import { useCities } from "@/features/auth/hooks/useCities";
import type { CatalogItem } from "@/features/profile/types";
import type { DescubrirFilters } from "../types";

interface DiscoverFiltersProps {
  filters: DescubrirFilters;
  onFilterChange: <K extends keyof DescubrirFilters>(
    key: K,
    value: DescubrirFilters[K],
  ) => void;
  onReset: () => void;
}

export function DiscoverFilters({
  filters,
  onFilterChange,
  onReset,
}: DiscoverFiltersProps) {
  const { cities } = useCities();
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [interests, setInterests] = useState<CatalogItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiClient.get<CatalogItem[]>(API_ENDPOINTS.CATALOGS.CATEGORIES),
      apiClient.get<CatalogItem[]>(API_ENDPOINTS.CATALOGS.INTERESTS),
    ]).then(([cats, ints]) => {
      if (!cancelled) {
        setCategories(cats);
        setInterests(ints);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSelect(key: keyof DescubrirFilters, raw: string) {
    const value = raw ? Number(raw) : undefined;
    onFilterChange(key, value);
  }

  const hasFilters =
    filters.ciudadId !== undefined ||
    filters.categoriaId !== undefined ||
    filters.interesId !== undefined;

  return (
    <div className="discover-filters">
      <div className="discover-filters-selects">
        <label htmlFor="filter-city">
          Ciudad
          <select
            id="filter-city"
            value={filters.ciudadId ?? ""}
            onChange={(e) => handleSelect("ciudadId", e.target.value)}
          >
            <option value="">Todas las ciudades</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="filter-category">
          Categoría
          <select
            id="filter-category"
            value={filters.categoriaId ?? ""}
            onChange={(e) => handleSelect("categoriaId", e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="filter-interest">
          Interés
          <select
            id="filter-interest"
            value={filters.interesId ?? ""}
            onChange={(e) => handleSelect("interesId", e.target.value)}
          >
            <option value="">Todos los intereses</option>
            {interests.map((int) => (
              <option key={int.id} value={int.id}>
                {int.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasFilters && (
        <button type="button" className="discover-filters-clear" onClick={onReset}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
