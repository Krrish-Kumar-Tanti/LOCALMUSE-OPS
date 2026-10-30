"use client";

import { useCallback } from "react";
import { useAsyncWorkflow } from "./useAsyncWorkflow";
import { fetchRecommendations, type ApiClientError } from "@/services/api-client";
import type { RecommendationsRequest, RecommendationsData, QlooMcpEnvelope } from "@/types";

export interface UseRecommendationsReturn {
  data: QlooMcpEnvelope<RecommendationsData> | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (params: RecommendationsRequest) => Promise<QlooMcpEnvelope<RecommendationsData> | null>;
  reset: () => void;
}

/**
 * React hook for generating and ranking business initiatives against an operational goal.
 */
export function useRecommendations(): UseRecommendationsReturn {
  const action = useCallback(
    (params: RecommendationsRequest, signal?: AbortSignal) => fetchRecommendations(params, signal),
    []
  );

  return useAsyncWorkflow<QlooMcpEnvelope<RecommendationsData>, [RecommendationsRequest]>(action);
}
