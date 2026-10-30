"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { WeeklyCulturalPlanData, OperationMode } from "@/types";

export interface PlanComparisonViewProps {
  planData: WeeklyCulturalPlanData;
  businessProfile: {
    name: string;
    category: string;
    city: string;
    neighborhood?: string;
    objective: string;
  };
  mode?: OperationMode;
  onClose?: () => void;
  className?: string;
}

interface ComparisonDimension {
  id: string;
  dimension: string;
  summaryTitle: string;
  qlooApproach: {
    title: string;
    description: string;
    specificExample: string;
    provenanceLabel: string;
  };
  genericApproach: {
    title: string;
    description: string;
    specificExample: string;
    vulnerabilityLabel: string;
  };
  practicalTakeaway: string;
}

export function PlanComparisonView({
  planData,
  businessProfile,
  mode = "demo",
  onClose,
  className = "",
}: PlanComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<"matrix" | "details">("matrix");
  const [selectedDimension, setSelectedDimension] = useState<string>("cultural-relevance");

  // Derive dynamic examples from the actual generated plan
  const primarySpecial = planData.specialsAndMenu?.[0];
  const primaryEvent = planData.eventsAndPartnerships?.[0];
  const primarySound = planData.atmosphereAndPlaylist;
  const primaryShift = planData.dailySchedule?.[0];
  const primaryGroundingTag = primarySpecial?.provenance?.groundingEntityOrTag || "artisan craft";

  const dimensions: ComparisonDimension[] = [
    {
      id: "cultural-relevance",
      dimension: "Cultural Relevance & Taste Alignment",
      summaryTitle: "Authentic Cultural Depth vs. Clichéd Hospitality Tropes",
      qlooApproach: {
        title: "Taste Vector & Concept Tag Anchoring",
        description: `Grounded in aggregate cultural affinities for ${businessProfile.category} in ${planData.locality}. Replaces generic promotions with niche affinity pairings that patrons enthusiastically pay full margin for.`,
        specificExample: primarySpecial
          ? `Special Feature: "${primarySpecial.title}" (${primarySpecial.description}) &mdash; ${primarySpecial.operationalNotes}.`
          : `Grounded in verified taste vectors: ${primaryGroundingTag}.`,
        provenanceLabel: `${primarySpecial?.provenance?.sourceTool || "qloo_rank"} • verified concept tag`,
      },
      genericApproach: {
        title: "Unanchored Discounting & Clichés",
        description: "Recommends blunt margin-eroding price cuts (e.g. 15% happy hour discount or 2-for-1 cards) that attract price-sensitive churn rather than brand-loyal cultural advocates.",
        specificExample: `Generic prompt advice: "Offer a 15% discount on standard iced coffee between 2–4 PM and hand out loyalty punch cards."`,
        vulnerabilityLabel: "Erodes craft margin • Zero affinity data",
      },
      practicalTakeaway: "LocalMuse Ops protects margins by using taste affinity to increase perceived value, whereas generic AI defaults to price discounting.",
    },
    {
      id: "local-context",
      dimension: "Local Market & District Context",
      summaryTitle: "Neighborhood Affinity Heatmaps vs. Geography-Blind Prompts",
      qlooApproach: {
        title: "Hyper-Local Geographic Calibration",
        description: `Calibrated specifically to ${planData.locality} footfall dynamics and local lifestyle anchors: ${planData.culturalAnchorSummary}.`,
        specificExample: planData.audienceDivergence
          ? `Accounts for cross-market divergence against ${planData.audienceDivergence.benchmarkMarket}: ${planData.audienceDivergence.divergenceTakeaway}`
          : `Calibrated for ${planData.locality} anchor venues and micro-district patron densities.`,
        provenanceLabel: "qloo_recommend (places) • locality awareness",
      },
      genericApproach: {
        title: "Geographic Blindness",
        description: "Assumes every neighborhood in every city behaves identically. Outputs identical advice whether prompting for Brooklyn, Austin, or South Delhi.",
        specificExample: `Generic prompt advice: "Partner with local influencers in ${businessProfile.city} and post engaging photos on social media."`,
        vulnerabilityLabel: "No anchor awareness • Generic city platitudes",
      },
      practicalTakeaway: "Neighborhood patrons have distinct subcultural preferences. Qloo understands local cultural anchors that generic LLMs cannot query.",
    },
    {
      id: "evidence-provenance",
      dimension: "Evidence & Provenance Tracking",
      summaryTitle: "Traceable Toolchain Chains vs. Unverifiable LLM Hallucinations",
      qlooApproach: {
        title: "Strict Provenance & Origin Labeling",
        description: `Every recommendation is tied to verifiable Qloo toolchains (${planData.orchestrationTrace.toolsExecuted.join(" → ")}). Distinguishes empirical signals from agent operational suggestions.`,
        specificExample: `Trace: Grounded via ${primarySpecial?.provenance?.sourceTool || "qloo_recommend"} on entity/tag "${primaryGroundingTag}". Note: "${primarySpecial?.provenance?.interpretationNote || "Calibrated for shift demand"}"`,
        provenanceLabel: `origin: ${primarySpecial?.origin || "qloo_evidence"} • verified source`,
      },
      genericApproach: {
        title: "Zero Provenance / Unverifiable Hallucination",
        description: "Standard LLMs generate confident text predictions without citations, data sources, or verifiable affinity evidence.",
        specificExample: "Generic prompt advice: 'Studies show that people like warm lighting and cozy music.' (No verifiable data source or confidence metric).",
        vulnerabilityLabel: "Zero citation • Hallucination risk",
      },
      practicalTakeaway: "Operators need defensible reasons before investing time and payroll. Provenance pills ensure staff understand the 'why' behind each operational initiative.",
    },
    {
      id: "operational-recommendations",
      dimension: "Operational Recommendations & Atmosphere",
      summaryTitle: "Shift-Timed Multimodal Action vs. Vague Aspirational Advice",
      qlooApproach: {
        title: "Multimodal Cultural Calibration",
        description: `Coordinates menu items, partnerships, soundscape decibels, and social hooks into a unified operations rhythm.`,
        specificExample: `Atmosphere: ${primarySound?.musicalGenre || "Instrumental Vibe"} (${primarySound?.soundscapeVibe || "ambient focus"}), paired with "${primaryEvent?.title || "Artisan Collaboration"}" (${primaryEvent?.partnerType || "Local Partner"}).`,
        provenanceLabel: "Coordinated cross-domain orchestration",
      },
      genericApproach: {
        title: "Isolated, Fragmented Ideas",
        description: "Suggests disjointed marketing ideas without coordinating culinary prep, audio decibels, staffing pace, or partner consignment agreements.",
        specificExample: "Generic prompt advice: 'Play upbeat commercial radio hits on Spotify and print motivational quote chalkboards.'",
        vulnerabilityLabel: "Auditory fatigue • Friction for staff",
      },
      practicalTakeaway: "High-decibel pop music drives away high-ticket remote workers. Taste-grounded soundscapes protect productivity and lengthen dwell time.",
    },
    {
      id: "implementation-practicality",
      dimension: "Implementation Practicality & Schedule",
      summaryTitle: "Concrete Monday–Sunday Shifts vs. Abstract Wishlists",
      qlooApproach: {
        title: "Structured Shift Milestones & Zero-Capex Drops",
        description: "Maps recommendations directly into an actionable 7-day operations calendar with concrete shift duties, milestone checklists, and staff prep.",
        specificExample: primaryShift
          ? `Schedule (${primaryShift.day}): "${primaryShift.shiftFocus}". Milestones: ${primaryShift.keyMilestones?.[0] || "Staff briefing"}`
          : "Structured Monday–Sunday operational shifts.",
        provenanceLabel: "Actionable operator shift calendar",
      },
      genericApproach: {
        title: "Abstract Marketing Wishlist",
        description: "Offers broad advice ('host community workshops', 'collaborate locally') without shift hours, staffing checklists, or consignment margin frameworks.",
        specificExample: "Generic prompt advice: 'Host frequent weekend networking events and give away free merchandise.'",
        vulnerabilityLabel: "Unrealistic capex • No staffing structure",
      },
      practicalTakeaway: "Independent hospitality runs on tight shifts. Operators need actionable duty milestones, not overwhelming marketing to-do lists.",
    },
  ];

  return (
    <div className={cn("space-y-6 text-left transition-all", className)}>
      {/* Header Banner */}
      <Card className="border-border bg-surface shadow-xs overflow-hidden text-left">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  Step 13 Practical Contrast
                </Badge>
                <Badge variant={mode === "demo" ? "warning" : "success"} size="sm">
                  {mode === "demo" ? "Demo Fixture Analysis" : "Live Qloo Analysis"}
                </Badge>
              </div>
              <CardTitle className="font-serif text-xl sm:text-2xl text-text-primary">
                Practical Contrast: LocalMuse Ops (Qloo-Grounded) vs. Generic AI Baseline
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-text-secondary">
                Evaluating the generated weekly plan for <strong>{businessProfile.name}</strong> ({businessProfile.category} in {businessProfile.city}) against a deterministic generic LLM strategy template.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <div className="inline-flex items-center p-0.5 rounded-full border border-border bg-surface-secondary/50 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("matrix")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer",
                    activeTab === "matrix"
                      ? "bg-primary text-surface font-semibold shadow-2xs"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  Matrix View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer",
                    activeTab === "details"
                      ? "bg-primary text-surface font-semibold shadow-2xs"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  Dimension Breakdown
                </button>
              </div>

              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} type="button" className="text-xs">
                  Close Contrast
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Educational & Integrity Disclosures */}
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-text-primary flex items-start gap-2">
              <span className="font-bold text-primary shrink-0">&bull;</span>
              <p className="leading-relaxed">
                <strong>Qloo-Grounded Plan:</strong> Built from verified taste correlation vectors, local anchor places, and multi-quarter momentum trends. Every recommendation distinguishes empirical evidence from agent-derived interpretation.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary/60 border border-border text-text-secondary flex items-start gap-2">
              <span className="font-bold text-accent-muted shrink-0">&bull;</span>
              <p className="leading-relaxed">
                <strong>Generic AI Baseline:</strong> A deterministic, rule-based strategy template representing standard unanchored LLM outputs. This is an illustrative benchmark to contrast methodology, not an endorsement or proof of revenue increase.
              </p>
            </div>
          </div>

          {/* Matrix View */}
          {activeTab === "matrix" && (
            <div className="overflow-x-auto rounded-2xl border border-border mt-2">
              <table className="w-full text-xs border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary/60 text-text-primary font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold w-1/4">Evaluation Dimension</th>
                    <th className="py-3 px-4 font-bold w-3/8 text-primary">
                      LocalMuse Ops (Qloo-Grounded)
                    </th>
                    <th className="py-3 px-4 font-bold w-3/8 text-text-secondary">
                      Generic AI Baseline (Rule-Based)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dimensions.map((dim) => (
                    <tr key={dim.id} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 align-top">
                        <span className="font-semibold text-text-primary block">{dim.dimension}</span>
                        <span className="text-[11px] text-accent-muted font-sans mt-0.5 block">
                          {dim.summaryTitle}
                        </span>
                      </td>

                      {/* Qloo Column */}
                      <td className="py-3.5 px-4 align-top bg-emerald-500/5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
                            <strong className="text-text-primary text-xs">{dim.qlooApproach.title}</strong>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-relaxed">
                            {dim.qlooApproach.description}
                          </p>
                          <div className="p-2 rounded-lg bg-surface border border-border text-[11px] font-mono text-text-primary">
                            {dim.qlooApproach.specificExample}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                            {dim.qlooApproach.provenanceLabel}
                          </div>
                        </div>
                      </td>

                      {/* Generic AI Column */}
                      <td className="py-3.5 px-4 align-top bg-surface-secondary/30">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <strong className="text-text-primary text-xs">{dim.genericApproach.title}</strong>
                          </div>
                          <p className="text-[11px] text-text-secondary leading-relaxed">
                            {dim.genericApproach.description}
                          </p>
                          <div className="p-2 rounded-lg bg-surface/80 border border-border text-[11px] font-mono text-text-secondary italic">
                            {dim.genericApproach.specificExample}
                          </div>
                          <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                            {dim.genericApproach.vulnerabilityLabel}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Details View */}
          {activeTab === "details" && (
            <div className="space-y-4 mt-2">
              <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
                {dimensions.map((dim) => (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => setSelectedDimension(dim.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border",
                      selectedDimension === dim.id
                        ? "bg-primary text-surface border-primary shadow-2xs font-semibold"
                        : "bg-surface-secondary/40 text-text-secondary border-border hover:bg-surface hover:text-text-primary"
                    )}
                  >
                    {dim.dimension}
                  </button>
                ))}
              </div>

              {(() => {
                const current = dimensions.find((d) => d.id === selectedDimension) || dimensions[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Qloo Card */}
                    <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="success" size="sm">
                          LocalMuse Ops (Qloo-Grounded)
                        </Badge>
                        <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                          {current.qlooApproach.provenanceLabel}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-text-primary">
                        {current.qlooApproach.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {current.qlooApproach.description}
                      </p>
                      <div className="p-3 rounded-xl bg-surface border border-border text-xs font-mono text-text-primary">
                        <strong className="block text-[10px] font-sans text-accent-muted uppercase mb-1">
                          Actual Generated Plan Output:
                        </strong>
                        {current.qlooApproach.specificExample}
                      </div>
                    </div>

                    {/* Generic AI Card */}
                    <div className="p-5 rounded-2xl border border-amber-500/30 bg-surface-secondary/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="neutral" size="sm">
                          Generic AI Baseline
                        </Badge>
                        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                          {current.genericApproach.vulnerabilityLabel}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-text-primary">
                        {current.genericApproach.title}
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {current.genericApproach.description}
                      </p>
                      <div className="p-3 rounded-xl bg-surface border border-border text-xs font-mono text-text-secondary italic">
                        <strong className="block text-[10px] font-sans text-accent-muted uppercase mb-1">
                          Typical Generic LLM Advice:
                        </strong>
                        {current.genericApproach.specificExample}
                      </div>
                    </div>

                    {/* Practical Takeaway Strip */}
                    <div className="md:col-span-2 p-3.5 rounded-xl bg-surface-secondary/30 border border-border flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-primary uppercase shrink-0">
                        Operational Takeaway:
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {current.practicalTakeaway}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Bottom Disclaimer */}
          <div className="text-[11px] text-accent-muted border-t border-border pt-3 font-mono">
            * Comparison Methodology: Contrasts verifiable Qloo MCP tool outputs against deterministic hospitality prompting templates. Neither approach constitutes a financial guarantee of future revenue or commercial performance.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PlanComparisonView;
