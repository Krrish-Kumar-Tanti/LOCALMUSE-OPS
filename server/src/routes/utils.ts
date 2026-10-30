import type { Response } from "express";
import type { QlooMcpEnvelope } from "../mcp/executor.js";

export type OperationMode = "demo" | "live";

/**
 * Validates the requested operation mode.
 */
export function parseMode(rawMode: unknown): OperationMode | null {
  if (rawMode === "demo" || rawMode === "live") {
    return rawMode;
  }
  return null;
}

/**
 * Sends a structured JSON response maintaining the official Qloo MCP envelope,
 * ensuring explicit demo/live flags and appropriate HTTP status codes.
 */
export function sendMcpResponse(
  res: Response,
  envelope: QlooMcpEnvelope,
  mode: OperationMode
): Response {
  const isDemo = mode === "demo";

  // Enforce explicit isDemo indicator in response metadata
  const metadata = {
    ...envelope.metadata,
    isDemo,
    source: isDemo ? envelope.metadata?.source || "curated_mock_fixture" : "live_qloo_mcp",
    timestamp: envelope.metadata?.timestamp || new Date().toISOString()
  };

  const payload: QlooMcpEnvelope = {
    ...envelope,
    metadata
  };

  // Map envelope status to standard HTTP status codes
  if (envelope.status === "error") {
    if (envelope.error?.code === "QLOO_AUTH") {
      return res.status(401).json(payload);
    }
    return res.status(502).json(payload);
  }

  if (envelope.status === "needs_input") {
    return res.status(400).json(payload);
  }

  // "ok", "empty", "partial", "degraded"
  return res.status(200).json(payload);
}

/**
 * Creates a standardized 400 Bad Request error envelope for missing or invalid inputs.
 */
export function sendInputError(
  res: Response,
  summary: string,
  mode: OperationMode = "live"
): Response {
  const isDemo = mode === "demo";
  return res.status(400).json({
    status: "needs_input",
    summary,
    results: [],
    result_count: 0,
    metadata: {
      isDemo,
      source: isDemo ? "curated_mock_fixture" : "validation",
      timestamp: new Date().toISOString()
    }
  });
}
