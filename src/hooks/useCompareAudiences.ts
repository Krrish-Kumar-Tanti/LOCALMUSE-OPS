"use client";

import { useCallback } from "react";
import { useAsyncWorkflow } from "./useAsyncWorkflow";
import { fetchCompareAudiences, type ApiClientError } from "@/services/api-client";
import type { CompareAudiencesRequest, AudienceComparisonData, QlooMcpEnvelope } from "@/types";

export interface UseCompareAudiencesReturn {
  data: QlooMcpEnvelope<AudienceComparisonData> | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (params: CompareAudiencesRequest) => Promise<QlooMcpEnvelope<AudienceComparisonData> | null>;
  reset: () => void;
}

/**
 * React hook for comparing audience affinities and differentiating traits between markets.
 */
export function useCompareAudiences(): UseCompareAudiencesReturn {
  const action = useCallback(
    (params: CompareAudiencesRequest, signal?: AbortSignal) => fetchCompareAudiences(params, signal),
    []
  );

  return useAsyncWorkflow<QlooMcpEnvelope<AudienceComparisonData>, [CompareAudiencesRequest]>(action);
}
