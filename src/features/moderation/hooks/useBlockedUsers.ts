"use client";

import { useCallback, useEffect, useState } from "react";
import { moderationService } from "../services/moderation.service";

/**
 * IDs de usuarias que YO bloqueé (para pintar el estado en el chat y
 * habilitar el desbloqueo). Optimista en block/unblock.
 */
export function useBlockedUsers() {
  const [blockedIds, setBlockedIds] = useState<Set<number>>(new Set());

  const refresh = useCallback(() => {
    moderationService
      .listBlocked()
      .then((list) => setBlockedIds(new Set(list.map((u) => u.id))))
      .catch(() => {
        // ponytail: fallo silencioso — sin estado de bloqueo visible.
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const block = useCallback(async (id: number) => {
    setBlockedIds((prev) => new Set(prev).add(id));
    try {
      await moderationService.block(id);
    } catch (error) {
      setBlockedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      throw error;
    }
  }, []);

  const unblock = useCallback(async (id: number) => {
    setBlockedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    try {
      await moderationService.unblock(id);
    } catch (error) {
      setBlockedIds((prev) => new Set(prev).add(id));
      throw error;
    }
  }, []);

  return { blockedIds, block, unblock, refresh };
}
