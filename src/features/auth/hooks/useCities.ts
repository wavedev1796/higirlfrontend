/**
 * Auth feature — useCities hook.
 *
 * Fetches the list of cities from the backend catalog endpoint.
 * Returns the cities sorted alphabetically (the API already sorts them).
 */

"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";

export interface City {
  id: number;
  nombre: string;
  provincia?: string;
}

interface UseCitiesResult {
  cities: City[];
  loading: boolean;
  error: string | null;
}

export function useCities(): UseCitiesResult {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .get<City[]>(API_ENDPOINTS.CATALOGS.CITIES)
      .then((data) => {
        if (!cancelled) setCities(data);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudieron cargar las ciudades");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { cities, loading, error };
}
