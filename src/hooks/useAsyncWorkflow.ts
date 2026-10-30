"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ApiClientError } from "@/services/api-client";

export interface AsyncWorkflowState<T> {
  data: T | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic core hook for executing async API workflows.
 * Guarantees race-condition prevention, AbortController cleanup on unmount,
 * and consistent state updates.
 */
export function useAsyncWorkflow<T, P extends unknown[]>(
  action: (...args: [...P, AbortSignal?]) => Promise<T>
): {
  data: T | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiClientError | Error | null>(null);

  // Track request version to avoid out-of-order race conditions
  const requestIdRef = useRef<number>(0);
  // AbortController for in-flight cancellation
  const abortControllerRef = useRef<AbortController | null>(null);
  // Unmount protection ref
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    requestIdRef.current += 1;
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      // Abort previous in-flight request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentRequestId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        const result = await action(...args, controller.signal);

        // Discard result if newer request has started or component unmounted
        if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
          return null;
        }

        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        // Ignore aborted errors
        if (err instanceof DOMException && err.name === "AbortError") {
          return null;
        }

        if (!isMountedRef.current || currentRequestId !== requestIdRef.current) {
          return null;
        }

        const normalizedError = err instanceof Error ? err : new Error(String(err));
        setData(null);
        setError(normalizedError);
        setLoading(false);
        return null;
      }
    },
    [action]
  );

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}
