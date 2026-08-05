"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { RecommendationsList } from "@/features/matching";
import { ForumFeed } from "@/features/forums";
import { InterestsModal } from "@/features/profile";
import { BRAND } from "@/shared/constants/brand";

export default function FeedPage() {
  const { user, refreshUser } = useAuthStore();
  const [interestsDismissed, setInterestsDismissed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const showInterestsModal = !interestsDismissed && (user?.interestsCount ?? 0) < 3;

  return (
    <div className={`dashboard-container${sidebarOpen ? " sidebar-open" : ""}`}>
      {showInterestsModal && (
        <InterestsModal
          onSuccess={() => refreshUser()}
          onClose={() => setInterestsDismissed(true)}
        />
      )}

      <aside id="community-sidebar" className="dashboard-sidebar">
        <div className="pro-card">
          <h3>Comunidad</h3>
          <RecommendationsList />
        </div>
      </aside>

      <main className="dashboard-feed">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((p) => !p)}
          aria-expanded={sidebarOpen}
          aria-controls="community-sidebar"
        >
          <Users size={15} aria-hidden />
          {sidebarOpen ? "Ocultar comunidad" : "Ver comunidad"}
        </button>

        <header className="feed-hero">
          <div className="hero-content">
            <p className="eyebrow">¡Hola de nuevo, {user?.firstName}!</p>
            <h1>{BRAND.HERO}</h1>
            <p>{BRAND.DESCRIPTION}</p>
          </div>
        </header>

        <section className="feed-content">
          <ForumFeed />
        </section>
      </main>

      <aside className="dashboard-aside">
        <div className="pro-card">
          <h3>Tu perfil</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-content">
                <p>
                  <strong>{user?.interestsCount || 0}</strong>
                </p>
                <span>Temas de interés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pro-card">
          <h3>Próximos Eventos</h3>
          <div className="discover-empty" style={{ minHeight: "8rem" }}>
            <p>Sin eventos próximos.</p>
            <p>¡Pronto habrá actividades para vos!</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
