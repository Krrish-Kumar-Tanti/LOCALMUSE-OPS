import { Router, type Request, type Response } from "express";
import { parseMode, sendMcpResponse, sendInputError } from "./utils.js";
import { getLocationInsights } from "../services/qloo-service.js";
import { getMockLocationInsights } from "../services/mock-service.js";

export const locationInsightsRouter = Router();

/**
 * POST /api/location-insights
 * Discovers cultural place anchors and characterizing concept tags for a business type and locality.
 */
locationInsightsRouter.post("/", async (req: Request, res: Response) => {
  const { mode: rawMode, location, businessType } = req.body ?? {};

  const mode = parseMode(rawMode);
  if (!mode) {
    return sendInputError(res, "Field 'mode' is required and must be either 'demo' or 'live'.");
  }

  if (typeof location !== "string" || !location.trim()) {
    return sendInputError(res, "Field 'location' is required and must be a non-empty string.", mode);
  }

  if (typeof businessType !== "string" || !businessType.trim()) {
    return sendInputError(res, "Field 'businessType' is required and must be a non-empty string.", mode);
  }

  const cleanLocation = location.trim();
  const cleanBusinessType = businessType.trim();

  try {
    if (mode === "demo") {
      const envelope = getMockLocationInsights(cleanLocation, cleanBusinessType);
      return sendMcpResponse(res, envelope, "demo");
    }

    // Live Qloo MCP Mode
    const envelope = await getLocationInsights(cleanLocation, cleanBusinessType);
    return sendMcpResponse(res, envelope, "live");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      status: "error",
      summary: `Internal server failure processing location insights: ${message}`,
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
