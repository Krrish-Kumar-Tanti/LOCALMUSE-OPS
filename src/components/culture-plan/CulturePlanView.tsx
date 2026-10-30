"use client";

import React, { useState } from "react";
import { useAgentWeeklyPlan } from "@/hooks/useAgentWeeklyPlan";
import { useOperationMode } from "@/hooks/useOperationMode";
import { useAuth } from "@/lib/AuthContext";
import { ApiClientError } from "@/services/api-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlanComparisonView } from "@/components/culture-plan/PlanComparisonView";
import { PlanFeedbackCard } from "@/components/culture-plan/PlanFeedbackCard";
import { useFeedbackHistory } from "@/lib/feedback";
import type {
  OperationMode,
  WeeklyCulturalPlanData,
  RecommendationOrigin,
  QlooProvenanceLink
} from "@/types";

const PRESET_SCENARIOS = [
  {
    label: "Austin Eastside Roastery",
    name: "Flat Track Coffee & Roasters",
    category: "specialty coffee & roastery",
    city: "Austin",
    neighborhood: "East Austin (Cesar Chavez)",
    objective: "Increase weekday afternoon footfall (1:30–4:30 PM) and lift check average",
    targetDemographic: "Remote creative workers, independent designers, and local coffee enthusiasts",
    benchmarkCity: "Nashville"
  },
  {
    label: "Brooklyn Wine & Vinyl",
    name: "Dorsia & Disc Provisions",
    category: "natural wine bar & provisions",
    city: "Brooklyn",
    neighborhood: "North Williamsburg",
    objective: "Drive midweek Tuesday/Wednesday dining covers and retail bottle sales",
    targetDemographic: "Design professionals, audio connoisseurs, and neighborhood evening patrons",
    benchmarkCity: "Austin"
  },
  {
    label: "Seattle Indie Bookstore Cafe",
    name: "Page & Pour Bookshop",
    category: "independent bookstore & cafe",
    city: "Seattle",
    neighborhood: "Capitol Hill",
    objective: "Boost weekend evening community attendance and cross-merchandising conversion",
    targetDemographic: "Literature enthusiasts, remote writers, and neighborhood students",
    benchmarkCity: "Portland"
  }
];

export interface CulturePlanViewProps {
  initialMode?: OperationMode;
}

export function CulturePlanView({ initialMode }: CulturePlanViewProps) {
  const { mode, setMode } = useOperationMode(initialMode ?? "demo");
  const { currentPersona } = useAuth();

  // Form State
  const [businessName, setBusinessName] = useState("Flat Track Coffee & Roasters");
  const [category, setCategory] = useState("specialty coffee & roastery");
  const [city, setCity] = useState("Austin");
  const [neighborhood, setNeighborhood] = useState("East Austin (Cesar Chavez)");
  const [objective, setObjective] = useState("Increase weekday afternoon footfall (1:30–4:30 PM) and lift check average");
  const [targetDemographic, setTargetDemographic] = useState("Remote creative workers, independent designers, and local coffee enthusiasts");
  const [benchmarkCity, setBenchmarkCity] = useState("Nashville");

  // UI State
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedPostDay, setCopiedPostDay] = useState<string | null>(null);
  const [expandedProvenanceId, setExpandedProvenanceId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const { latest: priorFeedback } = useFeedbackHistory(businessName, city);

  // Hook Connection to authentic Express /api/agent/weekly-plan
  const { data, loading, error, execute } = useAgentWeeklyPlan();

  // Pre-fill from current operator persona if selected
  const [prevPersonaId, setPrevPersonaId] = useState(currentPersona?.id);
  if (currentPersona && currentPersona.id !== prevPersonaId) {
    setPrevPersonaId(currentPersona.id);
    setBusinessName(currentPersona.businessName);
    setCategory(currentPersona.businessType);
    const parts = currentPersona.location.split(",");
    setCity(parts[0]?.trim() || currentPersona.location);
    setNeighborhood(currentPersona.neighborhood);
    setObjective(currentPersona.focusObjective);
  }

  // Load preset scenario
  const handleLoadPreset = (scenario: typeof PRESET_SCENARIOS[0]) => {
    setBusinessName(scenario.name);
    setCategory(scenario.category);
    setCity(scenario.city);
    setNeighborhood(scenario.neighborhood);
    setObjective(scenario.objective);
    setTargetDemographic(scenario.targetDemographic);
    setBenchmarkCity(scenario.benchmarkCity);
  };

  // Execute weekly plan generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await execute({
      mode,
      businessProfile: {
        name: businessName,
        category,
        city,
        neighborhood: neighborhood || undefined
      },
      operationalGoal: {
        objective,
        targetDemographic: targetDemographic || undefined,
        benchmarkCity: benchmarkCity || undefined
      }
    });
  };

  const planData: WeeklyCulturalPlanData | undefined = data?.results?.[0];

  // Copy social caption
  const handleCopyCaption = (dayOfWeek: string, hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedPostDay(dayOfWeek);
    setTimeout(() => setCopiedPostDay(null), 2000);
  };

  // Export entire plan as Markdown
  const handleCopyPlanMarkdown = () => {
    if (!planData) return;
    const md = `# Weekly Cultural Operations Plan: ${planData.businessName}
**Locality:** ${planData.locality}
**Target Week:** ${planData.targetWeek}
**Mode:** ${data?.metadata?.isDemo ? "Demo Curated Fixture" : "Live Qloo MCP"}

## Executive Strategy
${planData.executiveStrategy}

## Cultural Anchors & Target Demographic
- **Cultural Anchors:** ${planData.culturalAnchorSummary}
- **Target Patron Segment:** ${planData.targetPatronSegment}

## Specials & Menu Features
${planData.specialsAndMenu
  .map(
    (s, idx) => `### ${idx + 1}. ${s.title} (${s.dayOfWeek})
*Theme: ${s.themeCategory}* [Origin: ${s.origin}]
${s.description}
- **Operations:** ${s.operationalNotes}
- **Provenance:** ${s.provenance.sourceTool} → ${s.provenance.groundingEntityOrTag} (${s.provenance.empiricalMeasurement || "N/A"})
`
  )
  .join("\n")}

## Events & Strategic Partnerships
${planData.eventsAndPartnerships
  .map(
    (e, idx) => `### ${idx + 1}. ${e.title} (${e.dayOfWeek})
*Partner: ${e.partnerType}* [Origin: ${e.origin}]
- **Audience:** ${e.targetAudience}
- **Steps:**
${e.executionSteps.map((step) => `  * ${step}`).join("\n")}
- **Provenance:** ${e.provenance.sourceTool} → ${e.provenance.groundingEntityOrTag}
`
  )
  .join("\n")}

## Atmosphere & Soundscape Direction
- **Genre:** ${planData.atmosphereAndPlaylist.musicalGenre}
- **Soundscape:** ${planData.atmosphereAndPlaylist.soundscapeVibe}
- **Lighting & Pacing:** ${planData.atmosphereAndPlaylist.lightingAndDwellPacing}
- **Artist Signals:** ${planData.atmosphereAndPlaylist.curatedArtistSignals.join(", ") || "Suppressed in live mode"}

## Monday–Sunday Operational Schedule
${planData.dailySchedule
  .map(
    (d) => `### ${d.day}: ${d.shiftFocus}
- **Milestones:** ${d.keyMilestones.join("; ")}
- **Target Outcome:** ${d.targetOutcome}
`
  )
  .join("\n")}

## Expected Operational Impact
${planData.expectedImpact.projectedOutcomeSummary}
${planData.expectedImpact.supportingDataPoints
  .map((p) => `- **${p.metricName}:** ${p.value} (Source: ${p.source})`)
  .join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  // Helper to render Provenance Drawer
  const renderProvenancePill = (id: string, provenance: QlooProvenanceLink, origin: RecommendationOrigin) => {
    const isExpanded = expandedProvenanceId === id;
    const isQlooEvidence = origin === "qloo_evidence";

    return (
      <div className="pt-2 text-left">
        <div className="flex items-center gap-2">
          <Badge
            variant={isQlooEvidence ? "success" : "warning"}
            size="sm"
          >
            {isQlooEvidence ? "Qloo Empirical Evidence" : "Agent Derived Suggestion"}
          </Badge>
          <button
            type="button"
            onClick={() => setExpandedProvenanceId(isExpanded ? null : id)}
            className="text-[11px] font-mono text-accent-muted hover:text-text-primary cursor-pointer inline-flex items-center gap-1 transition-colors"
          >
            <span>Tool: {provenance.sourceTool}</span>
            <span>{isExpanded ? "▲" : "▼"}</span>
          </button>
        </div>

        {isExpanded && (
          <div className="mt-2 p-3 rounded-xl bg-surface border border-border text-[11px] space-y-1.5 font-mono text-text-secondary animate-in fade-in duration-150">
            <div>
              <span className="text-accent-muted font-semibold">Grounding Entity/Tag: </span>
              <span className="text-text-primary font-bold">{provenance.groundingEntityOrTag}</span>
            </div>
            {provenance.empiricalMeasurement && (
              <div>
                <span className="text-accent-muted font-semibold">Empirical Signal: </span>
                <span>{provenance.empiricalMeasurement}</span>
              </div>
            )}
            {provenance.interpretationNote && (
              <div className="text-text-secondary font-sans italic text-[11px]">
                Note: {provenance.interpretationNote}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-text-primary selection:bg-primary selection:text-surface">
      {/* Top Banner / Hero */}
      <div className="relative rounded-3xl border border-border bg-surface p-6 sm:p-8 overflow-hidden shadow-2xs text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <Badge variant="warning" size="sm">
                Flagship Copilot
              </Badge>
              <span className="text-[11px] text-accent-muted font-mono">Module 05 &bull; Agentic Orchestrator</span>
            </div>
            <TextRevealOnScroll
              as="h1"
              text="Weekly Cultural Operations Plan"
              className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-text-primary"
            />
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              Synthesizes peer venue anchors, concept tags, category momentum, and contextual initiative ranking into a practical Monday–Sunday operating rhythm. Every suggestion clearly distinguishes verified Qloo signals from agent interpretations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className="px-3.5 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text-primary text-xs font-mono transition-colors shadow-2xs cursor-pointer"
              >
                Preset {idx + 1}: {preset.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Business Context &amp; Strategic Goal</CardTitle>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode(mode === "demo" ? "live" : "demo")}
                className="text-xs font-mono px-3 py-1 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text-primary cursor-pointer transition-colors"
              >
                Mode: <strong className="uppercase font-bold">{mode}</strong>
              </button>
            </div>
          </div>
          <CardDescription>
            Provide your business attributes. In Demo Mode, the agent runs against curated benchmark fixtures. In Live Mode, it executes live Qloo MCP tools (Location Insights, Audience Comparison, Local Trends, Tactical Ranking) via the port 4000 backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Prior Operator Memory Context (Step 14) */}
            {priorFeedback && (
              <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="info" size="sm">Prior Operator Memory</Badge>
                  <span className="text-amber-500 font-bold">
                    {"★".repeat(priorFeedback.rating)}
                  </span>
                  <span className="text-text-primary font-medium">
                    {priorFeedback.categories.join(", ")}
                  </span>
                  {priorFeedback.note && (
                    <span className="text-text-secondary italic">
                      &mdash; &ldquo;{priorFeedback.note}&rdquo;
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (priorFeedback.note && !objective.includes(priorFeedback.note)) {
                      setObjective((prev) => `${prev} [Feasibility Note: ${priorFeedback.note}]`);
                    }
                  }}
                  className="text-[11px] font-mono text-primary hover:underline cursor-pointer font-bold shrink-0 self-start sm:self-center"
                >
                  Apply Note to Goal &rarr;
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Business Name
                </label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Flat Track Coffee"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Business Category
                </label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. specialty coffee & roastery"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  City / Market
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Austin"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Neighborhood / District
                </label>
                <Input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. East Austin"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Target Demographic
                </label>
                <Input
                  value={targetDemographic}
                  onChange={(e) => setTargetDemographic(e.target.value)}
                  placeholder="e.g. Remote creative workers & designers"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Benchmark City (Optional)
                </label>
                <Input
                  value={benchmarkCity}
                  onChange={(e) => setBenchmarkCity(e.target.value)}
                  placeholder="e.g. Nashville (for audience contrast)"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                Primary Operational Objective
              </label>
              <Input
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Increase weekday afternoon footfall (1:30–4:30 PM) and lift check average"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-text-secondary font-mono">
                Engine: <strong className="text-text-primary uppercase font-bold">{mode}</strong> {mode === "demo" ? "(Curated fixture)" : "(Direct Qloo MCP protocol)"}
              </span>
              <Button type="submit" variant="primary" disabled={loading} className="px-6">
                {loading ? "Orchestrating Plan across Qloo Tools..." : "Generate Weekly Operations Plan →"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <LoadingState
          message="Orchestrating Weekly Cultural Plan... Executing Location Insights, Audience Contrast, Local Trends, and Candidate Ranking across Qloo MCP tools."
        />
      )}

      {/* Error State */}
      {error && !loading && (() => {
        const apiError = error instanceof ApiClientError ? error : null;
        const errorCode = apiError?.code;
        const errorRecovery = apiError?.recovery;

        return (
          <ErrorState
            title={errorCode === "QLOO_AUTH" ? "Qloo Authentication Required (HTTP 401)" : "Orchestration Stage Failed"}
            message={error.message}
            code={errorCode}
            recovery={errorRecovery || (errorCode === "QLOO_AUTH" ? "Switch to Demo Mode to test with curated fixtures, or set QLOO_API_KEY in server/.env." : undefined)}
            onRetry={() => handleGenerate()}
          />
        );
      })()}

      {/* Empty State */}
      {!planData && !loading && !error && (
        <EmptyState
          title="No Weekly Plan Generated Yet"
          description="Click 'Generate Weekly Operations Plan' or select one of the preset business scenarios above to orchestrate a cultural plan."
          action={
            <Button variant="primary" size="sm" onClick={() => handleGenerate()}>
              Generate Austin Coffee Plan
            </Button>
          }
        />
      )}

      {/* Results Presentation */}
      {planData && !loading && (
        <div className="space-y-8 animate-in fade-in duration-300 text-left">
          
          {/* Header Controls Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-surface">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider">
                  {planData.targetWeek}
                </span>
                <Badge variant={data?.metadata?.isDemo ? "warning" : "success"} size="sm">
                  {data?.metadata?.isDemo ? "Demo Curated Fixture" : "Live Qloo MCP Plan"}
                </Badge>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-text-primary">
                Weekly Cultural Operations Plan: {planData.businessName}
              </h2>
              <p className="text-xs text-text-secondary font-mono">
                {planData.locality} &bull; Target Patron: {planData.targetPatronSegment}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant={showComparison ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                type="button"
                className="cursor-pointer"
              >
                <span>{showComparison ? "Hide Generic AI Contrast" : "Compare with Generic AI"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyPlanMarkdown} type="button">
                {copiedPlan ? "Copied Markdown ✓" : "Export Plan (Markdown)"}
              </Button>
            </div>
          </div>

          {/* Step 13: Practical Generic AI vs Qloo Comparison */}
          {showComparison && (
            <PlanComparisonView
              planData={planData}
              businessProfile={{
                name: businessName,
                category,
                city,
                neighborhood: neighborhood || undefined,
                objective
              }}
              mode={mode}
              onClose={() => setShowComparison(false)}
            />
          )}

          {/* Section 1: Executive Strategy & Cultural Anchors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">Executive Strategy</Badge>
                  <span className="text-xs font-mono text-accent-muted font-semibold">Deterministic Synthesis</span>
                </div>
                <CardTitle className="text-base text-text-primary pt-1">Strategic Operations Thesis</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                <p>{planData.executiveStrategy}</p>
              </CardContent>
            </Card>

            <Card className="border-border bg-surface">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" size="sm">Location Intelligence</Badge>
                  <span className="text-xs font-mono text-text-secondary">Peer Anchors</span>
                </div>
                <CardTitle className="text-base text-text-primary pt-1">Cultural Anchor Grounding</CardTitle>
              </CardHeader>
              <CardContent className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                <p>{planData.culturalAnchorSummary}</p>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Specials & Menu Innovations */}
          <div className="space-y-4">
            <SectionHeader
              badge={<Badge variant="warning" size="sm">Culinary &amp; Product</Badge>}
              title="Specials &amp; Menu Innovations"
              description="Tactical features derived from top-ranked local affinity options or active trend momentum."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planData.specialsAndMenu.map((special, idx) => (
                <Card key={idx} className="border-border bg-surface flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-accent-muted">
                        {special.dayOfWeek}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                        {special.themeCategory}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-text-primary mt-1">{special.title}</CardTitle>
                    <CardDescription>{special.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <div className="p-3 rounded-xl bg-surface-secondary/40 border border-border text-xs text-text-secondary font-sans">
                      <strong className="text-text-primary font-medium">Operations: </strong>
                      {special.operationalNotes}
                    </div>
                    {renderProvenancePill(`special-${idx}`, special.provenance, special.origin)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 3: Events & Strategic Partnerships */}
          <div className="space-y-4">
            <SectionHeader
              badge={<Badge variant="warning" size="sm">Programming</Badge>}
              title="Events &amp; Strategic Partnerships"
              description="Community activations and neighbor collaborations designed to convert off-peak capacity into structured dwell."
            />

            <div className="grid grid-cols-1 gap-4">
              {planData.eventsAndPartnerships.map((event, idx) => (
                <Card key={idx} className="border-border bg-surface">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-accent-muted">
                        {event.dayOfWeek}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                        Partner: {event.partnerType}
                      </span>
                    </div>
                    <CardTitle className="text-lg text-text-primary mt-1">{event.title}</CardTitle>
                    <CardDescription>Target Audience: {event.targetAudience}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-text-primary block">Execution Steps:</span>
                      <ul className="space-y-1 text-xs text-text-secondary list-disc pl-4 font-sans">
                        {event.executionSteps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    {renderProvenancePill(`event-${idx}`, event.provenance, event.origin)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 4: Atmosphere & Soundscape Direction */}
          <div className="space-y-4">
            <SectionHeader
              badge={<Badge variant="neutral" size="sm">Sensory Dwell</Badge>}
              title="Atmosphere, Soundscape &amp; Pacing"
              description="Acoustic decibel calibration, lighting transitions, and soundscape direction tailored to local dwell pacing."
            />

            <Card className="border-border bg-surface">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border space-y-1">
                    <span className="text-[10px] font-mono uppercase text-accent-muted font-semibold block">
                      Musical Genre
                    </span>
                    <p className="text-xs font-serif font-semibold text-text-primary">
                      {planData.atmosphereAndPlaylist.musicalGenre}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border space-y-1">
                    <span className="text-[10px] font-mono uppercase text-accent-muted font-semibold block">
                      Soundscape Vibe
                    </span>
                    <p className="text-xs text-text-secondary font-sans">
                      {planData.atmosphereAndPlaylist.soundscapeVibe}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border space-y-1">
                    <span className="text-[10px] font-mono uppercase text-accent-muted font-semibold block">
                      Lighting &amp; Dwell Pacing
                    </span>
                    <p className="text-xs text-text-secondary font-sans">
                      {planData.atmosphereAndPlaylist.lightingAndDwellPacing}
                    </p>
                  </div>
                </div>

                {/* Artist Reference Palette — Respecting Live Mode Suppression */}
                <div className="p-4 rounded-xl bg-surface-secondary/30 border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-primary">
                      Acoustic Artist Reference Palette
                    </span>
                    <Badge variant="neutral" size="sm">
                      {planData.atmosphereAndPlaylist.curatedArtistSignals.length > 0 ? "Illustrative Palette" : "Suppressed in Live Mode"}
                    </Badge>
                  </div>

                  {planData.atmosphereAndPlaylist.curatedArtistSignals.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {planData.atmosphereAndPlaylist.curatedArtistSignals.map((artist, aIdx) => (
                        <span
                          key={aIdx}
                          className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-text-primary font-mono shadow-2xs"
                        >
                          {artist}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-secondary font-sans italic">
                      Static artist reference palette suppressed in Live Mode because no direct music entity search was executed. Ambiance parameters are derived from category dwell profile.
                    </p>
                  )}

                  {renderProvenancePill(
                    "atmosphere-provenance",
                    planData.atmosphereAndPlaylist.provenance,
                    planData.atmosphereAndPlaylist.origin
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 5: Social Storytelling Calendar */}
          <div className="space-y-4">
            <SectionHeader
              badge={<Badge variant="warning" size="sm">Content Angles</Badge>}
              title="Social Content Storytelling"
              description="Empirically timed social angles designed to capture patron intent during key weekly decision moments."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planData.socialContentCalendar.map((post, idx) => (
                <Card key={idx} className="border-border bg-surface flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-accent-muted">
                        {post.dayOfWeek}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border">
                        {post.recommendedFormat}
                      </span>
                    </div>
                    <p className="font-serif text-sm font-semibold text-text-primary pt-2 leading-snug">
                      &ldquo;{post.hook}&rdquo;
                    </p>
                    <p className="text-xs text-text-secondary pt-1 font-sans">
                      Angle: {post.contentAngle}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2 border-t border-border">
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopyCaption(post.dayOfWeek, post.hook)}
                        className="text-xs font-mono text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                      >
                        {copiedPostDay === post.dayOfWeek ? "Copied ✓" : "Copy Hook Copy"}
                      </button>
                    </div>
                    {renderProvenancePill(`social-${idx}`, post.provenance, post.origin)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 6: Monday–Sunday Operational Cadence */}
          <div className="space-y-4">
            <SectionHeader
              badge={<Badge variant="neutral" size="sm">Execution Rhythm</Badge>}
              title="Monday–Sunday Operational Cadence"
              description="Daily shift focus and staff milestones to implement cultural operations smoothly."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {planData.dailySchedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-border bg-surface space-y-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base font-semibold text-text-primary">
                      {slot.day}
                    </span>
                    <Badge variant="outline" size="sm">
                      Day 0{idx + 1}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-accent-muted font-mono line-clamp-1">
                    {slot.shiftFocus}
                  </div>
                  <ul className="space-y-1 text-xs text-text-secondary list-disc pl-3.5 font-sans">
                    {slot.keyMilestones.map((milestone, mIdx) => (
                      <li key={mIdx}>{milestone}</li>
                    ))}
                  </ul>
                  <div className="pt-1.5 border-t border-border text-[11px] text-text-secondary italic">
                    Outcome: {slot.targetOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Projected Impact & Empirical Grounding */}
          <div className="space-y-4">
            <SectionHeader
              badge={<Badge variant="warning" size="sm">Outcomes</Badge>}
              title="Projected Operational Impact &amp; Evidence Grounding"
              description="Empirical signals discovered across Qloo tools vs estimated operational projections."
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <Card className="md:col-span-6 border-border bg-surface">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="sm">
                      Model Projection
                    </Badge>
                    <span className="text-xs font-mono text-accent-muted">Agent Estimated</span>
                  </div>
                  <CardTitle className="text-base text-text-primary pt-1">
                    Projected Commercial Outcome
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                  <p>{planData.expectedImpact.projectedOutcomeSummary}</p>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 mt-2">
                    <strong>Integrity Notice:</strong> Projected outcomes are calculated from peer operational benchmarks. They are strategic decision-support aids, not empirical measurements or guaranteed commercial outcomes.
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-6 border-border bg-surface">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">
                      Empirical Measurements
                    </Badge>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Verified Signals</span>
                  </div>
                  <CardTitle className="text-base text-text-primary pt-1">
                    Grounding Data Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {planData.expectedImpact.supportingDataPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-secondary/40 border border-border flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-text-primary block">{point.metricName}</span>
                        <span className="text-[11px] text-accent-muted font-mono">{point.source}</span>
                      </div>
                      <span className="font-mono font-bold text-text-primary shrink-0 text-right">
                        {point.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 8: Cross-Market Audience Contrast (Conditional) */}
          {planData.audienceDivergence && (
            <div className="space-y-4">
              <SectionHeader
                badge={<Badge variant="info" size="sm">Module 02</Badge>}
                title={`Cross-Market Contrast: ${planData.locality} vs ${planData.audienceDivergence.benchmarkMarket}`}
                description="Distinctive local cultural traits that set this market apart from the benchmark city."
              />

              <Card className="border-border bg-surface">
                <CardContent className="pt-6 space-y-4">
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
                    {planData.audienceDivergence.divergenceTakeaway}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border space-y-1.5">
                      <span className="text-[11px] font-mono uppercase text-accent-muted font-semibold block">
                        Shared Affinities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {planData.audienceDivergence.sharedAffinities.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs text-text-primary font-mono"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border space-y-1.5">
                      <span className="text-[11px] font-mono uppercase text-accent-muted font-semibold block">
                        Distinguishing Local Traits
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {planData.audienceDivergence.distinguishingLocalTraits.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-full bg-surface-secondary border border-border text-xs text-text-primary font-mono"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Section 9: Orchestration Trace */}
          <div className="p-4 rounded-2xl border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-text-secondary">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-text-primary">Orchestration Trace:</span>
              {planData.orchestrationTrace.toolsExecuted.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-surface-secondary border border-border text-[11px] text-text-primary"
                >
                  {tool}
                </span>
              ))}
            </div>
            <div>
              <span>Completed {planData.orchestrationTrace.stagesCompleted} stages &bull; </span>
              <span>{new Date(planData.orchestrationTrace.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Step 14: Operator Plan Review & Local Device Memory */}
          <PlanFeedbackCard planData={planData} />

        </div>
      )}
    </div>
  );
}

export default CulturePlanView;
