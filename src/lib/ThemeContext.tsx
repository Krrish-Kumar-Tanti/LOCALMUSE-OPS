"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "localmuse_theme";

function getSystemPreference(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === "light" || val === "dark" || val === "system") {
      return val;
    }
  } catch {
    // LocalStorage unavailable
  }
  return "system";
}

function applyThemeToDocument(resolved: ResolvedTheme, explicitMode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.setAttribute("data-theme", explicitMode === "system" ? resolved : explicitMode);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    const initial = getStoredTheme();
    return initial === "system" ? getSystemPreference() : initial;
  });

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignored
    }

    const nextResolved: ResolvedTheme = mode === "system" ? getSystemPreference() : mode;
    setResolvedTheme(nextResolved);
    applyThemeToDocument(nextResolved, mode);
  }, []);

  // Sync with OS preferences when in system mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const stored = getStoredTheme();
      if (stored === "system") {
        const nextResolved = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        applyThemeToDocument(nextResolved, "system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Initial mount: ensure document attributes match resolved theme
    const currentStored = getStoredTheme();
    const currentResolved = currentStored === "system" ? (mediaQuery.matches ? "dark" : "light") : currentStored;
    applyThemeToDocument(currentResolved, currentStored);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
