# LocalMuse Ops — Agent Orchestration Architecture

This document details the multi-stage orchestration pipeline inside `server/src/services/agent-orchestrator.ts` and the deterministic synthesizer in `server/src/services/agent-synthesizer.ts`.

---

## 1. Multi-Stage Agent Orchestration Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend Client (useAgentWeeklyPlan)
    participant Route as Express Router (POST /api/agent/weekly-plan)
    participant Orch as Agent Orchestrator (orchestrator.ts)
    participant Mock as Mock Service (mock-service.ts)
    participant Mcp as Qloo Service (qloo-service.ts)
    participant Synth as Grounded Synthesizer (agent-synthesizer.ts)

    %% Request Ingestion
    Client->>Route: POST /api/agent/weekly-plan { mode, businessProfile, operationalGoal }
    Route->>Route: Validate normalized request parameters

    alt Missing Required Input (name, city, category, objective)
        Route-->>Client: HTTP 400 { status: "needs_input", summary: "..." }
    end

    Route->>Orch: orchestrateWeeklyPlan(normalizedRequest)

    %% Mode Branching
    alt Mode === 'demo'
        Orch->>Mock: getMockWeeklyCulturalPlan(businessProfile, operationalGoal)
        Mock-->>Orch: Curated / Adapted Plan Fixture with explicit isDemo flag
    else Mode === 'live'
        Note over Orch,Mcp: STAGE 1: Location Intelligence Discovery
        Orch->>Mcp: getLocationInsights(city, category, neighborhood)
        Mcp->>Mcp: qloo_find_tags → qloo_recommend(place) → qloo_entity_tags
        alt Stage 1 Fails (Auth or Network)
            Mcp-->>Orch: Error Envelope (QLOO_AUTH or QLOO_MCP_ERROR)
            Orch-->>Route: Fail fast: Abort pipeline
            Route-->>Client: HTTP 401 or HTTP 502 with Error Envelope
        else Stage 1 Succeeds
            Mcp-->>Orch: Stage 1 Results (Anchors, Concept Tags, Demographics)
        end

        Note over Orch,Mcp: STAGE 2: Local Trends & Momentum Curves
        Orch->>Mcp: getLocalTrends(city, category, dateRange)
        Mcp->>Mcp: qloo_recommend(seeds) → qloo_trends
        alt Stage 2 Times Out or Empty
            Mcp-->>Orch: Partial / Empty Result
            Orch->>Orch: Graceful degradation: Mark Stage 2 as degraded (continue pipeline)
        else Stage 2 Succeeds
            Mcp-->>Orch: Stage 2 Results (6-Quarter Momentum, Growth Rates)
        end

        Note over Orch,Mcp: STAGE 3: Cross-Market Audience Contrast (Conditional)
        alt Benchmark City Provided
            Orch->>Mcp: compareAudiences(primaryCity, benchmarkCity)
            Mcp->>Mcp: qloo_describe(A & B) → qloo_compare_audiences
            alt Locality Resolution Fails
                Mcp-->>Orch: Partial degradation
                Orch->>Orch: Set audienceDivergence = undefined (continue pipeline)
            else Contrast Succeeds
                Mcp-->>Orch: Stage 3 Results (Shared vs Unique Traits)
            end
        else Benchmark City Omitted
            Orch->>Orch: Skip Stage 3 completely (audienceDivergence = undefined)
        end

        Note over Orch,Mcp: STAGE 4: Tactical Recommendations & Ranking
        Orch->>Mcp: getRecommendations(businessProfile, operationalGoal)
        Mcp->>Mcp: qloo_recommend(candidates) → qloo_rank(against goal profile)
        alt Stage 4 Fails
            Mcp-->>Orch: Error Envelope
            Orch-->>Route: Fail fast: Abort pipeline
            Route-->>Client: HTTP 502 { status: "error", error: { code: "QLOO_MCP_ERROR" } }
        else Stage 4 Succeeds
            Mcp-->>Orch: Stage 4 Results (Ranked Opportunities, Fit Scores, Milestones)
        end

        Note over Orch,Synth: FINAL SYNTHESIS: Deterministic Grounded Plan
        Orch->>Synth: synthesizeWeeklyCulturalPlan(profile, goal, stagedResults, toolsExecuted, 'live')
        Synth->>Synth: Bind Provenance Links (sourceTool, groundingEntityOrTag, URN)
        Synth->>Synth: Enforce liveMode soundscape rule (suppress static artist names)
        Synth->>Synth: Assemble 7-day Monday–Sunday operational rhythm
        Synth-->>Orch: Complete WeeklyCulturalPlanData Envelope
    end

    Orch-->>Route: Structured QlooMcpEnvelope
    Route->>Route: sendMcpResponse() maps envelope status to HTTP 200/400/401/502
    Route-->>Client: HTTP 200 OK { status: "ok", results: [WeeklyCulturalPlanData], metadata }
```

---

## 2. Orchestration Pipeline Stages

| Stage | Subsystem | MCP Tools Executed | Error Boundary & Degradation Policy |
| :--- | :--- | :--- | :--- |
| **Stage 1: Location Intelligence** | Discover peer anchor venues, lifestyle tags, and target demographic distributions. | `qloo_find_tags`<br/>`qloo_recommend`<br/>`qloo_entity_tags` | **Fatal Boundary**: If missing credentials (`QLOO_API_KEY`) or network failure occurs, the orchestrator immediately halts and emits HTTP 401 (`QLOO_AUTH`) or 502 (`QLOO_MCP_ERROR`). |
| **Stage 2: Local Trends** | Evaluate time-series momentum curves and emerging local shifts across a multi-quarter window. | `qloo_recommend`<br/>`qloo_trends` | **Graceful Partial Degradation**: If no statistically significant trend data is returned or the tool times out, the orchestrator records `source: "qloo_trends (degraded)"` and proceeds with synthesis rather than failing the entire weekly plan. |
| **Stage 3: Audience Contrast** | Contrast the primary market against an optional benchmark expansion city. | `qloo_describe`<br/>`qloo_compare_audiences` | **Conditional Execution**: Skipped completely if no benchmark city is provided. If locality resolution fails in Qloo, sets `audienceDivergence = undefined` and continues pipeline. |
| **Stage 4: Tactical Ranking** | Discover candidate operational initiatives and contextually rank them against the strategic goal. | `qloo_recommend`<br/>`qloo_rank` | **Fatal Boundary**: Ensures initiatives are ranked strictly on real Qloo candidates. If ranking fails, emits HTTP 502. |
| **Final Synthesis** | Coordinate multi-stage signals into an actionable 7-day Monday–Sunday operational rhythm. | Deterministic Synthesizer | **Provenance Verification**: Assigns explicit `origin: "qloo_evidence"` or `origin: "agent_derived"`. In Live Mode, suppresses static illustrative artist palette to prevent unverified discovery claims. |

---

## 3. Strict Provenance Contract

Every recommendation generated by the synthesizer implements the `QlooProvenanceLink` interface:

```typescript
export interface QlooProvenanceLink {
  sourceTool: "qloo_recommend" | "qloo_entity_tags" | "qloo_compare_audiences" | "qloo_trends" | "qloo_rank";
  groundingEntityOrTag: string; // Exact returned entity name or concept tag
  entityUrn?: string;          // e.g. "urn:tag:culinary:cascara"
  empiricalMeasurement?: string;// e.g. "Rank #1 • Fit Score: 95/100"
  interpretationNote: string;  // Explicit explanation of how data translates into hospitality practice
}
```

### RecommendationOrigin Discrimination
- **`qloo_evidence`**: Assigned exclusively when the underlying data point originates directly from a Qloo tool response (e.g. concept tag name, peer anchor venue, time-series momentum rate).
- **`agent_derived`**: Assigned to all operational interpretations synthesized by the agent (e.g. menu item title, pricing rationale, shift milestone, social post copy).
