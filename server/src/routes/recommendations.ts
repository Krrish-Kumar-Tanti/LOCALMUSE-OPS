import { Router, type Request, type Response } from "express";
import { parseMode, sendMcpResponse, sendInputError } from "./utils.js";
import { recommendAndRank } from "../services/qloo-service.js";
import { getMockRecommendations } from "../services/mock-service.js";
import type { BusinessProfileInput, BusinessGoalInput } from "../services/qloo-types.js";

export const recommendationsRouter = Router();

/**
 * POST /api/recommendations
 * Generates and ranks tactical business initiatives against an operational goal.
 */
recommendationsRouter.post("/", async (req: Request, res: Response) => {
  const { mode: rawMode, businessProfile, goal } = req.body ?? {};

  const mode = parseMode(rawMode);
  if (!mode) {
    return sendInputError(res, "Field 'mode' is required and must be either 'demo' or 'live'.");
  }

  // Validate businessProfile
  let normalizedProfile: BusinessProfileInput;
  if (typeof businessProfile === "string" && businessProfile.trim()) {
    normalizedProfile = { name: businessProfile.trim() };
  } else if (businessProfile && typeof businessProfile === "object" && typeof businessProfile.name === "string" && businessProfile.name.trim()) {
    normalizedProfile = {
      name: businessProfile.name.trim(),
      location: typeof businessProfile.location === "string" ? businessProfile.location.trim() : undefined,
      category: typeof businessProfile.category === "string" ? businessProfile.category.trim() : undefined,
      seedSignals: Array.isArray(businessProfile.seedSignals) ? businessProfile.seedSignals : undefined,
      vibeKeywords: Array.isArray(businessProfile.vibeKeywords) ? businessProfile.vibeKeywords : undefined
    };
  } else {
    return sendInputError(
      res,
      "Field 'businessProfile' is required and must either be a non-empty string or an object with a 'name' property.",
      mode
    );
  }

  // Validate goal
  let normalizedGoal: BusinessGoalInput;
  if (typeof goal === "string" && goal.trim()) {
    normalizedGoal = { objective: goal.trim() };
  } else if (goal && typeof goal === "object" && typeof goal.objective === "string" && goal.objective.trim()) {
    normalizedGoal = {
      objective: goal.objective.trim(),
      targetDemographic: typeof goal.targetDemographic === "string" ? goal.targetDemographic.trim() : undefined,
      targetCategory: typeof goal.targetCategory === "string" ? goal.targetCategory : undefined,
      includeTags: Array.isArray(goal.includeTags) ? goal.includeTags : undefined,
      excludeTags: Array.isArray(goal.excludeTags) ? goal.excludeTags : undefined
    };
  } else {
    return sendInputError(
      res,
      "Field 'goal' is required and must either be a non-empty string or an object with an 'objective' property.",
      mode
    );
  }

  try {
    if (mode === "demo") {
      const envelope = getMockRecommendations(normalizedProfile, normalizedGoal);
      return sendMcpResponse(res, envelope, "demo");
    }

    // Live Qloo MCP Mode
    const envelope = await recommendAndRank(normalizedProfile, normalizedGoal);
    return sendMcpResponse(res, envelope, "live");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      status: "error",
      summary: `Internal server failure processing recommendations: ${message}`,
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
