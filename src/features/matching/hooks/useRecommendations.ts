"use client";

import { useEffect, useState } from "react";
import { matchingService } from "../services/matching.service";
import type { MatchingRecommendation } from "../types";

interface UseRecommendationsResult {
  recommendations: MatchingRecommendation[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useRecommendations(limit = 5): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<MatchingRecommendation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    matchingService
      .getRecommendations(1, limit)
      .then((data) => {
        if (!mounted) return;
        setRecommendations(data.recomendaciones);
        setTotal(data.total);
      })
      .catch(() => {
        if (!mounted) return;
        setError("No pudimos cargar los perfiles.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [limit]);

  return { recommendations, total, loading, error };
}
