"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@/shared/types/user.types";
import { tokenStorage } from "@/infrastructure/storage/tokenStorage";
import { profileService } from "@/features/profile/services/profile.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokenStorage.get()) {
      setUser(null);
      return;
    }

    try {
      const profile = await profileService.getMe();
      setUser({
        id: profile.id,
        email: profile.email,
        firstName: profile.nombre,
        lastName: profile.apellido,
        rol: "user",
        interestsCount: profile.intereses?.length ?? 0,
      });
    } catch {
      tokenStorage.remove();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      refreshUser().finally(() => {
        if (active) setIsLoading(false);
      });
    });

    return () => {
      active = false;
    };
  }, [refreshUser]);

  const login = useCallback((userData: User, token: string) => {
    tokenStorage.set(token);
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.remove();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return context;
}
