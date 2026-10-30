"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBackendHealth, type ApiClientError } from "@/services/api-client";
import type { BackendHealthResponse, OperationMode } from "@/types";

export interface UseBackendHealthOptions {
  autoFetch?: boolean;
}

export interface UseBackendHealthReturn {
  health: BackendHealthResponse | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  isLiveAvailable: boolean;
  isMcpConnected: boolean;
  recommendedMode: OperationMode;
  refetch: () => Promise<BackendHealthResponse | null>;
}

/**
 * React hook for checking and polling backend health, MCP connectivity, and mode availability.
 */
export function useBackendHealth(options: UseBackendHealthOptions = {}): UseBackendHealthReturn {
  const { autoFetch = true } = options;

  const [health, setHealth] = useState<BackendHealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<ApiClientError | Error | null>(null);

  const isMountedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHealth = useCallback(async (): Promise<BackendHealthResponse | null> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await getBackendHealth(controller.signal);
      if (!isMountedRef.current) return null;

      setHealth(data);
      setLoading(false);
      return data;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null;
      }
      if (!isMountedRef.current) return null;

      const normalizedError = err instanceof Error ? err : new Error(String(err));
      setError(normalizedError);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (!autoFetch) return;

    let isSubscribed = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    getBackendHealth(controller.signal)
      .then((data) => {
        if (isSubscribed && isMountedRef.current) {
          setHealth(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (isSubscribed && isMountedRef.current) {
          const normalizedError = err instanceof Error ? err : new Error(String(err));
          setError(normalizedError);
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
      isMountedRef.current = false;
      controller.abort();
    };
  }, [autoFetch]);

  const isLiveAvailable = Boolean(health?.modesAvailable?.live);
  const isMcpConnected = Boolean(health?.mcpConnected);
  const recommendedMode: OperationMode = health?.recommendedMode || "demo";

  return {
    health,
    loading,
    error,
    isLiveAvailable,
    isMcpConnected,
    recommendedMode,
    refetch: fetchHealth
  };
}
