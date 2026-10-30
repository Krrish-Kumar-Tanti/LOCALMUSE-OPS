"use client";

import { useCallback } from "react";
import { useAsyncWorkflow } from "./useAsyncWorkflow";
import { fetchLocationInsights, type ApiClientError } from "@/services/api-client";
import type { LocationInsightsRequest, LocationInsightsData, QlooMcpEnvelope } from "@/types";

export interface UseLocationInsightsReturn {
  data: QlooMcpEnvelope<LocationInsightsData> | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (params: LocationInsightsRequest) => Promise<QlooMcpEnvelope<LocationInsightsData> | null>;
  reset: () => void;
}

/**
 * React hook for fetching and managing location intelligence workflows.
 */
export function useLocationInsights(): UseLocationInsightsReturn {
  const action = useCallback(
    (params: LocationInsightsRequest, signal?: AbortSignal) => fetchLocationInsights(params, signal),
    []
  );

  return useAsyncWorkflow<QlooMcpEnvelope<LocationInsightsData>, [LocationInsightsRequest]>(action);
}
