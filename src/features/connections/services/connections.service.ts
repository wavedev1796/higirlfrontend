import { apiClient } from "@/infrastructure/api/client";
import { API_ENDPOINTS } from "@/infrastructure/api/endpoints";
import type { Connection, ConnectionStatus } from "../types";

export const connectionsService = {
  list(status: ConnectionStatus): Promise<Connection[]> {
    const query = new URLSearchParams({ estado: status });
    return apiClient.get<Connection[]>(
      `${API_ENDPOINTS.CONNECTIONS.LIST}?${query.toString()}`,
    );
  },

  send(destinationId: number): Promise<Connection> {
    return apiClient.post<Connection>(API_ENDPOINTS.CONNECTIONS.LIST, {
      destinoId: destinationId,
    });
  },

  respond(
    connectionId: number,
    status: Extract<ConnectionStatus, "aceptada" | "rechazada">,
  ): Promise<Connection> {
    return apiClient.patch<Connection>(
      API_ENDPOINTS.CONNECTIONS.DETAIL(connectionId),
      { estado: status },
    );
  },
};
