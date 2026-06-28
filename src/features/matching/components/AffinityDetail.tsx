"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfilePhotoUrl } from "@/features/profile";
import { ApiError } from "@/lib/api";
import { ROUTES } from "@/shared/constants/routes";
import { matchingService } from "../services/matching.service";
import type { MatchingBreakdown, MatchingRecommendation } from "../types";
import { CompatibilityBadge, formatCompatibility } from "./CompatibilityBadge";

const BREAKDOWN_LABELS: Record<keyof MatchingBreakdown, string> = {
  ciudad: "Ciudad",
  intereses: "Intereses",
  estiloVida: "Estilo de vida",
  edad: "Edad",
  laboral: "Afinidad laboral",
};

const BREAKDOWN_MAX: Record<keyof MatchingBreakdown, number> = {
  ciudad: 30,
  intereses: 30,
  estiloVida: 15,
  edad: 15,
  laboral: 10,
};

interface AffinityDetailProps {
  userId: number;
}

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

export function AffinityDetail({ userId }: AffinityDetailProps) {
  const [recommendation, setRecommendation] =
    useState<MatchingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    matchingService
      .getRecommendationByUserId(userId)
      .then((result) => {
        if (!isMounted) return;
        setRecommendation(result);
        if (!result) {
          setError("No encontramos esta afinidad entre tus recomendaciones.");
        }
      })
      .catch((reason: unknown) => {
        if (!isMounted) return;
        setError(
          reason instanceof ApiError
            ? reason.message
            : "No pudimos cargar el detalle de afinidad.",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (isLoading) {
    return <div className="profile-state">Cargando afinidad...</div>;
  }

  if (error || !recommendation) {
    return (
      <section className="affinity-page">
        <div className="profile-state profile-error">
          {error ?? "No pudimos cargar el detalle de afinidad."}
        </div>
        <Link className="profile-edit-link" href={ROUTES.DASHBOARD}>
          Volver al inicio
        </Link>
      </section>
    );
  }

  const name = fullName(recommendation);
  const photoUrl = getProfilePhotoUrl(recommendation.usuario.foto);

  return (
    <section className="affinity-page">
      <Link className="profile-edit-link affinity-back-link" href={ROUTES.DASHBOARD}>
        Volver al inicio
      </Link>

      <article className="affinity-hero">
        <div
          className="affinity-avatar"
          style={photoUrl ? { backgroundImage: `url("${photoUrl}")` } : undefined}
          role="img"
          aria-label={`Foto de ${name}`}
        >
          {!photoUrl && <span>{initials(name)}</span>}
        </div>
        <div className="affinity-hero-copy">
          <p className="eyebrow">Detalle de afinidad</p>
          <h1>{name}</h1>
          <p>@{recommendation.usuario.usuario}</p>
          {recommendation.usuario.bio && (
            <blockquote>{recommendation.usuario.bio}</blockquote>
          )}
        </div>
        <CompatibilityBadge
          value={recommendation.compatibilidad}
          className="compatibility-badge-large"
        />
      </article>

      <div className="affinity-grid">
        <article className="affinity-panel">
          <h2>Como se compone</h2>
          <div className="affinity-breakdown">
            {(Object.keys(recommendation.desglose) as Array<
              keyof MatchingBreakdown
            >)
              .filter((key) => key !== "ciudad")
              .map((key) => {
              const value = recommendation.desglose[key];
              const max = BREAKDOWN_MAX[key];
              const width = max ? Math.min(100, (value / max) * 100) : 0;

              return (
                <div className="affinity-row" key={key}>
                  <div>
                    <strong>{BREAKDOWN_LABELS[key]}</strong>
                    <span>
                      {formatCompatibility(value)} de {max} pts
                    </span>
                  </div>
                  <div className="affinity-meter" aria-hidden="true">
                    <span style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="affinity-panel">
          <h2>Intereses</h2>
          <div className="profile-tags">
            {recommendation.usuario.intereses.length ? (
              recommendation.usuario.intereses.map((interest) => (
                <span key={interest.id}>{interest.nombre}</span>
              ))
            ) : (
              <p className="profile-empty">Sin intereses publicados.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
