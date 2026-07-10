"use client";

import { useEffect, useState } from "react";
import { connectionsService } from "@/features/connections";

/**
 * IDs de usuarias con las que ya existe una conexión (en cualquier estado).
 * El backend rechaza crear una conexión duplicada sin importar el estado, así
 * que basta con saber que existe para deshabilitar el botón "Conectar".
 */
export function useConnectedUserIds(): Set<number> {
  const [ids, setIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;
    connectionsService
      .list()
      .then((connections) => {
        if (!active) return;
        // Se agregan ambos extremos; la usuaria propia nunca aparece en Descubrir.
        const set = new Set<number>();
        connections.forEach((c) => {
          set.add(c.origenId);
          set.add(c.destinoId);
        });
        setIds(set);
      })
      .catch(() => {
        // ponytail: fallo silencioso — el botón simplemente muestra "Conectar".
      });
    return () => {
      active = false;
    };
  }, []);

  return ids;
}
