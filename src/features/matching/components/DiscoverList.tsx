"use client";

import { DiscoverCard } from "./DiscoverCard";
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
    return <div className="profile-state">Buscando chicas...</div>;
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
