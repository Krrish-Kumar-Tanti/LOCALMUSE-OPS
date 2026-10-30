"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocationInsights } from "@/hooks/useLocationInsights";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { useOperationMode } from "@/hooks/useOperationMode";
import { ApiClientError } from "@/services/api-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { OperationMode, QlooPlaceRecord, QlooTagRecord } from "@/types";

const BUSINESS_TYPE_OPTIONS = [
  { value: "Specialty Coffee & Roastery", label: "Specialty Coffee & Roastery" },
  { value: "Third-Wave Café & Bakery", label: "Third-Wave Café & Bakery" },
  { value: "Artisanal Craft Pizzeria", label: "Artisanal Craft Pizzeria" },
  { value: "Independent Bookstore & Café", label: "Independent Bookstore & Café" },
  { value: "Natural Wine Bar & Provisions", label: "Natural Wine Bar & Provisions" },
  { value: "Boutique Fitness & Yoga Studio", label: "Boutique Fitness & Yoga Studio" },
  { value: "custom", label: "Custom Business Type..." }
];

export interface LocationInsightsViewProps {
  initialMode?: OperationMode;
}

export function LocationInsightsView({ initialMode }: LocationInsightsViewProps) {
  const { mode, setMode } = useOperationMode(initialMode ?? "demo");
  const [selectedType, setSelectedType] = useState<string>("Specialty Coffee & Roastery");
  const [customType, setCustomType] = useState<string>("");
  const [city, setCity] = useState<string>("Austin, TX");
  const [neighborhood, setNeighborhood] = useState<string>("East Austin");
  const [description, setDescription] = useState<string>("Independent third-wave espresso bar with patio and vinyl audio focus");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, loading, error, execute, reset } = useLocationInsights();
  const { isLiveAvailable } = useBackendHealth({ autoFetch: true });

  const effectiveBusinessType = selectedType === "custom" ? customType : selectedType;

  // Clear results and validation errors when switching modes so stale results are never shown
  const prevModeRef = useRef<OperationMode>(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      reset();
      setValidationError(null);
    }
  }, [mode, reset]);

  // Handle Preset Load
  const handleLoadPreset = () => {
    setSelectedType("Specialty Coffee & Roastery");
    setCity("Austin, TX");
    setNeighborhood("East Austin");
    setDescription("Independent third-wave espresso bar with patio and vinyl audio focus");
    setValidationError(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    if (!city.trim()) {
      setValidationError("City / Market is required. Please specify a geographic location (e.g., Austin, TX).");
      return;
    }

    if (!effectiveBusinessType.trim()) {
      setValidationError("Business Category is required. Please select or enter a business concept.");
      return;
    }

    const fullLocation = neighborhood.trim()
      ? `${neighborhood.trim()}, ${city.trim()}`
      : city.trim();

    await execute({
      mode,
      location: fullLocation,
      businessType: effectiveBusinessType.trim()
    });
  };

  // Extract result item from envelope
  const result = data?.results?.[0];
  const isDemoResponse = Boolean(data?.metadata?.isDemo);

  // Cultural place anchors (handles both mock and live result structures)
  const places: QlooPlaceRecord[] = (result?.top_cultural_anchors || result?.places || []) as QlooPlaceRecord[];

  // Concept tags (handles both mock defining_concept_tags and live resolvedTags)
  const definingTags = result?.defining_concept_tags || [];
  const liveTags: QlooTagRecord[] = result?.resolvedTags || [];

  // Check if error is an authentication failure (missing QLOO_API_KEY)
  const isAuthError =
    (error instanceof ApiClientError && (error.code === "QLOO_AUTH" || error.statusCode === 401)) ||
    error?.message?.includes("QLOO_AUTH") ||
    error?.message?.includes("401");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* View Header */}
      <SectionHeader
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              Workflow Module 01
            </Badge>
            <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm" dot>
              {mode === "demo" ? "Demo Fixtures" : isLiveAvailable ? "Live Qloo Connected" : "Live (Requires Key)"}
            </Badge>
          </div>
        }
        title="Location Insights"
        description="Discover cultural peer anchors, taste concept tags, and demographic indexing for any local enterprise."
        action={
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("demo")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                mode === "demo"
                  ? "bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", mode === "demo" ? "bg-amber-400" : "bg-zinc-500")} />
              Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("live")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                mode === "live"
                  ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                )}
              />
              Live Qloo Mode
            </button>
          </div>
        }
      />

      {/* Mode Clarity Banner */}
      <div
        className={cn(
          "rounded-xl border p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-colors",
          mode === "demo"
            ? "border-amber-500/20 bg-amber-500/5 text-amber-200"
            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-200"
        )}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0",
              mode === "demo"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
            )}
          >
            {mode === "demo" ? (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {mode === "demo" ? "Demo Mode Active" : "Live Qloo Mode Active"}
              </span>
              <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm">
                {mode === "demo" ? "Curated Austin Coffee Fixture" : isLiveAvailable ? "Qloo Connected" : "Requires Key"}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === "demo"
                ? "Uses curated benchmark sample datasets. Does not require an API key or make external network calls."
                : "Executes live Qloo MCP tools (qloo_find_tags, qloo_recommend, qloo_entity_tags). Requires an event-issued QLOO_API_KEY."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode(mode === "demo" ? "live" : "demo")}
            className="text-xs text-zinc-300 hover:text-zinc-100"
            type="button"
          >
            Switch to {mode === "demo" ? "Live Qloo Mode" : "Demo Mode"}
          </Button>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <Card className="border-zinc-800/90 bg-zinc-900/60 text-left">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Enterprise Query Parameters</CardTitle>
              <CardDescription className="mt-1">
                Configure your business concept and target geographic market to run cultural affinity analysis.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLoadPreset} type="button" className="shrink-0">
              Load Austin Coffee Preset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Type Selector (Required) */}
              <div className="space-y-1.5">
                <Select
                  label="Business Category / Concept * (Required)"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  options={BUSINESS_TYPE_OPTIONS}
                  helperText="Primary industry or business format to match taste profiles"
                />
                {selectedType === "custom" && (
                  <Input
                    placeholder="e.g., Specialty Matcha Bar & Roastery"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              {/* City / Primary Market (Required) */}
              <Input
                label="City / Market * (Required)"
                placeholder="e.g., Austin, TX"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                helperText="Geographic target locality for cultural affinity indexing"
              />

              {/* Neighborhood / Micro-location (Optional) */}
              <Input
                label="Neighborhood / District (Optional)"
                placeholder="e.g., East Austin (78702) or South Congress"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                helperText="Optional sub-locality to refine neighborhood-level clusters"
              />

              {/* Business Description / Operational Profile (Optional) */}
              <Input
                label="Business Description (Optional)"
                placeholder="e.g., 35-seat craft café with patio and vinyl audio focus"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText="Operational nuances (seating format, menu focus, aesthetic positioning)"
              />
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-800/60 mt-4">
              <div className="text-xs text-zinc-400">
                {mode === "demo" ? (
                  <span className="text-amber-400/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Querying curated Austin coffee demo fixtures
                  </span>
                ) : (
                  <span className="text-emerald-400/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Calling live Qloo MCP server (requires QLOO_API_KEY)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {data && (
                  <Button variant="outline" size="md" onClick={reset} type="button" disabled={loading}>
                    Clear Results
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 font-semibold"
                >
                  {loading
                    ? mode === "demo"
                      ? "Querying Demo Fixtures..."
                      : "Querying Live Qloo Engine..."
                    : mode === "demo"
                      ? "Generate Demo Insights"
                      : "Query Live Qloo Engine"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dynamic Loading State */}
      {loading && (
        <LoadingState
          message={
            mode === "demo"
              ? `Evaluating curated demo fixtures for '${effectiveBusinessType}' in '${city}'...`
              : `Executing live Qloo MCP pipeline for '${effectiveBusinessType}' in '${city}'...`
          }
        />
      )}

      {/* Error Displays */}
      {error && !loading && (
        isAuthError ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 sm:p-6 text-left space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-amber-200">
                    Authentication Required (QLOO_AUTH)
                  </h4>
                  <Badge variant="warning" size="sm">
                    HTTP 401
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Live Qloo queries require an event-issued API key. Configure <code className="text-amber-300 font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">QLOO_API_KEY</code> in <code className="text-amber-300 font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">server/.env</code>, or switch to Demo Mode to explore curated fixtures.
                </p>
                {error instanceof ApiClientError && error.message && (
                  <p className="text-xs text-zinc-400 font-mono bg-zinc-950/60 p-2.5 rounded border border-zinc-800/80">
                    Backend detail: {error.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/60">
              <span className="text-xs text-zinc-400">
                Switch back to Demo Mode to test full UI functionality with benchmark fixtures.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleSubmit()}
                  type="button"
                >
                  Retry Live Query
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setMode("demo")}
                  type="button"
                >
                  Switch to Demo Mode
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ErrorState
            title={error instanceof ApiClientError && error.code ? `Error (${error.code})` : "Query Failed"}
            message={error.message}
            code={error instanceof ApiClientError ? error.code : undefined}
            recovery={
              error instanceof ApiClientError && error.recovery
                ? error.recovery
                : mode === "live"
                ? "Ensure QLOO_API_KEY is configured in server/.env, or switch to Demo Mode to view curated sample data."
                : "Check input arguments and retry."
            }
            onRetry={() => void handleSubmit()}
          />
        )
      )}

      {/* Results Dashboard */}
      {data && !loading && !error && result && (
        <div className="space-y-6">
          {/* Explicit Demo Disclaimer Banner (Shown when in Demo Mode) */}
          {isDemoResponse && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="font-medium">
                  Curated Demo Mode: Showing illustrative results for product evaluation. Not official live Qloo API data.
                </span>
              </div>
              <Badge variant="warning" size="sm">
                Curated Fixture
              </Badge>
            </div>
          )}

          {/* Overview & Provenance Card */}
          <Card className="border-zinc-800/90 bg-zinc-900/50 text-left">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Location Intelligence Summary
                    </span>
                    {isDemoResponse ? (
                      <Badge variant="warning" size="sm">
                        Curated Demo Dataset
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Live Qloo MCP Data
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">
                    {result.target_location || result.location || city} &bull; {result.business_type || result.businessType || effectiveBusinessType}
                  </CardTitle>
                </div>
                <div className="text-right text-xs text-zinc-400 font-mono">
                  Status: <span className="text-emerald-400 font-semibold">{data.status}</span>
                </div>
              </div>
              <CardDescription className="pt-2 text-sm text-zinc-300 leading-relaxed">
                {result.cultural_overview || result.analysisSummary || data.summary}
              </CardDescription>
            </CardHeader>
            {data.metadata?.disclosure && (
              <div className="px-5 pb-4 text-[11px] text-amber-400/80 font-medium">
                Disclosure: {data.metadata.disclosure}
              </div>
            )}
          </Card>

          {/* Section: Cultural Concept Tags */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <span>Defining Cultural Concept Tags</span>
              <Badge variant="neutral" size="sm">
                {definingTags.length > 0 ? definingTags.length : liveTags.length} tags
              </Badge>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Demo Mode Concept Tags */}
              {definingTags.map((tag, idx) => (
                <div
                  key={tag.urn || idx}
                  className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200 truncate">{tag.label}</span>
                    <Badge variant="info" size="sm">
                      {tag.prevalence}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">{tag.urn}</p>
                </div>
              ))}

              {/* Live Mode Resolved Tags */}
              {liveTags.map((tag, idx) => (
                <div
                  key={tag.urn || tag.id || idx}
                  className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {String(tag.name || tag.label || "Cultural Concept")}
                    </span>
                    {typeof tag.score === "number" && (
                      <span className="text-[10px] font-mono text-indigo-400">
                        score: {tag.score.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">
                    {String(tag.urn || tag.tag_id || tag.id || "")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Cultural Peer Anchors / Recommended Places */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <span>Cultural Peer Anchors & Recommended Places</span>
              <Badge variant="neutral" size="sm">
                {places.length} places identified
              </Badge>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {places.map((place, idx) => (
                <Card key={place.id || idx} className="border-zinc-800/80 bg-zinc-900/40 text-left">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base text-zinc-100">{place.name}</CardTitle>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {place.category} &bull; <span className="text-zinc-400">{String(place.neighborhood || place.address || place.location || city)}</span>
                        </p>
                      </div>
                      {typeof place.illustrative_affinity_score === "number" && (
                        <div className="shrink-0 text-right">
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            {place.illustrative_affinity_score}/100
                          </span>
                          <p className="text-[9px] text-zinc-400 uppercase font-mono">Demo Index</p>
                        </div>
                      )}
                      {typeof place.score === "number" && typeof place.illustrative_affinity_score !== "number" && (
                        <div className="shrink-0 text-right">
                          <span className="text-xs font-bold text-indigo-400 font-mono">
                            {place.score.toFixed(2)}
                          </span>
                          <p className="text-[9px] text-zinc-400 uppercase font-mono">Qloo Score</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {place.description && (
                      <p className="text-xs text-zinc-300/90 leading-relaxed">
                        {place.description}
                      </p>
                    )}

                    {/* Vibe Keywords / Tags */}
                    {Array.isArray(place.vibe_keywords) && place.vibe_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {place.vibe_keywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-zinc-800/90 text-zinc-300 border border-zinc-700/40 font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {Array.isArray(place.tags) && place.tags.length > 0 && !place.vibe_keywords && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {place.tags.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-zinc-800/90 text-zinc-400 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section: Demographic Breakdown (if present in fixture or result) */}
          {result.demographic_breakdown && (
            <Card className="border-zinc-800/80 bg-zinc-900/40 text-left">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">Audience Profile</Badge>
                  <CardTitle className="text-base">Target Demographic Indexing</CardTitle>
                </div>
                <CardDescription>
                  Aggregate demographic segments and lifestyle overlap associated with this venue profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Primary Age Bracket</span>
                    <p className="text-sm font-semibold text-zinc-200">
                      {result.demographic_breakdown.primary_age_bracket}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60 space-y-1 sm:col-span-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Primary Audience Segments</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {result.demographic_breakdown.target_segments?.map((seg, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300">
                          {seg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {Array.isArray(result.demographic_breakdown.lifestyle_interests) && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      Defining Lifestyle Affinities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.demographic_breakdown.lifestyle_interests.map((item, iIdx) => (
                        <span
                          key={iIdx}
                          className="px-2.5 py-1 rounded-md text-xs bg-zinc-800/70 border border-zinc-700/40 text-zinc-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Evidence, Provenance & Workflow Trace Strip */}
          <div className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/80 text-xs text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5 text-left">
              <span className="text-zinc-300 font-medium">Qloo Tool Chaining Trace:</span>
              <p className="text-[11px] font-mono text-zinc-400">
                qloo_find_tags &rarr; qloo_recommend (place) &rarr; qloo_entity_tags
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="font-mono text-zinc-400">
                Source: {data.metadata?.source || "qloo_mcp"}
              </span>
              <a
                href="https://docs.qloo.com"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Qloo Docs Reference &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State (When no query has been run yet) */}
      {!data && !loading && !error && (
        <EmptyState
          title="Ready to Analyze Local Culture"
          description="Select a business concept and enter a city market above, then click 'Generate Insights' to evaluate local cultural peer anchors, concept tags, and demographic indexing."
          action={
            <Button variant="secondary" size="sm" onClick={handleLoadPreset} type="button">
              Load Austin Specialty Coffee Demo
            </Button>
          }
        />
      )}
    </div>
  );
}
