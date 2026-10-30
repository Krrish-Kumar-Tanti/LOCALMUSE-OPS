"use client";

import React, { createContext, useContext, useState } from "react";
import {
  getSavedSession,
  saveSession,
  clearSession,
  type UserPersona,
  type UserSession,
} from "./auth";

interface AuthContextType {
  isAuthenticated: boolean;
  userSession: UserSession | null;
  currentPersona: UserPersona | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (persona: UserPersona) => void;
  logout: () => void;
  switchPersona: (persona: UserPersona) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialize from localStorage once during mount
  const [userSession, setUserSession] = useState<UserSession | null>(() => getSavedSession());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = (persona: UserPersona) => {
    const session = saveSession(persona);
    setUserSession(session);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    clearSession();
    setUserSession(null);
  };

  const switchPersona = (persona: UserPersona) => {
    const session = saveSession(persona);
    setUserSession(session);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const value: AuthContextType = {
    isAuthenticated: Boolean(userSession),
    userSession,
    currentPersona: userSession?.user ?? null,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    login,
    logout,
    switchPersona,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
