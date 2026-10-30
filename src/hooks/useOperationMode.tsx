"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { OperationMode } from "@/types";

export interface UseOperationModeReturn {
  mode: OperationMode;
  setMode: (mode: OperationMode) => void;
  toggleMode: () => void;
  isDemo: boolean;
  isLive: boolean;
}

const OperationModeContext = createContext<UseOperationModeReturn | null>(null);

export interface OperationModeProviderProps {
  children: React.ReactNode;
  initialMode?: OperationMode;
  mode?: OperationMode;
  onToggleMode?: () => void;
  onModeChange?: (mode: OperationMode) => void;
}

export function OperationModeProvider({
  children,
  initialMode = "demo",
  mode: controlledMode,
  onToggleMode: controlledToggleMode,
  onModeChange: controlledOnModeChange
}: OperationModeProviderProps) {
  const [internalMode, setInternalMode] = useState<OperationMode>(initialMode);

  const mode = controlledMode !== undefined ? controlledMode : internalMode;

  const setMode = useCallback((newMode: OperationMode) => {
    if (controlledOnModeChange) {
      controlledOnModeChange(newMode);
    }
    setInternalMode(newMode);
  }, [controlledOnModeChange]);

  const toggleMode = useCallback(() => {
    if (controlledToggleMode) {
      controlledToggleMode();
      return;
    }
    setInternalMode((current) => (current === "demo" ? "live" : "demo"));
  }, [controlledToggleMode]);

  const value = useMemo<UseOperationModeReturn>(() => ({
    mode,
    setMode,
    toggleMode,
    isDemo: mode === "demo",
    isLive: mode === "live"
  }), [mode, setMode, toggleMode]);

  return (
    <OperationModeContext.Provider value={value}>
      {children}
    </OperationModeContext.Provider>
  );
}

/**
 * React hook for consuming or managing the operation mode (Demo vs Live).
 * If used inside an OperationModeProvider, shares context across the entire app tree.
 * If used standalone, manages independent local state with default fallback.
 */
export function useOperationMode(fallbackInitialMode: OperationMode = "demo"): UseOperationModeReturn {
  const context = useContext(OperationModeContext);
  const [localMode, setLocalMode] = useState<OperationMode>(fallbackInitialMode);

  const localSetMode = useCallback((newMode: OperationMode) => {
    setLocalMode(newMode);
  }, []);

  const localToggleMode = useCallback(() => {
    setLocalMode((curr) => (curr === "demo" ? "live" : "demo"));
  }, []);

  if (context) {
    return context;
  }

  return {
    mode: localMode,
    setMode: localSetMode,
    toggleMode: localToggleMode,
    isDemo: localMode === "demo",
    isLive: localMode === "live"
  };
}
