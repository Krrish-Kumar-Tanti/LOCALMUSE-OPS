"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/common/AppShell";
import { BrandGlyph3D } from "@/components/common/BrandGlyph3D";
import { LocationInsightsView } from "@/components/location-insights/LocationInsightsView";
import { AudienceComparisonView } from "@/components/audience-comparison/AudienceComparisonView";
import { LocalTrendsView } from "@/components/local-trends/LocalTrendsView";
import { CulturePlanView } from "@/components/culture-plan/CulturePlanView";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";
import { GuideView } from "@/components/guide/GuideView";
import { TopNavbar } from "@/components/common/TopNavbar";
import { useAuth } from "@/lib/AuthContext";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const { openLoginModal } = useAuth();

  const handleNavSelect = (id: string) => {
    setActiveNav(id);
  };

  const getShellTitle = () => {
    switch (activeNav) {
      case "culture-plan":
        return "Weekly Cultural Operations Plan";
      case "location-insights":
        return "Location Insights";
      case "compare-audiences":
        return "Audience Comparison";
      case "local-trends":
        return "Local Trends & Momentum";
      case "recommendations":
        return "Tactical Recommendations & Ranking";
      case "guide":
        return "Platform Guide & Operational Manual";
      default:
        return "Cultural Intelligence Workbench";
    }
  };

  const getShellDescription = () => {
    switch (activeNav) {
      case "culture-plan":
        return "Agentic weekly operating rhythm synthesized across all four Qloo capabilities";
      case "location-insights":
        return "Taste-powered peer anchors and cultural concept indexing for local enterprises";
      case "compare-audiences":
        return "Cross-market taste contrast, shared passions, and distinguishing lifestyle traits";
      case "local-trends":
        return "Time-series popularity momentum curves and neighborhood density heatmaps";
      case "recommendations":
        return "Two-stage candidate discovery and ranking of operational initiatives against business goals";
      case "guide":
        return "Architecture reference, Qloo MCP protocol specification, and field operational guides";
      default:
        return "Taste-powered operations and local market intelligence for independent enterprises";
    }
  };

  return (
    <AppShell
      activeNavId={activeNav}
      onSelectNav={handleNavSelect}
      title={getShellTitle()}
      description={getShellDescription()}
      className={activeNav === "overview" ? "p-0 sm:p-0 lg:p-0 bg-background" : undefined}
    >
      {activeNav === "culture-plan" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <CulturePlanView />
        </div>
      ) : activeNav === "location-insights" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <LocationInsightsView />
        </div>
      ) : activeNav === "compare-audiences" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <AudienceComparisonView />
        </div>
      ) : activeNav === "local-trends" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <LocalTrendsView />
        </div>
      ) : activeNav === "recommendations" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <RecommendationsView />
        </div>
      ) : activeNav === "guide" ? (
        <div className="w-full text-text-primary selection:bg-primary selection:text-surface">
          <TopNavbar activeScreen={activeNav} onNavigate={handleNavSelect} />
          <div className="p-4 sm:p-6 lg:p-8">
            <GuideView onLaunchLogin={openLoginModal} />
          </div>
        </div>
      ) : (
        /* IMMERSIVE ARTISANAL HOME PAGE */
        <div className="w-full text-text-primary selection:bg-primary selection:text-surface">
          {/* Top Announcement Banner */}
          <div className="bg-surface-secondary text-text-primary py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2 border-b border-border">
            <span>Qloo Agentic Framework: Operational Cultural Intelligence for Independent Places</span>
            <button
              onClick={() => handleNavSelect("culture-plan")}
              className="underline font-semibold hover:text-primary transition-colors cursor-pointer"
            >
              Launch Weekly Copilot &rarr;
            </button>
          </div>

          {/* Sticky Top Navigation */}
          <TopNavbar activeScreen={activeNav} onNavigate={handleNavSelect} />

          {/* HERO SECTION */}
          <section className="relative px-6 sm:px-12 lg:px-20 py-16 sm:py-24 max-w-7xl mx-auto text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline and Call-to-Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-accent-muted font-mono">
                  CULTURAL TASTE SIGNALS &bull; REAL NEIGHBORHOOD AFFINITIES &bull; EMPIRICAL GROUNDING
                </div>

                <TextRevealOnScroll
                  as="h1"
                  text="The cultural operating system for America's local places."
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] font-normal tracking-tight text-text-primary"
                />

                <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl font-sans">
                  Independent cafés, natural wine bars, bakeries, and boutiques lose money guessing what their neighborhood wants. LocalMuse Ops translates macro cultural signals—music, dining, literature, and lifestyle affinities—into an actionable weekly operating rhythm grounded in verifiable Qloo taste data.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleNavSelect("culture-plan")}
                    className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Generate Weekly Plan</span>
                    <span>&rarr;</span>
                  </button>

                  <a
                    href="#comparison"
                    className="px-6 py-3 rounded-full bg-surface border border-border hover:bg-surface-secondary text-text-primary text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer shadow-2xs"
                  >
                    Compare Qloo vs. Generic AI
                  </a>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-text-secondary font-sans">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>100% Qloo Grounded</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Neighborhood Taste Vectors</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Zero Capex Initiatives</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Card */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm relative overflow-hidden space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <BrandGlyph3D size="sm" />
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-accent-muted">
                          East Austin Specialty Roastery
                        </span>
                        <h4 className="font-serif text-lg text-text-primary leading-tight">
                          Solstice Coffee Lab &bull; W45
                        </h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary font-mono text-[10px] border border-border">
                      Weekly Plan
                    </span>
                  </div>

                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-surface-secondary/40 border border-border space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-text-primary">
                        <span>Cascara Spritz Midday Feature</span>
                        <span className="text-accent-muted font-mono">2–4 PM Lull</span>
                      </div>
                      <p className="text-[11px] text-text-secondary">
                        Derived from botanical beverage momentum; batch keg tap pour protects barista flow
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-secondary/40 border border-border space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-text-primary">
                        <span>Micro-Bakery Sourdough Drop</span>
                        <span className="text-accent-muted font-mono">Consignment</span>
                      </div>
                      <p className="text-[11px] text-text-secondary">
                        Zero kitchen capex; captures lunch rush dwell before afternoon slump
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-border text-[11px] text-text-secondary">
                    <span>Qloo Provenance Verified</span>
                    <button
                      onClick={() => handleNavSelect("culture-plan")}
                      className="font-semibold text-primary hover:underline cursor-pointer"
                    >
                      View Culture Plan &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF & STATS STRIP */}
          <section className="bg-surface-secondary text-text-primary py-12 px-6 sm:px-12 border-y border-border">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              <TextRevealOnScroll
                as="h3"
                text="Built for independent hospitality and retail operators across America"
                className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-text-primary"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">4 Domains</div>
                  <p className="text-xs text-text-secondary font-sans">Anchors, Contrast, Trends, Ranking</p>
                </div>
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">100% MCP</div>
                  <p className="text-xs text-text-secondary font-sans">Canonical stdio Protocol</p>
                </div>
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">5 Modules</div>
                  <p className="text-xs text-text-secondary font-sans">Integrated Intelligence Suite</p>
                </div>
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">0 PII</div>
                  <p className="text-xs text-text-secondary font-sans">Privacy-First Taste Modeling</p>
                </div>
              </div>
            </div>
          </section>

          {/* DECISION MODULES TAXONOMY */}
          <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12 text-left">
            <div className="text-center space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent-muted font-mono">
                CORE WORKFLOW TAXONOMY
              </span>
              <TextRevealOnScroll
                as="h2"
                text="Explore by Decision Module"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-text-primary"
              />
              <p className="text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed font-sans">
                Five high-impact operational tools bridging Qloo&apos;s cultural AI protocol with small-business operations.
              </p>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                {[
                  { id: "all", label: "All Modules" },
                  { id: "copilot", label: "Flagship Copilot" },
                  { id: "places", label: "Cultural Anchors" },
                  { id: "audiences", label: "Audience Contrast" },
                  { id: "trends", label: "Momentum Curves" },
                  { id: "rank", label: "Tactical Ranking" }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategoryFilter(pill.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      selectedCategoryFilter === pill.id
                        ? "bg-primary text-surface border-primary font-semibold"
                        : "bg-surface text-text-secondary border-border hover:border-text-primary"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Flagship Weekly Culture Plan */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "copilot") && (
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider font-mono">
                        Flagship Copilot
                      </span>
                      <span className="font-mono text-[11px] text-accent-muted">/api/agent/weekly-plan</span>
                    </div>
                    <h3 className="font-serif text-2xl text-text-primary">
                      Weekly Cultural Operations Plan
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Synthesize an actionable 8-pillar operating rhythm: menu specials, acoustic soundscapes, partner activations, merchandising, social angles, and a Monday–Sunday schedule.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border text-[11px] text-text-secondary space-y-1 font-mono">
                      <strong>Architecture:</strong> Orchestrates Location Insights, Audience Contrast, Local Trends, and Qloo Rank into verified operational advice.
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("culture-plan")}
                    className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Weekly Copilot &rarr;
                  </button>
                </div>
              )}

              {/* Card 2: Location Insights */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "places") && (
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border text-[10px] font-bold uppercase tracking-wider font-mono">
                        Module 01 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-accent-muted">qloo_recommend</span>
                    </div>
                    <h3 className="font-serif text-2xl text-text-primary">
                      Location Insights &amp; Anchors
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Discover peer cultural anchors and concept tag prevalence for your category across neighborhood boundaries.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border text-[11px] text-text-secondary space-y-1 font-mono">
                      <strong>Tool Sequence:</strong> recommend (peer anchors) &rarr; entity_tags (cultural tag weights).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("location-insights")}
                    className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Location Insights &rarr;
                  </button>
                </div>
              )}

              {/* Card 3: Audience Comparison */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "audiences") && (
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border text-[10px] font-bold uppercase tracking-wider font-mono">
                        Module 02 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-accent-muted">compare_audiences</span>
                    </div>
                    <h3 className="font-serif text-2xl text-text-primary">
                      Audience Contrast Mapping
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Map shared baseline affinities vs. distinguishing lifestyle traits between two cities to tailor your menu and marketing.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border text-[11px] text-text-secondary space-y-1 font-mono">
                      <strong>Tool Sequence:</strong> describe (market entities) &rarr; compare_audiences (affinity divergence).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("compare-audiences")}
                    className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Audience Comparison &rarr;
                  </button>
                </div>
              )}

              {/* Card 4: Local Trends */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "trends") && (
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border text-[10px] font-bold uppercase tracking-wider font-mono">
                        Module 03 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-accent-muted">qloo_trends</span>
                    </div>
                    <h3 className="font-serif text-2xl text-text-primary">
                      Local Trends &amp; Momentum
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Evaluate multi-quarter popularity momentum trajectories and identify geographic density hotspots across neighborhood zip codes.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border text-[11px] text-text-secondary space-y-1 font-mono">
                      <strong>Tool Sequence:</strong> recommend (seed entities) &rarr; trends (ISO date range curve).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("local-trends")}
                    className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Local Trends &rarr;
                  </button>
                </div>
              )}

              {/* Card 5: Tactical Recommendations */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "rank") && (
                <div className="rounded-2xl border border-border bg-surface p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border text-[10px] font-bold uppercase tracking-wider font-mono">
                        Module 04 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-accent-muted">qloo_rank</span>
                    </div>
                    <h3 className="font-serif text-2xl text-text-primary">
                      Tactical Recommendations &amp; Ranking
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">
                      Two-stage candidate discovery and ranking of operational initiatives (co-working passes, seasonal menus, programming) against specific goals.
                    </p>
                    <div className="p-3 rounded-xl bg-surface-secondary/50 border border-border text-[11px] text-text-secondary space-y-1 font-mono">
                      <strong>Tool Sequence:</strong> recommend (candidate pool) &rarr; rank (fit score vs goal profile).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("recommendations")}
                    className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Recommendations &rarr;
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* STRATEGIC CONTRAST SECTION */}
          <section id="comparison" className="bg-surface-secondary/40 text-text-primary py-20 px-6 sm:px-12 lg:px-20 border-y border-border text-left">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent-muted font-mono">
                  STRATEGIC CONTRAST
                </span>
                <TextRevealOnScroll
                  as="h2"
                  text="LocalMuse Ops vs. Generic LLM Advice"
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-text-primary"
                />
                <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed font-sans">
                  The fundamental difference between taste-grounded operations and unanchored AI prompts.
                </p>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Left Card: LocalMuse Ops */}
                <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-accent-muted font-mono">
                        Qloo Grounded Protocol
                      </span>
                      <h3 className="font-serif text-2xl text-text-primary">
                        LocalMuse Ops Strategy
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-primary text-surface font-mono text-xs font-bold">
                      Grounded
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-text-primary font-sans">
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      <span><strong>Single-Origin Cascara Feature:</strong> Grounded in verified concept tag prevalence and afternoon lull demand.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      <span><strong>Acoustic Ambiance Decibel Guidance:</strong> Calibrated under 68 dB to preserve remote-work productivity.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      <span><strong>Micro-Bakery Consignment Partnership:</strong> Zero capex kitchen buildout; lifts check size without slowing barista pace.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary shrink-0 mt-0.5">✓</span>
                      <span><strong>Audience Contrast Deltas:</strong> Accounts for unique cross-market taste divergence against benchmark cities.</span>
                    </li>
                  </ul>
                </div>

                {/* Right Card: Generic LLM */}
                <div className="rounded-2xl bg-surface/60 border border-border/80 p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary font-mono">
                        Untethered LLM Prompt
                      </span>
                      <h3 className="font-serif text-2xl text-text-secondary">
                        Generic AI Advice
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-secondary text-text-secondary font-mono text-xs font-bold border border-border">
                      Unanchored
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-text-secondary font-sans">
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-sm">✕</span>
                      <span><strong>10% Off Afternoon Happy Hour:</strong> Generic margin-eroding discounting that degrades third-place positioning.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-sm">✕</span>
                      <span><strong>Generic Pop Radio Playlists:</strong> Vocal-heavy pop music that distracts working patrons and triggers churn.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-sm">✕</span>
                      <span><strong>Stock Photo Social Media Posts:</strong> Generic internet memes with zero neighborhood authenticity or footfall pull.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-rose-500 font-bold text-sm">✕</span>
                      <span><strong>Zero Cultural Grounding:</strong> No peer venue discovery, tag affinity weights, or local popularity curves.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Interactive Practical Contrast Callout */}
              <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider">
                    Practical Evaluation Tool
                  </span>
                  <h4 className="font-serif text-lg font-bold text-text-primary">
                    Evaluate Your Business Profile in Side-by-Side Contrast
                  </h4>
                  <p className="text-xs text-text-secondary max-w-xl leading-relaxed">
                    Generate a full Weekly Culture Plan and click &ldquo;Compare with Generic AI&rdquo; to evaluate cultural relevance, local district context, and evidence provenance directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavSelect("culture-plan")}
                  className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-2xs inline-flex items-center gap-2 transition-all shrink-0 cursor-pointer"
                >
                  <span>Launch Copilot &amp; Compare</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </section>

          {/* ARTISANAL FOOTER */}
          <footer className="border-t border-border bg-surface px-6 sm:px-12 py-12 text-text-secondary">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <span className="font-serif text-lg font-normal text-text-primary block">LocalMuse Ops</span>
                <p className="text-[11px] text-text-secondary font-mono">
                  Qloo Protocol Cultural Operations Architecture &bull; MIT License
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <button onClick={() => handleNavSelect("culture-plan")} className="hover:underline hover:text-text-primary cursor-pointer">
                  Weekly Plan
                </button>
                <button onClick={() => handleNavSelect("location-insights")} className="hover:underline hover:text-text-primary cursor-pointer">
                  Location Insights
                </button>
                <button onClick={() => handleNavSelect("compare-audiences")} className="hover:underline hover:text-text-primary cursor-pointer">
                  Audience Comparison
                </button>
                <button onClick={() => handleNavSelect("local-trends")} className="hover:underline hover:text-text-primary cursor-pointer">
                  Local Trends
                </button>
                <button onClick={() => handleNavSelect("recommendations")} className="hover:underline hover:text-text-primary cursor-pointer">
                  Recommendations
                </button>
                <button onClick={() => handleNavSelect("guide")} className="hover:underline hover:text-text-primary cursor-pointer">
                  Field Guide
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </AppShell>
  );
}
