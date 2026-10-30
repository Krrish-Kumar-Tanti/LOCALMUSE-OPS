import { executeTool, type QlooMcpEnvelope } from "../mcp/executor.js";
import type {
  QlooInsightsEntityType,
  LocationInsightsResult,
  AudienceComparisonResult,
  LocalTrendsResult,
  RecommendAndRankResult,
  BusinessProfileInput,
  BusinessGoalInput,
  QlooTagRecord,
  QlooPlaceRecord,
  ResolvedLocality,
  RankedOptionRecord
} from "./qloo-types.js";

/**
 * Valid Qloo Insights entity types allowed by the canonical schema.
 */
const VALID_INSIGHTS_ENTITY_TYPES: Set<string> = new Set([
  "artist",
  "book",
  "brand",
  "movie",
  "person",
  "place",
  "podcast",
  "tv_show",
  "videogame"
]);

/**
 * Maps a natural language category or keyword to a valid Qloo Insights entity type.
 * Never passes arbitrary or unvalidated strings to Qloo tools.
 */
function inferInsightsEntityType(input?: string): QlooInsightsEntityType {
  if (!input) return "place";
  const lower = input.toLowerCase().trim();

  if (VALID_INSIGHTS_ENTITY_TYPES.has(lower)) {
    return lower as QlooInsightsEntityType;
  }

  if (/coffee|café|cafe|restaurant|bar|bakery|diner|roaster|venue|shop|store|boutique|pub|club|hotel|bistro|place|park/.test(lower)) {
    return "place";
  }
  if (/brand|apparel|clothing|fashion|retail|product|footwear|athletic|gear/.test(lower)) {
    return "brand";
  }
  if (/artist|music|band|musician|singer|producer|dj/.test(lower)) {
    return "artist";
  }
  if (/movie|film|cinema/.test(lower)) {
    return "movie";
  }
  if (/book|author|literature|novel|publishing/.test(lower)) {
    return "book";
  }
  if (/game|gaming|videogame/.test(lower)) {
    return "videogame";
  }
  if (/podcast|show|audio/.test(lower)) {
    return "podcast";
  }
  if (/tv|series|television/.test(lower)) {
    return "tv_show";
  }
  if (/person|celebrity|creator/.test(lower)) {
    return "person";
  }

  return "place";
}

/**
 * Extracts a clean string identifier (name, id, or string representation) from a tool result item.
 */
function extractEntityIdentifier(item: unknown): string | undefined {
  if (typeof item === "string" && item.trim()) {
    return item.trim();
  }
  if (item && typeof item === "object") {
    const rec = item as Record<string, unknown>;
    if (typeof rec.name === "string" && rec.name.trim()) return rec.name.trim();
    if (typeof rec.id === "string" && rec.id.trim()) return rec.id.trim();
    if (typeof rec.urn === "string" && rec.urn.trim()) return rec.urn.trim();
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// 1. Location Insights
// ---------------------------------------------------------------------------

/**
 * Generates cultural location insights for a business type and locality.
 *
 * Workflow:
 * 1. Resolve business type concept into stable Qloo tags via `qloo_find_tags`.
 * 2. Discover related cultural places via `qloo_recommend` with target_type: "place",
 *    signal_location, filter_location, and resolved signal_tags.
 * 3. Enrich top place entities with characterizing cultural concepts via `qloo_entity_tags`.
 */
export async function getLocationInsights(
  location: string,
  businessType: string
): Promise<QlooMcpEnvelope<LocationInsightsResult>> {
  const loc = (location || "").trim();
  const bType = (businessType || "").trim();

  if (!loc || !bType) {
    return {
      status: "needs_input",
      summary: "Both 'location' and 'businessType' are required to generate location insights.",
      results: [],
      result_count: 0
    };
  }

  // Step 1: Resolve business type concept into tags
  const tagEnvelope = await executeTool<QlooTagRecord>("qloo_find_tags", {
    query: bType,
    semantic: true,
    limit: 5
  });

  if (tagEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Failed to resolve tags for '${bType}': ${tagEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: tagEnvelope.error,
      execution: tagEnvelope.execution,
      provenance: tagEnvelope.provenance
    };
  }

  // Extract tag identifiers / URNs
  const resolvedTags: QlooTagRecord[] = tagEnvelope.results;
  const tagUrns: string[] = resolvedTags
    .map((t) => (typeof t.urn === "string" ? t.urn : typeof t.id === "string" ? t.id : typeof t.name === "string" ? t.name : undefined))
    .filter((u): u is string => Boolean(u))
    .slice(0, 10);

  // Step 2: Query recommendations for places matching location and tags
  const recommendArgs: Record<string, unknown> = {
    target_type: "place",
    signal_location: loc,
    filter_location: loc,
    explain: true,
    limit: 10
  };

  if (tagUrns.length > 0) {
    recommendArgs.signal_tags = tagUrns;
    recommendArgs.signal_tags_operator = "union";
  }

  const recEnvelope = await executeTool<QlooPlaceRecord>("qloo_recommend", recommendArgs);

  if (recEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Place recommendation query failed for '${bType}' in '${loc}': ${recEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: recEnvelope.error,
      execution: recEnvelope.execution,
      provenance: recEnvelope.provenance
    };
  }

  if (recEnvelope.status === "empty" || recEnvelope.results.length === 0) {
    return {
      status: "empty",
      summary: `No places discovered for '${bType}' in '${loc}' with the requested signal criteria.`,
      results: [],
      result_count: 0,
      execution: recEnvelope.execution,
      provenance: recEnvelope.provenance
    };
  }

  const places: QlooPlaceRecord[] = recEnvelope.results;

  // Step 3: Enrich top place entities with characterizing concepts via qloo_entity_tags
  const topPlaceIdentifiers = places
    .map((p) => extractEntityIdentifier(p))
    .filter((id): id is string => Boolean(id))
    .slice(0, 5);

  const characterizingConcepts: Array<{ entityId: string; entityName?: string; tags: QlooTagRecord[] }> = [];

  if (topPlaceIdentifiers.length > 0) {
    const entityTagsEnvelope = await executeTool<{ entity?: string; tags?: QlooTagRecord[] }>(
      "qloo_entity_tags",
      {
        entities: topPlaceIdentifiers,
        entity_type: "place",
        limit: 5
      }
    );

    if (entityTagsEnvelope.status === "ok" && Array.isArray(entityTagsEnvelope.results)) {
      for (const item of entityTagsEnvelope.results) {
        if (item && typeof item === "object") {
          const entityKey = item.entity || "unknown";
          const tags = Array.isArray(item.tags) ? item.tags : [];
          characterizingConcepts.push({
            entityId: entityKey,
            tags
          });
        }
      }
    }
  }

  const insightsResult: LocationInsightsResult = {
    location: loc,
    businessType: bType,
    resolvedTags,
    places,
    characterizingConcepts,
    analysisSummary: recEnvelope.summary || `Discovered ${places.length} cultural place anchors for ${bType} in ${loc}.`
  };

  return {
    status: recEnvelope.status,
    summary: insightsResult.analysisSummary,
    results: [insightsResult],
    result_count: 1,
    metadata: {
      source: "live_qloo_mcp",
      toolChain: ["qloo_find_tags", "qloo_recommend", "qloo_entity_tags"],
      timestamp: new Date().toISOString()
    },
    execution: recEnvelope.execution,
    provenance: recEnvelope.provenance
  };
}

// ---------------------------------------------------------------------------
// 2. Audience Comparison
// ---------------------------------------------------------------------------

/**
 * Compares cultural audiences between two locations.
 *
 * Workflow:
 * 1. Resolve both localities into verified Qloo locality entities using `qloo_describe`.
 * 2. Pass verified entity signals into `qloo_compare_audiences` with target_type.
 * Never passes raw unverified city strings as signal groups.
 */
export async function compareAudiences(
  locationA: string,
  locationB: string,
  targetCategory?: QlooInsightsEntityType
): Promise<QlooMcpEnvelope<AudienceComparisonResult>> {
  const locA = (locationA || "").trim();
  const locB = (locationB || "").trim();
  const targetType = targetCategory && VALID_INSIGHTS_ENTITY_TYPES.has(targetCategory)
    ? targetCategory
    : "brand";

  if (!locA || !locB) {
    return {
      status: "needs_input",
      summary: "Two locations must be provided to compare audiences.",
      results: [],
      result_count: 0
    };
  }

  // Step 1: Resolve both localities via qloo_describe
  const [descA, descB] = await Promise.all([
    executeTool<Record<string, unknown>>("qloo_describe", { entity: locA, type: "locality" }),
    executeTool<Record<string, unknown>>("qloo_describe", { entity: locB, type: "locality" })
  ]);

  if (descA.status === "error") {
    return {
      status: "error",
      summary: `Failed to resolve locality for '${locA}': ${descA.summary}`,
      results: [],
      result_count: 0,
      error: descA.error
    };
  }

  if (descB.status === "error") {
    return {
      status: "error",
      summary: `Failed to resolve locality for '${locB}': ${descB.summary}`,
      results: [],
      result_count: 0,
      error: descB.error
    };
  }

  // Extract resolved identifiers
  const entityA = extractEntityIdentifier(descA.results[0]) || locA;
  const entityB = extractEntityIdentifier(descB.results[0]) || locB;

  const marketA: ResolvedLocality = {
    input: locA,
    entityId: entityA,
    name: typeof descA.results[0]?.name === "string" ? descA.results[0].name : locA,
    type: "locality",
    metadata: descA.results[0]
  };

  const marketB: ResolvedLocality = {
    input: locB,
    entityId: entityB,
    name: typeof descB.results[0]?.name === "string" ? descB.results[0].name : locB,
    type: "locality",
    metadata: descB.results[0]
  };

  // Step 2: Compare audiences with verified locality signals
  const compareEnvelope = await executeTool<unknown>("qloo_compare_audiences", {
    group_a: [entityA],
    group_b: [entityB],
    target_type: targetType,
    limit: 10
  });

  if (compareEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Audience comparison failed: ${compareEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: compareEnvelope.error,
      execution: compareEnvelope.execution,
      provenance: compareEnvelope.provenance
    };
  }

  const comparisonResult: AudienceComparisonResult = {
    marketA,
    marketB,
    targetCategory: targetType,
    comparisonResults: compareEnvelope.results,
    divergenceSummary: compareEnvelope.summary
  };

  return {
    status: compareEnvelope.status,
    summary: compareEnvelope.summary || `Contrasted audience preferences between ${locA} and ${locB} across ${targetType}.`,
    results: [comparisonResult],
    result_count: 1,
    metadata: {
      source: "live_qloo_mcp",
      toolChain: ["qloo_describe", "qloo_compare_audiences"],
      timestamp: new Date().toISOString()
    },
    execution: compareEnvelope.execution,
    provenance: compareEnvelope.provenance
  };
}

// ---------------------------------------------------------------------------
// 3. Local Trends
// ---------------------------------------------------------------------------

/**
 * Evaluates cultural trend dynamics over an ISO date range.
 *
 * Workflow:
 * 1. Discover 1–5 candidate cultural entities in the location via `qloo_recommend`.
 * 2. Call `qloo_trends` with the discovered entities, valid entity_type, and ISO dates.
 * Never passes generic raw categories as entity types.
 */
export async function getLocalTrends(
  location: string,
  category: string,
  startDate: string,
  endDate: string
): Promise<QlooMcpEnvelope<LocalTrendsResult>> {
  const loc = (location || "").trim();
  const cat = (category || "").trim();
  const sDate = (startDate || "").trim();
  const eDate = (endDate || "").trim();

  if (!loc || !cat || !sDate || !eDate) {
    return {
      status: "needs_input",
      summary: "Location, category, startDate, and endDate (YYYY-MM-DD) are all required to fetch local trends.",
      results: [],
      result_count: 0
    };
  }

  // Validate ISO date format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(sDate) || !dateRegex.test(eDate)) {
    return {
      status: "error",
      summary: "Both startDate and endDate must be in valid YYYY-MM-DD format.",
      results: [],
      result_count: 0,
      error: {
        code: "INVALID_DATE_FORMAT",
        retryable: false,
        recovery: "Provide dates formatted as YYYY-MM-DD."
      }
    };
  }

  // Map category to valid Qloo entity type
  const entityType = inferInsightsEntityType(cat);

  // Step 1: Discover 1-5 actual local entities via qloo_recommend
  const recEnvelope = await executeTool<Record<string, unknown>>("qloo_recommend", {
    target_type: entityType,
    signal_location: loc,
    filter_location: loc,
    limit: 5
  });

  if (recEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Entity discovery for trend analysis failed in '${loc}': ${recEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: recEnvelope.error,
      execution: recEnvelope.execution,
      provenance: recEnvelope.provenance
    };
  }

  if (recEnvelope.status === "empty" || recEnvelope.results.length === 0) {
    return {
      status: "empty",
      summary: `No local entities found for '${cat}' in '${loc}' to evaluate trend momentum.`,
      results: [],
      result_count: 0,
      execution: recEnvelope.execution,
      provenance: recEnvelope.provenance
    };
  }

  // Extract 1 to 5 seed entity strings
  const seedEntities = recEnvelope.results
    .slice(0, 5)
    .map((item) => ({
      id: extractEntityIdentifier(item),
      name: typeof item.name === "string" ? item.name : undefined
    }))
    .filter((e): e is { id: string; name: string | undefined } => Boolean(e.id));

  if (seedEntities.length === 0) {
    return {
      status: "empty",
      summary: `Unable to extract valid entity identifiers from recommendations in '${loc}'.`,
      results: [],
      result_count: 0
    };
  }

  const entityNamesOrIds = seedEntities.map((e) => e.id);

  // Step 2: Call qloo_trends with valid entities, entity_type, and date range
  const trendsEnvelope = await executeTool<unknown>("qloo_trends", {
    entities: entityNamesOrIds,
    entity_type: entityType,
    start_date: sDate,
    end_date: eDate,
    limit: 10
  });

  if (trendsEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Trend analysis failed: ${trendsEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: trendsEnvelope.error,
      execution: trendsEnvelope.execution,
      provenance: trendsEnvelope.provenance
    };
  }

  const trendsResult: LocalTrendsResult = {
    location: loc,
    requestedCategory: cat,
    inferredEntityType: entityType,
    seedEntities,
    dateRange: {
      startDate: sDate,
      endDate: eDate
    },
    trendMetrics: trendsEnvelope.results
  };

  return {
    status: trendsEnvelope.status,
    summary: trendsEnvelope.summary || `Retrieved trend dynamics for ${seedEntities.length} entities in ${loc}.`,
    results: [trendsResult],
    result_count: 1,
    metadata: {
      source: "live_qloo_mcp",
      toolChain: ["qloo_recommend", "qloo_trends"],
      timestamp: new Date().toISOString()
    },
    execution: trendsEnvelope.execution,
    provenance: trendsEnvelope.provenance
  };
}

// ---------------------------------------------------------------------------
// 4. Recommend & Rank
// ---------------------------------------------------------------------------

/**
 * Two-stage recommendation and ranking pipeline:
 *
 * Workflow:
 * 1. Discovery: Call `qloo_recommend` using profile signals, tags, and location.
 * 2. Ranking: Call `qloo_rank` on the candidate shortlist (1–10 options) against
 *    the specific business profile, demographic, and goal attributes.
 *
 * Never claims Qloo directly interprets natural-language business goals;
 * maps goals strictly to supported demographic and category parameters.
 */
export async function recommendAndRank(
  businessProfile: BusinessProfileInput,
  goal: BusinessGoalInput
): Promise<QlooMcpEnvelope<RecommendAndRankResult>> {
  const profileName = (businessProfile?.name || "").trim();
  const objective = (goal?.objective || "").trim();

  if (!profileName || !objective) {
    return {
      status: "needs_input",
      summary: "Business profile name and goal objective are both required to recommend and rank initiatives.",
      results: [],
      result_count: 0
    };
  }

  // Derive target category
  const targetCategory =
    goal.targetCategory && VALID_INSIGHTS_ENTITY_TYPES.has(goal.targetCategory)
      ? goal.targetCategory
      : inferInsightsEntityType(businessProfile.category || "brand");

  // Step 1: Candidate Discovery via qloo_recommend
  const recommendArgs: Record<string, unknown> = {
    target_type: targetCategory,
    explain: true,
    limit: 10
  };

  if (businessProfile.location?.trim()) {
    recommendArgs.signal_location = businessProfile.location.trim();
  }

  if (Array.isArray(businessProfile.seedSignals) && businessProfile.seedSignals.length > 0) {
    recommendArgs.signals = businessProfile.seedSignals.slice(0, 10);
  }

  if (Array.isArray(businessProfile.vibeKeywords) && businessProfile.vibeKeywords.length > 0) {
    recommendArgs.signal_tags = businessProfile.vibeKeywords.slice(0, 10);
  }

  if (goal.targetDemographic?.trim()) {
    recommendArgs.demographic = goal.targetDemographic.trim();
  }

  if (Array.isArray(goal.includeTags) && goal.includeTags.length > 0) {
    recommendArgs.include_tags = goal.includeTags.slice(0, 10);
  }

  if (Array.isArray(goal.excludeTags) && goal.excludeTags.length > 0) {
    recommendArgs.exclude_tags = goal.excludeTags.slice(0, 10);
  }

  const recEnvelope = await executeTool<Record<string, unknown>>("qloo_recommend", recommendArgs);

  if (recEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Candidate discovery failed: ${recEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: recEnvelope.error,
      execution: recEnvelope.execution,
      provenance: recEnvelope.provenance
    };
  }

  if (recEnvelope.status === "empty" || recEnvelope.results.length === 0) {
    return {
      status: "empty",
      summary: `No candidate options discovered for '${profileName}' aligning with objective '${objective}'.`,
      results: [],
      result_count: 0,
      execution: recEnvelope.execution,
      provenance: recEnvelope.provenance
    };
  }

  // Extract candidate option names / IDs (max 10 for qloo_rank)
  const candidateOptions: string[] = recEnvelope.results
    .map((r) => extractEntityIdentifier(r))
    .filter((opt): opt is string => Boolean(opt))
    .slice(0, 10);

  if (candidateOptions.length === 0) {
    return {
      status: "empty",
      summary: "Could not extract valid candidate names from recommendations to rank.",
      results: [],
      result_count: 0
    };
  }

  // Step 2: Contextual Ranking via qloo_rank
  const rankArgs: Record<string, unknown> = {
    options: candidateOptions,
    option_type: targetCategory
  };

  if (businessProfile.seedSignals && businessProfile.seedSignals.length > 0) {
    rankArgs.signals = businessProfile.seedSignals.slice(0, 10);
  }

  if (businessProfile.location?.trim()) {
    rankArgs.signal_location = businessProfile.location.trim();
  }

  if (goal.targetDemographic?.trim()) {
    rankArgs.demographic = goal.targetDemographic.trim();
  }

  if (goal.includeTags && goal.includeTags.length > 0) {
    rankArgs.include_tags = goal.includeTags.slice(0, 10);
  }

  if (goal.excludeTags && goal.excludeTags.length > 0) {
    rankArgs.exclude_tags = goal.excludeTags.slice(0, 10);
  }

  const rankEnvelope = await executeTool<Record<string, unknown>>("qloo_rank", rankArgs);

  if (rankEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Shortlist ranking failed: ${rankEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: rankEnvelope.error,
      execution: rankEnvelope.execution,
      provenance: rankEnvelope.provenance
    };
  }

  // Format ranked shortlist
  const rankedShortlist: RankedOptionRecord[] = rankEnvelope.results.map((item, idx) => ({
    option: typeof item.name === "string" ? item.name : candidateOptions[idx] || `Option ${idx + 1}`,
    rank: idx + 1,
    score: typeof item.score === "number" ? item.score : undefined,
    context: item
  }));

  const rationale =
    rankEnvelope.summary ||
    `Ranked ${rankedShortlist.length} candidate options for '${profileName}' prioritized for ${targetCategory} affinity.`;

  const finalResult: RecommendAndRankResult = {
    businessName: profileName,
    goalObjective: objective,
    targetCategory,
    resolvedDemographic: goal.targetDemographic,
    candidateOptionsDiscovered: candidateOptions,
    rankedShortlist,
    strategyRationale: rationale
  };

  return {
    status: rankEnvelope.status,
    summary: rationale,
    results: [finalResult],
    result_count: 1,
    metadata: {
      source: "live_qloo_mcp",
      toolChain: ["qloo_recommend", "qloo_rank"],
      timestamp: new Date().toISOString()
    },
    execution: rankEnvelope.execution,
    provenance: rankEnvelope.provenance
  };
}
