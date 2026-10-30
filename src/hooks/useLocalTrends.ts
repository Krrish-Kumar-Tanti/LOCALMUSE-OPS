"use client";

import { useCallback } from "react";
import { useAsyncWorkflow } from "./useAsyncWorkflow";
import { fetchLocalTrends, type ApiClientError } from "@/services/api-client";
import type { LocalTrendsRequest, LocalTrendsData, QlooMcpEnvelope } from "@/types";

export interface UseLocalTrendsReturn {
  data: QlooMcpEnvelope<LocalTrendsData> | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (params: LocalTrendsRequest) => Promise<QlooMcpEnvelope<LocalTrendsData> | null>;
  reset: () => void;
}

/**
 * React hook for querying time-series momentum trends and geographic hotspot density.
 */
export function useLocalTrends(): UseLocalTrendsReturn {
  const action = useCallback(
    (params: LocalTrendsRequest, signal?: AbortSignal) => fetchLocalTrends(params, signal),
    []
  );

  return useAsyncWorkflow<QlooMcpEnvelope<LocalTrendsData>, [LocalTrendsRequest]>(action);
}
