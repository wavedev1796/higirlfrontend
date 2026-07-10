"use client";

import { DiscoverCard } from "./DiscoverCard";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import type { DiscoverUser } from "../types";

interface DiscoverListProps {
  results: DiscoverUser[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onIgnore: (userId: number) => Promise<void>;
  onLoadMore: () => void;
}

export function DiscoverList({
  results,
  loading,
  error,
  page,
  totalPages,
  onIgnore,
  onLoadMore,
}: DiscoverListProps) {
  if (loading && results.length === 0) {
    return (
      <div className="discover-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="discover-skeleton-card">
            <Skeleton style={{ aspectRatio: "1", borderRadius: "1.35rem" }} />
            <Skeleton style={{ height: "1.1rem", width: "65%" }} />
            <Skeleton style={{ height: "0.85rem", width: "45%" }} />
            <Skeleton style={{ height: "0.85rem" }} />
            <Skeleton style={{ height: "0.85rem", width: "80%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="profile-state profile-error">{error}</div>;
  }

  if (results.length === 0) {
    return (
      <div className="discover-empty">
        <p>No encontramos chicas con esos filtros.</p>
        <p>Prueba cambiando o quitando algún filtro.</p>
      </div>
    );
  }

  return (
    <section className="discover-list">
      <div className="discover-grid">
        {results.map((item) => (
          <DiscoverCard
            key={item.usuario.id}
            item={item}
            onIgnore={() => onIgnore(item.usuario.id)}
          />
        ))}
      </div>

      {page < totalPages && (
        <div className="discover-load-more">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </section>
  );
}
