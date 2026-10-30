import { Router, type Request, type Response } from "express";
import { parseMode, sendMcpResponse, sendInputError } from "./utils.js";
import { compareAudiences } from "../services/qloo-service.js";
import { getMockAudienceComparison } from "../services/mock-service.js";
import type { QlooInsightsEntityType } from "../services/qloo-types.js";

export const compareAudiencesRouter = Router();

/**
 * POST /api/compare-audiences
 * Contrasts cultural audience affinities and differentiating traits between two markets.
 */
compareAudiencesRouter.post("/", async (req: Request, res: Response) => {
  const { mode: rawMode, locationA, locationB, targetCategory } = req.body ?? {};

  const mode = parseMode(rawMode);
  if (!mode) {
    return sendInputError(res, "Field 'mode' is required and must be either 'demo' or 'live'.");
  }

  if (typeof locationA !== "string" || !locationA.trim()) {
    return sendInputError(res, "Field 'locationA' is required and must be a non-empty string.", mode);
  }

  if (typeof locationB !== "string" || !locationB.trim()) {
    return sendInputError(res, "Field 'locationB' is required and must be a non-empty string.", mode);
  }

  const cleanLocationA = locationA.trim();
  const cleanLocationB = locationB.trim();
  const validCategory = typeof targetCategory === "string" ? (targetCategory.trim() as QlooInsightsEntityType) : undefined;

  try {
    if (mode === "demo") {
      const envelope = getMockAudienceComparison(cleanLocationA, cleanLocationB, validCategory);
      return sendMcpResponse(res, envelope, "demo");
    }

    // Live Qloo MCP Mode
    const envelope = await compareAudiences(cleanLocationA, cleanLocationB, validCategory);
    return sendMcpResponse(res, envelope, "live");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      status: "error",
      summary: `Internal server failure processing audience comparison: ${message}`,
      results: [],
      result_count: 0,
      metadata: {
        isDemo: mode === "demo",
        source: mode === "demo" ? "curated_mock_fixture" : "live_qloo_mcp",
        timestamp: new Date().toISOString()
      }
    });
  }
});
