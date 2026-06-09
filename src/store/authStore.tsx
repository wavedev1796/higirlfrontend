"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../features/auth/types";

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
    const token = localStorage.getItem("higirl_token");
    if (token) {
      // Aquí se podría validar el token o cargar el perfil
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("higirl_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("higirl_token");
  };

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
