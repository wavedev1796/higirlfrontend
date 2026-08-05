"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "@/infrastructure/config/env";
import { tokenStorage } from "@/infrastructure/storage/tokenStorage";
import { ApiError } from "@/lib/api";
import { chatService } from "../services/chat.service";
import type { Chat, ChatMessage } from "../types";

const PAGE_SIZE = 50;

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof ApiError ? reason.message : fallback;
}

function chronological(messages: ChatMessage[]) {
  return [...messages].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  );
}

export function useChat(initialParticipantId?: number) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasOlder, setHasOlder] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeChatRef = useRef<number | null>(null);

  useEffect(() => {
    activeChatRef.current = selectedChatId;
  }, [selectedChatId]);

  const loadChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      let result = await chatService.list();
      if (initialParticipantId) {
        const existing = result.find((item) =>
          item.participantes.some((person) => person.id === initialParticipantId),
        );
        const target = existing ?? await chatService.create(initialParticipantId);
        if (!existing) result = [target, ...result];
        setSelectedChatId(target.id);
      } else if (result.length) {
        setSelectedChatId((current) => current ?? result[0].id);
      }
      setChats(result);
      setError(null);
    } catch (reason) {
      setError(errorMessage(reason, "No pudimos cargar tus chats."));
    } finally {
      setLoadingChats(false);
    }
  }, [initialParticipantId]);

  useEffect(() => {
    queueMicrotask(() => void loadChats());
  }, [loadChats]);

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }

    let active = true;
    queueMicrotask(() => {
      if (active) {
        setLoadingMessages(true);
        setPage(1);
      }
    });
    void chatService.messages(selectedChatId, 1, PAGE_SIZE)
      .then((result) => {
        if (!active) return;
        setMessages(chronological(result.datos));
        setHasOlder(result.total > result.datos.length);
        setError(null);
      })
      .catch((reason) => {
        if (active) {
          setError(errorMessage(reason, "No pudimos cargar los mensajes."));
        }
      })
      .finally(() => {
        if (active) setLoadingMessages(false);
      });

    socketRef.current?.emit("chat:unirse", { chatId: selectedChatId });
    return () => { active = false; };
  }, [selectedChatId]);

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) return;

    const socket = io(`${env.API_ORIGIN}/chat`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (activeChatRef.current) {
        socket.emit("chat:unirse", { chatId: activeChatRef.current });
      }
    });
    socket.on("mensaje:nuevo", (incoming: ChatMessage) => {
      setChats((current) => {
        const changed = current.find((item) => item.id === incoming.chatId);
        return changed
          ? [{ ...changed, updatedAt: incoming.fecha }, ...current.filter((item) => item.id !== changed.id)]
          : current;
      });
      if (incoming.chatId !== activeChatRef.current) return;
      setMessages((current) =>
        current.some((message) => message.id === incoming.id)
          ? current
          : chronological([...current, { ...incoming, deliveryStatus: "sent" }]),
      );
    });

    return () => {
      socketRef.current = null;
      socket.disconnect();
    };
  }, []);

  const selectChat = useCallback((chatId: number | null) => {
    setSelectedChatId(chatId);
    if (chatId === null) setMessages([]);
    setError(null);
  }, []);

  const loadOlder = useCallback(async () => {
    if (!selectedChatId || loadingOlder || !hasOlder) return;
    setLoadingOlder(true);
    try {
      const nextPage = page + 1;
      const result = await chatService.messages(selectedChatId, nextPage, PAGE_SIZE);
      setMessages((current) => chronological([
        ...result.datos.filter((item) => !current.some((message) => message.id === item.id)),
        ...current,
      ]));
      setPage(nextPage);
      setHasOlder(result.total > nextPage * result.limite);
    } catch (reason) {
      setError(errorMessage(reason, "No pudimos cargar mensajes anteriores."));
    } finally {
      setLoadingOlder(false);
    }
  }, [hasOlder, loadingOlder, page, selectedChatId]);

  const send = useCallback(async (content: string, retryClientId?: string) => {
    if (!selectedChatId) return false;
    const cleanContent = content.trim();
    if (!cleanContent) return false;
    const clientId = retryClientId ?? crypto.randomUUID();
    const optimistic: ChatMessage = {
      id: -Date.now(),
      chatId: selectedChatId,
      remitenteId: -1,
      contenido: cleanContent,
      fecha: new Date().toISOString(),
      clientId,
      deliveryStatus: "sending",
    };
    setMessages((current) => retryClientId
      ? current.map((item) => item.clientId === clientId ? optimistic : item)
      : [...current, optimistic]);

    try {
      const saved = await chatService.send(selectedChatId, cleanContent);
      setMessages((current) => chronological([
        ...current.filter((item) => item.clientId !== clientId && item.id !== saved.id),
        { ...saved, deliveryStatus: "sent" },
      ]));
      setChats((current) => {
        const changed = current.find((item) => item.id === selectedChatId);
        return changed
          ? [{ ...changed, updatedAt: saved.fecha }, ...current.filter((item) => item.id !== selectedChatId)]
          : current;
      });
      return true;
    } catch {
      setMessages((current) => current.map((item) =>
        item.clientId === clientId ? { ...item, deliveryStatus: "error" } : item,
      ));
      return false;
    }
  }, [selectedChatId]);

  return {
    chats, selectedChatId, messages, loadingChats, loadingMessages,
    loadingOlder, hasOlder, error, selectChat, loadOlder, send, reload: loadChats,
  };
}
