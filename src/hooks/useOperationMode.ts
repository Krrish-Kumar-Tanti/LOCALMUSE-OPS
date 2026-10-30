"use client";

import { useState, useCallback } from "react";
import type { OperationMode } from "@/types";

export interface UseOperationModeReturn {
  mode: OperationMode;
  setMode: (mode: OperationMode) => void;
  toggleMode: () => void;
  isDemo: boolean;
  isLive: boolean;
}

/**
 * React hook for managing the selected operation mode (Demo vs Live).
 */
export function useOperationMode(initialMode: OperationMode = "demo"): UseOperationModeReturn {
  const [mode, setModeState] = useState<OperationMode>(initialMode);

  const setMode = useCallback((newMode: OperationMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === "demo" ? "live" : "demo"));
  }, []);

  return {
    mode,
    setMode,
    toggleMode,
    isDemo: mode === "demo",
    isLive: mode === "live"
  };
}
