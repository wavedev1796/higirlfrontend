"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
  onPageChange: (nextPage: number) => void;
}

export function DiscoverList({
  results,
  loading,
  error,
  page,
  totalPages,
  onIgnore,
  onPageChange,
}: DiscoverListProps) {
  if (loading && results.length === 0) {
    return (
      <div className="discover-grid">
        {[...Array(5)].map((_, i) => (
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
        <p>Prueba cambiando o quitando algun filtro.</p>
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

      {totalPages > 1 && (
        <div className="discover-pagination" aria-label="Paginacion de descubrir">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={loading || page <= 1}
            aria-label="Pagina anterior"
          >
            <ChevronLeft aria-hidden size={18} />
          </button>
          <span>
            Pagina {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={loading || page >= totalPages}
            aria-label="Pagina siguiente"
          >
            <ChevronRight aria-hidden size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
