"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [recommendations, setRecommendations] = useState<
    MatchingRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    matchingService
      .getRecommendations(1, 4)
      .then((response) => {
        if (!isMounted) return;
        setRecommendations(response.recomendaciones);
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
  }, []);

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
                photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined
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
  );
}
