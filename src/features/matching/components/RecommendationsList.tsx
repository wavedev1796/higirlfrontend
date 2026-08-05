"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProfilePhotoUrl } from "@/features/profile";
import { ROUTES } from "@/shared/constants/routes";
import { ApiError } from "@/lib/api";
import { matchingService } from "../services/matching.service";
import type { MatchingRecommendation } from "../types";
import { CompatibilityBadge } from "./CompatibilityBadge";

function fullName(recommendation: MatchingRecommendation): string {
  return `${recommendation.usuario.nombre} ${recommendation.usuario.apellido}`.trim();
}

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "HG"
  );
}

export function RecommendationsList() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recommendations, setRecommendations] = useState<
    MatchingRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    matchingService
      .getRecommendations(page, 5)
      .then((response) => {
        if (!isMounted) return;
        setRecommendations(response.recomendaciones);
        setTotalPages(response.totalPages);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!isMounted) return;
        setError(
          reason instanceof ApiError
            ? reason.message
            : "No pudimos cargar tus afinidades.",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page]);

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setIsLoading(true);
    setPage(nextPage);
  }

  if (isLoading) {
    return <p className="suggestion-state">Buscando perfiles compatibles...</p>;
  }

  if (error) {
    return <p className="suggestion-state suggestion-error">{error}</p>;
  }

  if (recommendations.length === 0) {
    return (
      <p className="suggestion-state">
        Aun no hay recomendaciones para mostrar.
      </p>
    );
  }

  return (
    <>
      <div className="suggestion-list">
        {recommendations.map((recommendation) => {
          const name = fullName(recommendation);
          const photoUrl = getProfilePhotoUrl(recommendation.usuario.foto);

          return (
            <Link
              key={recommendation.usuario.id}
              className="suggestion-card suggestion-card-link"
              href={ROUTES.AFFINITY_DETAIL(recommendation.usuario.id)}
            >
              <div
                className="activity-avatar"
                style={
                  photoUrl
                    ? { backgroundImage: `url("${photoUrl}")` }
                    : undefined
                }
                aria-hidden="true"
              >
                {!photoUrl && initials(name)}
              </div>
              <div className="suggestion-info">
                <h4>{name}</h4>
                <p>@{recommendation.usuario.usuario}</p>
              </div>
              <CompatibilityBadge value={recommendation.compatibilidad} />
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav className="suggestion-pagination" aria-label="Páginas de afinidades">
          <button
            type="button"
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
            title="Página anterior"
          >
            <ChevronLeft size={17} aria-hidden />
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => changePage(page + 1)}
            disabled={page === totalPages}
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <ChevronRight size={17} aria-hidden />
          </button>
        </nav>
      )}
    </>
  );
}
