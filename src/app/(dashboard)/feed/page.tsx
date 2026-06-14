"use client";

import { useAuthStore } from "@/features/auth";
import { InterestsModal } from "@/features/profile";
import { ROUTES } from "@/shared/constants/routes";
import { BRAND } from "@/shared/constants/brand";
import NextLink from "next/link";

export default function FeedPage() {
  const { user, refreshUser } = useAuthStore();
  const showInterestsModal = (user?.interestsCount ?? 0) < 3;

  return (
    <div className="dashboard-container">
      {showInterestsModal && (
        <InterestsModal onSuccess={() => refreshUser()} />
      )}

      {/* Sidebar Izquierda */}
      <aside className="dashboard-sidebar">
        <div className="pro-card">
          <h3>Comunidad</h3>
          <div className="suggestion-card">
            <div className="activity-avatar">MV</div>
            <div className="suggestion-info">
              <h4>Maria Vinueza</h4>
              <p>Diseñadora UX</p>
            </div>
            <button className="connect-btn">Conectar</button>
          </div>
          <div className="suggestion-card">
            <div className="activity-avatar">LG</div>
            <div className="suggestion-info">
              <h4>Laura Garcia</h4>
              <p>Emprendedora</p>
            </div>
            <button className="connect-btn">Conectar</button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="dashboard-feed">
        <header className="feed-hero">
          <div className="hero-content">
            <p className="eyebrow">¡Hola de nuevo, {user?.firstName}!</p>
            <h1>{BRAND.HERO}</h1>
            <p>{BRAND.DESCRIPTION}</p>
          </div>
        </header>

        <section className="feed-content">
          <div className="pro-card">
            <h3>Última actividad</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-avatar">JD</div>
                <div className="activity-content">
                  <p><strong>Julia Diaz</strong> publicó en <NextLink href="#">Carrera y Negocios</NextLink></p>
                  <p>&ldquo;Chicas, ¿qué opinan de la nueva tendencia en networking digital?&rdquo;</p>
                  <span>Hace 2 horas</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">AM</div>
                <div className="activity-content">
                  <p><strong>Ana Martinez</strong> se unió a la comunidad</p>
                  <p>¡Bienvenida Ana! Estamos felices de tenerte aquí.</p>
                  <span>Hace 5 horas</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Aside Derecha */}
      <aside className="dashboard-aside">
        <div className="pro-card">
          <h3>Métricas</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-content">
                <p><strong>1,240</strong></p>
                <span>Mujeres conectadas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p><strong>12</strong></p>
                <span>Eventos esta semana</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p><strong>{user?.interestsCount || 0}</strong></p>
                <span>Temas de interés</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pro-card">
          <h3>Próximos Eventos</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-content">
                <p><strong>Masterclass: Personal Branding</strong></p>
                <span>Mañana a las 10:00 AM</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p><strong>Círculo de Meditación</strong></p>
                <span>Jueves a las 6:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
