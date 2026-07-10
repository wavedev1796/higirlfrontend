"use client";

import { ProtectedRoute } from "@/features/auth";
import { DiscoverFilters } from "@/features/matching/components/DiscoverFilters";
import { DiscoverList } from "@/features/matching/components/DiscoverList";
import { useDiscover } from "@/features/matching/hooks/useDiscover";
import { useDiscoverFilters } from "@/features/matching/hooks/useDiscoverFilters";
import { useConnectedUserIds } from "@/features/matching/hooks/useConnectedUserIds";

export default function DescubrirPage() {
  const { filters, setFilter, resetFilters } = useDiscoverFilters();
  const { results, loading, error, page, totalPages, goToPage, ignore } =
    useDiscover(filters);
  const connectedIds = useConnectedUserIds();

  return (
    <ProtectedRoute>
      <section className="discover-page">
        <header className="discover-header">
          <h1>Descubrir</h1>
          <p>Explora la comunidad y encuentra chicas con las que conectar.</p>
        </header>

        <DiscoverFilters
          filters={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
        />

        <DiscoverList
          results={results}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onIgnore={ignore}
          onPageChange={goToPage}
          connectedIds={connectedIds}
        />
      </section>
    </ProtectedRoute>
  );
}
