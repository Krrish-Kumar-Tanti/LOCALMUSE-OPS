import { Router, type Request, type Response } from "express";
import { parseMode, sendMcpResponse, sendInputError } from "./utils.js";
import { getLocalTrends } from "../services/qloo-service.js";
import { getMockLocalTrends } from "../services/mock-service.js";

export const localTrendsRouter = Router();

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * POST /api/local-trends
 * Evaluates cultural momentum indices and time-series trends over a date range.
 */
localTrendsRouter.post("/", async (req: Request, res: Response) => {
  const { mode: rawMode, location, category, startDate, endDate } = req.body ?? {};

  const mode = parseMode(rawMode);
  if (!mode) {
    return sendInputError(res, "Field 'mode' is required and must be either 'demo' or 'live'.");
  }

  if (typeof location !== "string" || !location.trim()) {
    return sendInputError(res, "Field 'location' is required and must be a non-empty string.", mode);
  }

  if (typeof category !== "string" || !category.trim()) {
    return sendInputError(res, "Field 'category' is required and must be a non-empty string.", mode);
  }

  if (typeof startDate !== "string" || !DATE_REGEX.test(startDate.trim())) {
    return sendInputError(res, "Field 'startDate' is required and must be in YYYY-MM-DD format.", mode);
  }

  if (typeof endDate !== "string" || !DATE_REGEX.test(endDate.trim())) {
    return sendInputError(res, "Field 'endDate' is required and must be in YYYY-MM-DD format.", mode);
  }

  const cleanLocation = location.trim();
  const cleanCategory = category.trim();
  const cleanStartDate = startDate.trim();
  const cleanEndDate = endDate.trim();

  try {
    if (mode === "demo") {
      const envelope = getMockLocalTrends(cleanLocation, cleanCategory, {
        startDate: cleanStartDate,
        endDate: cleanEndDate
      });
      return sendMcpResponse(res, envelope, "demo");
    }

    // Live Qloo MCP Mode
    const envelope = await getLocalTrends(cleanLocation, cleanCategory, cleanStartDate, cleanEndDate);
    return sendMcpResponse(res, envelope, "live");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      status: "error",
      summary: `Internal server failure processing local trends: ${message}`,
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
