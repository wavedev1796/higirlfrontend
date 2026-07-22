"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  CheckCheck,
  CircleAlert,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Send,
  Smile,
  UsersRound,
} from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { useChat } from "../hooks/useChat";
import type { Chat, ChatMessage, ChatParticipant } from "../types";
import { ChatAvatar } from "./ChatAvatar";

const EMOJIS = ["😊", "💖", "✨", "😂", "🥰", "🙌", "🌸", "💪", "🎉", "🤗"];

function otherParticipant(chat: Chat, userId?: number | string): ChatParticipant {
  return chat.participantes.find((person) => person.id !== Number(userId)) ?? chat.participantes[0];
}

function timeLabel(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function dayLabel(value: string) {
  const date = new Date(value);
  if (date.toDateString() === new Date().toDateString()) return "Hoy";
  return new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function sameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function ChatView({ initialParticipantId }: { initialParticipantId?: number }) {
  const { user } = useAuthStore();
  const chat = useChat(initialParticipantId);
  const [draft, setDraft] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousHeight = useRef<number | null>(null);
  const selected = chat.chats.find((item) => item.id === chat.selectedChatId);
  const person = selected ? otherParticipant(selected, user?.id) : null;

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container || chat.loadingMessages) return;
    if (previousHeight.current !== null) {
      container.scrollTop += container.scrollHeight - previousHeight.current;
      previousHeight.current = null;
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }, [chat.loadingMessages, chat.messages]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    setShowEmojis(false);
    await chat.send(content);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function handleOlder() {
    if (scrollRef.current) previousHeight.current = scrollRef.current.scrollHeight;
    await chat.loadOlder();
  }

  function retry(message: ChatMessage) {
    if (message.clientId) void chat.send(message.contenido, message.clientId);
  }

  function selectConversation(chatId: number | null) {
    setDraft("");
    setShowEmojis(false);
    chat.selectChat(chatId);
  }

  return (
    <section className={`chat-page${selected ? " chat-open" : ""}`}>
      <aside className="chat-sidebar" aria-label="Lista de chats">
        <header className="chat-sidebar-header">
          <div>
            <p className="connections-eyebrow">Mensajes</p>
            <h1>Tus chats</h1>
          </div>
          <MessageCircle size={24} aria-hidden />
        </header>

        <div className="chat-list" aria-live="polite">
          {chat.loadingChats ? (
            <div className="chat-list-state">
              <LoaderCircle className="chat-spinner" aria-hidden /> Cargando chats...
            </div>
          ) : chat.error && !chat.chats.length ? (
            <div className="chat-list-state error">
              <p>{chat.error}</p>
              <button type="button" onClick={() => void chat.reload()}>Reintentar</button>
            </div>
          ) : !chat.chats.length ? (
            <div className="chat-list-state">
              <UsersRound size={28} aria-hidden />
              <strong>Aún no tienes chats</strong>
              <p>Inicia una conversación desde tus conexiones.</p>
            </div>
          ) : chat.chats.map((item) => {
            const participant = otherParticipant(item, user?.id);
            const name = `${participant.nombre} ${participant.apellido}`.trim();
            return (
              <button
                key={item.id}
                type="button"
                className={`chat-list-item${item.id === chat.selectedChatId ? " active" : ""}`}
                onClick={() => selectConversation(item.id)}
              >
                <ChatAvatar person={participant} />
                <span className="chat-list-copy">
                  <strong>{name}</strong>
                  <span>@{participant.usuario}</span>
                </span>
                <time dateTime={item.updatedAt}>
                  {new Intl.DateTimeFormat("es-EC", { day: "2-digit", month: "short" }).format(new Date(item.updatedAt))}
                </time>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="conversation-panel">
        {!selected || !person ? (
          <div className="conversation-empty">
            <span><MessageCircle size={34} aria-hidden /></span>
            <h2>Selecciona una conversación</h2>
            <p>Elige un chat para leer y enviar mensajes.</p>
          </div>
        ) : (
          <>
            <header className="conversation-header">
              <button type="button" className="chat-back" onClick={() => selectConversation(null)} aria-label="Volver a la lista de chats">
                <ChevronLeft size={22} aria-hidden />
              </button>
              <ChatAvatar person={person} />
              <div>
                <h2>{person.nombre} {person.apellido}</h2>
                <span>@{person.usuario}</span>
              </div>
            </header>

            {chat.error && (
              <div className="conversation-error" role="alert">
                <CircleAlert size={16} aria-hidden />{chat.error}
              </div>
            )}

            <div
              className="message-scroll"
              ref={scrollRef}
              aria-live="polite"
              aria-label={`Conversación con ${person.nombre}`}
            >
              {chat.hasOlder && (
                <button
                  type="button"
                  className="load-older"
                  onClick={() => void handleOlder()}
                  disabled={chat.loadingOlder}
                >
                  {chat.loadingOlder ? "Cargando..." : "Ver mensajes anteriores"}
                </button>
              )}
              {chat.loadingMessages ? (
                <div className="messages-state">
                  <LoaderCircle className="chat-spinner" aria-hidden /> Cargando mensajes...
                </div>
              ) : !chat.messages.length ? (
                <div className="messages-state welcome">
                  <span>👋</span><strong>Empieza la conversación</strong>
                  <p>Envía un saludo y conecta.</p>
                </div>
              ) : chat.messages.map((message, index) => {
                const own = message.remitenteId === Number(user?.id) || Boolean(message.clientId);
                const showDay = index === 0 || !sameDay(chat.messages[index - 1].fecha, message.fecha);
                return (
                  <div key={message.clientId ?? message.id}>
                    {showDay && <div className="message-day">{dayLabel(message.fecha)}</div>}
                    <div className={`message-row ${own ? "own" : "received"}`}>
                      <div className={`message-bubble${message.deliveryStatus === "error" ? " failed" : ""}`}>
                        <p>{message.contenido}</p>
                        <span className="message-meta">
                          <time dateTime={message.fecha}>{timeLabel(message.fecha)}</time>
                          {own && (
                            message.deliveryStatus === "sending" ? (
                              <><LoaderCircle className="chat-spinner" size={13} aria-hidden /> Enviando</>
                            ) : message.deliveryStatus === "error" ? (
                              <><CircleAlert size={13} aria-hidden /> Error</>
                            ) : (
                              <><CheckCheck size={14} aria-hidden /> Enviado</>
                            )
                          )}
                        </span>
                      </div>
                      {message.deliveryStatus === "error" && (
                        <button type="button" className="retry-message" onClick={() => retry(message)} aria-label="Reintentar envío">
                          <RefreshCw size={15} aria-hidden />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form className="message-composer" onSubmit={handleSubmit}>
              {showEmojis && (
                <div className="emoji-picker" role="group" aria-label="Elegir emoji">
                  {EMOJIS.map((emoji) => (
                    <button key={emoji} type="button" onClick={() => setDraft((value) => `${value}${emoji}`)}>{emoji}</button>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="emoji-trigger"
                onClick={() => setShowEmojis((value) => !value)}
                aria-label="Mostrar emojis"
                aria-expanded={showEmojis}
              >
                <Smile size={21} aria-hidden />
              </button>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={2000}
                rows={1}
                placeholder="Escribe un mensaje..."
                aria-label="Mensaje"
              />
              <button type="submit" className="send-message" disabled={!draft.trim()} aria-label="Enviar mensaje">
                <Send size={20} aria-hidden />
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
