/**
 * Auth feature — AuthProvider.
 *
 * React context for authentication state. Delegates all token
 * persistence to `infrastructure/storage/tokenStorage`.
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/shared/types/user.types";
import { tokenStorage } from "@/infrastructure/storage/tokenStorage";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) {
      // TODO: validate token or load profile from API
    }
  }, []);

  const login = useCallback((userData: User, token: string) => {
    setUser(userData);
    tokenStorage.set(token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    tokenStorage.remove();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return context;
}
