"use client";

import Image from "next/image";
import { type FormEvent, useState } from "react";
import { Heart, LoaderCircle, MessageSquareText, RefreshCw, Send, Trash2 } from "lucide-react";
import { getProfilePhotoUrl } from "@/features/profile";
import { useAuthStore } from "@/features/auth";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import type { ForumAuthor, ForumPost } from "../types";
import { useForums } from "../hooks/useForums";

function authorName(author: ForumAuthor) {
  return `${author.nombre ?? "Usuaria"} ${author.apellido ?? ""}`.trim();
}

function initials(author: ForumAuthor) {
  return `${author.nombre?.charAt(0) ?? "H"}${author.apellido?.charAt(0) ?? "G"}`.toUpperCase();
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ForumAvatar({ author }: { author: ForumAuthor }) {
  const photo = getProfilePhotoUrl(author.foto);
  return (
    <span className="forum-avatar" aria-hidden="true">
      {photo ? <Image src={photo} alt="" width={48} height={48} unoptimized /> : initials(author)}
    </span>
  );
}

export function ForumFeed() {
  const { user } = useAuthStore();
  const forum = useForums();
  const [text, setText] = useState("");
  const [postInterestId, setPostInterestId] = useState("");
  const [confirmPost, setConfirmPost] = useState<ForumPost | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;
    const success = await forum.publish({
      texto: cleanText,
      interesId: postInterestId ? Number(postInterestId) : undefined,
    });
    if (success) {
      setText("");
      setPostInterestId("");
    }
  }

  async function confirmDelete() {
    if (!confirmPost) return;
    const success = await forum.remove(confirmPost.id);
    if (success) setConfirmPost(null);
  }

  return (
    <section className="forum" aria-labelledby="forum-title">
      <div className="forum-heading">
        <div>
          <p className="connections-eyebrow">Comunidad</p>
          <h2 id="forum-title">Última actividad</h2>
          <p>Comparte experiencias, ideas y aprendizajes con la comunidad.</p>
        </div>
        <label className="forum-filter">
          <span>Filtrar por tema</span>
          <select
            value={forum.interestId ?? ""}
            onChange={(event) => forum.setInterestId(
              event.target.value ? Number(event.target.value) : undefined,
            )}
          >
            <option value="">Todos los temas</option>
            {forum.interests.map((interest) => (
              <option key={interest.id} value={interest.id}>{interest.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <form className="forum-composer" onSubmit={submit}>
        <div className="forum-composer-main">
          <span className="forum-avatar current" aria-hidden="true">
            {user?.firstName?.charAt(0) ?? "H"}{user?.lastName?.charAt(0) ?? "G"}
          </span>
          <label>
            <span className="sr-only">Contenido de la publicación</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="¿Qué quieres compartir hoy?"
              rows={3}
              maxLength={2000}
            />
          </label>
        </div>
        <div className="forum-composer-footer">
          <label>
            <span className="sr-only">Tema de la publicación</span>
            <select value={postInterestId} onChange={(event) => setPostInterestId(event.target.value)}>
              <option value="">Sin tema específico</option>
              {forum.interests.map((interest) => (
                <option key={interest.id} value={interest.id}>{interest.nombre}</option>
              ))}
            </select>
          </label>
          <span className="forum-character-count">{text.length}/2000</span>
          <button type="submit" className="forum-publish" disabled={!text.trim() || forum.publishing}>
            {forum.publishing ? <LoaderCircle className="forum-spinner" size={17} aria-hidden /> : <Send size={17} aria-hidden />}
            {forum.publishing ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>

      {forum.error && (
        <div className="forum-error" role="alert">
          <span>{forum.error}</span>
          <button type="button" onClick={() => void forum.reload()}>
            <RefreshCw size={15} aria-hidden /> Reintentar
          </button>
        </div>
      )}

      <div className="forum-posts" aria-live="polite">
        {forum.loading ? (
          <div className="forum-state"><LoaderCircle className="forum-spinner" aria-hidden /> Cargando publicaciones...</div>
        ) : forum.posts.length === 0 ? (
          <div className="forum-state empty">
            <MessageSquareText size={30} aria-hidden />
            <strong>Todavía no hay publicaciones</strong>
            <p>Sé la primera en compartir algo con la comunidad.</p>
          </div>
        ) : forum.posts.map((post) => {
          const canDelete = Number(user?.id) === post.autor.id || user?.rol === "admin";
          return (
            <article className="forum-post" key={post.id}>
              <header className="forum-post-header">
                <ForumAvatar author={post.autor} />
                <div className="forum-author">
                  <strong>{authorName(post.autor)}</strong>
                  <span>@{post.autor.usuario ?? "comunidad"} · <time dateTime={post.fecha}>{dateLabel(post.fecha)}</time></span>
                </div>
                {canDelete && (
                  <button type="button" className="forum-delete" onClick={() => setConfirmPost(post)} aria-label="Eliminar publicación">
                    <Trash2 size={17} aria-hidden />
                  </button>
                )}
              </header>
              {post.interes && <span className="forum-topic">{post.interes.nombre}</span>}
              <p className="forum-post-text">{post.texto}</p>
              <footer className="forum-post-actions">
                <button
                  type="button"
                  className={post.likedByMe ? "liked" : ""}
                  onClick={() => void forum.toggleLike(post.id)}
                  disabled={forum.pendingLikes.has(post.id)}
                  aria-pressed={post.likedByMe}
                  aria-label={post.likedByMe ? "Quitar Me gusta" : "Dar Me gusta"}
                >
                  <Heart size={18} fill={post.likedByMe ? "currentColor" : "none"} aria-hidden />
                  {post.likes} Me gusta
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      {forum.page < forum.totalPages && !forum.loading && (
        <button type="button" className="forum-load-more" onClick={() => void forum.loadMore()} disabled={forum.loadingMore}>
          {forum.loadingMore && <LoaderCircle className="forum-spinner" size={17} aria-hidden />}
          {forum.loadingMore ? "Cargando..." : "Ver más publicaciones"}
        </button>
      )}

      {confirmPost && (
        <ConfirmDialog
          title="Eliminar publicación"
          message="Esta acción no se puede deshacer."
          confirmLabel={forum.deletingId === confirmPost.id ? "Eliminando..." : "Eliminar"}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setConfirmPost(null)}
        />
      )}
    </section>
  );
}
