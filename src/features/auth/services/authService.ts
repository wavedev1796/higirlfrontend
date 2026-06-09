import { fetchApi } from "../../../lib/api";
import { API_ENDPOINTS } from "../../../constants/routes";
import { LoginResponse, RegisterResponse } from "../types";

type LoginCredentials = Record<string, unknown>;
type RegisterUserData = Record<string, unknown> & {
  rol?: string;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterUserData): Promise<RegisterResponse> => {
    return fetchApi<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        rol: userData.rol ?? "user",
      }),
    });
  },

  getProfile: async (): Promise<unknown> => {
    return fetchApi<unknown>(API_ENDPOINTS.AUTH.ME);
  },
};
