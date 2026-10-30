"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";

export interface GuideViewProps {
  onLaunchLogin?: () => void;
}

interface SectionItem {
  id: string;
  number: string;
  title: string;
  summary: string;
}

const SECTIONS: SectionItem[] = [
  { id: "overview", number: "01", title: "What LocalMuse Ops Does", summary: "Core mission, aggregate cultural intelligence, and why taste vectors replace discounting" },
  { id: "navigation", number: "02", title: "Dashboard & Navigation", summary: "Header, collapsible sidebar, top navbar, theme selector, and demo operator profiles" },
  { id: "location-insights", number: "03", title: "Location Insights Workflow", summary: "Discovering peer anchors, concept tags, and demographic distributions (/location-insights)" },
  { id: "audience-comparison", number: "04", title: "Audience Comparison Workflow", summary: "Contrasting two markets to uncover shared baselines vs unique traits (/audience-comparison)" },
  { id: "local-trends", number: "05", title: "Local Trends & Momentum", summary: "Tracking multi-quarter momentum curves and neighborhood density heatmaps (/local-trends)" },
  { id: "recommendations", number: "06", title: "Recommendations & Ranking", summary: "Two-stage candidate discovery and contextual goal ranking (/recommendations)" },
  { id: "culture-plan", number: "07", title: "Weekly Culture Plan Copilot", summary: "Generating, interpreting, and exporting 7-day operational rhythms (/culture-plan)" },
  { id: "demo-vs-live", number: "08", title: "Demo Mode vs. Live Qloo Mode", summary: "Offline curated benchmark simulation vs authentic live MCP tool execution" },
  { id: "evidence-vs-agent", number: "09", title: "Qloo Evidence vs. Agent Suggestions", summary: "Empirical taste vectors vs operational LLM synthesis and provenance drawers" },
  { id: "generic-vs-qloo", number: "10", title: "Generic AI vs. Qloo & Feedback", summary: "Strategic homepage contrast vs runtime execution, and milestone feedback handling" },
  { id: "troubleshooting", number: "11", title: "Troubleshooting & Error Codes", summary: "Diagnosing HTTP 401 QLOO_AUTH, HTTP 400 inputs, HTTP 502 MCP, and port 4000 status" },
];

export function GuideView({ onLaunchLogin }: GuideViewProps) {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-6 px-4 sm:px-6 lg:px-8 text-text-primary text-left">
      {/* Hero Banner */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 space-y-5 shadow-2xs text-left relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="info" size="sm">
            Official Platform Manual
          </Badge>
          <Badge variant="neutral" size="sm">
            LocalMuse Ops v1.0
          </Badge>
          <span className="text-xs font-mono text-accent-muted hidden sm:inline">&bull; Operator Field Guide &amp; Protocol Reference</span>
        </div>

        <div className="space-y-2">
          <TextRevealOnScroll
            as="h1"
            text="LocalMuse Ops Field Manual & User Guide"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-primary tracking-tight"
          />
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl font-sans">
            A comprehensive reference manual for taste-driven cultural operations. Learn how each modular workflow queries Qloo protocols, how the flagship copilot synthesizes weekly operations plans, how empirical data is separated from AI interpretations, and how to troubleshoot live API credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/culture-plan"
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-2xs inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Launch Flagship Copilot</span>
            <span>&rarr;</span>
          </Link>
          {onLaunchLogin && (
            <button
              type="button"
              onClick={onLaunchLogin}
              className="px-5 py-2.5 rounded-full bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary border border-border text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Switch Operator Persona</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Table of Contents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-accent-muted font-bold">
            Table of Contents &amp; Quick Navigation
          </h2>
          <span className="text-xs font-mono text-text-secondary">11 Modules Covered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={cn(
                "p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5",
                activeSection === sec.id
                  ? "border-primary bg-surface shadow-xs ring-1 ring-primary/20"
                  : "border-border bg-surface/70 hover:bg-surface hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">{sec.number}</span>
                <span className="text-[10px] font-mono text-accent-muted uppercase">Jump &darr;</span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{sec.title}</h3>
              <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">{sec.summary}</p>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: What the Website Does */}
      <section id="overview" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">01</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">What LocalMuse Ops Does</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-lg">Turning Aggregate Taste Intelligence into Daily Hospitality Operations</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              LocalMuse Ops is an AI-powered Cultural Operations Copilot designed specifically for neighborhood cafés, specialty coffee roasters, craft cocktail bars, listening lounges, bistros, and indie retail establishments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <p>
              Independent operators often struggle with slow weekday afternoons, unpredictable footfall, and margin-eroding discounting. Rather than relying on price cuts or generic internet prompts, LocalMuse Ops queries <strong>aggregate cross-domain cultural taste data from Qloo</strong> to identify what neighborhood patrons genuinely appreciate across music, gastronomy, design, literature, and social atmosphere.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">Core Pillar 01</span>
                <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Increase Check Size</h4>
                <p className="text-[11px] leading-relaxed">
                  Introduce high-affinity culinary pairings (e.g. single-origin cascara spritzes, yuzu cold brew tonics, or local artisan bakery drops) that patrons happily pay a premium for without discounts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">Core Pillar 02</span>
                <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Extend Patron Dwell Time</h4>
                <p className="text-[11px] leading-relaxed">
                  Curate atmosphere soundscapes (e.g. Japanese City Pop, chillhop, ambient jazz) calibrated to preserve productivity for remote-working patrons and extend stay duration.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <span className="font-mono text-[10px] uppercase font-bold text-primary">Core Pillar 03</span>
                <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Drive Recurring Footfall</h4>
                <p className="text-[11px] leading-relaxed">
                  Form strategic collaborative popups with verified high-affinity neighborhood anchors (independent record shops, ceramicists, micro-bakers) during typical lull shifts.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-text-primary flex items-start gap-2.5">
              <span className="text-primary font-bold text-sm shrink-0">&bull;</span>
              <p className="text-xs leading-relaxed">
                <strong>Privacy &amp; Data Ethics:</strong> LocalMuse Ops never requests, stores, or transmits individual patron data or PII (Personally Identifiable Information). All analyses operate strictly over aggregate geographic and cultural correlation vectors from Qloo.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 2: Dashboard & Navigation */}
      <section id="navigation" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">02</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Dashboard &amp; Navigation</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-lg">Workspace Layout &amp; Theme Controls</CardTitle>
            <CardDescription className="text-sm">
              The application provides persistent layout elements to navigate workflows, toggle operating modes, and customize display themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-surface-secondary/30 space-y-2">
                <h4 className="font-semibold text-text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Top Navigation Bar (Public &amp; Mobile)
                </h4>
                <ul className="space-y-1.5 text-xs list-disc pl-4">
                  <li><strong>Brand Identity &amp; Home:</strong> Clickable LocalMuse Ops crest that returns to the landing page and strategic contrast overview.</li>
                  <li><strong>Direct Navigation Pills:</strong> Immediate links across all workspace screens (Overview, Weekly Culture Plan, Location Insights, Audience Comparison, Local Trends, Recommendations, and Platform Guide).</li>
                  <li><strong>Theme Selector:</strong> 3-way toggle (Sun for Classic Latte, Monitor for System, Moon for Deep Charcoal).</li>
                  <li><strong>Backend Health Status:</strong> Real-time indicator displaying Port 4000 connection status.</li>
                  <li><strong>Operator Persona:</strong> Launches the demo operator persona selector to test Austin, Brooklyn, Seattle, or Enterprise Lead profiles.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-surface-secondary/30 space-y-2">
                <h4 className="font-semibold text-text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  App Sidebar (Workspace Navigation)
                </h4>
                <ul className="space-y-1.5 text-xs list-disc pl-4">
                  <li><strong>Brand Header:</strong> Direct jump back to the platform overview.</li>
                  <li><strong>Engine Status Pill:</strong> Displays current active engine (<span className="text-amber-600 dark:text-amber-400 font-mono">Demo Fixtures</span> or <span className="text-emerald-600 dark:text-emerald-400 font-mono">Live Qloo</span>).</li>
                  <li><strong>Workflow Navigation:</strong> Direct access buttons for the flagship Weekly Culture Plan copilot and Discovery Workflows 01 through 04, with status badges.</li>
                  <li><strong>Operator Persona Card:</strong> Shows the active persona venue or provides a one-click &ldquo;Select/Switch Persona &rarr;&rdquo; launcher.</li>
                  <li><strong>Workspace Footer:</strong> Displays application version (v1.0.0) and Qloo MCP stdio protocol info (or active session details with Reset action). On mobile/tablet devices, navigation is toggled via the header drawer button.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-surface-secondary/20 space-y-2">
              <h4 className="font-semibold text-text-primary text-xs sm:text-sm">The 3 Theme Modes</h4>
              <p className="text-xs">
                LocalMuse Ops features three semantic theme palettes adhering to WCAG AA contrast standards:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-[#DCCDBB] bg-[#FFFDF9] text-[#38291F]">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#79543D]">Classic Latte (Light)</span>
                  <p className="text-[11px] text-[#796858] mt-1">Background `#F5EFE6`, cards `#FFFDF9`, borders `#DCCDBB`, text `#38291F`, and espresso accent `#79543D`.</p>
                </div>
                <div className="p-3 rounded-xl border-[#414039] bg-[#242522] text-[#F1E8DC] border">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#B58B68]">Deep Charcoal (Dark)</span>
                  <p className="text-[11px] text-[#BDB2A4] mt-1">Background `#191A19`, cards `#242522`, borders `#414039`, text `#F1E8DC`, and roasted coffee accent `#B58B68`.</p>
                </div>
                <div className="p-3 rounded-xl border border-border bg-surface-secondary/60 text-text-primary">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary">System Theme</span>
                  <p className="text-[11px] text-text-secondary mt-1">Dynamically synchronizes with the operating system&apos;s `prefers-color-scheme` setting using anti-flash pre-render scripts.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 3: Location Insights Workflow */}
      <section id="location-insights" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">03</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Workflow 01: Location Insights &amp; Peer Anchors</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Discovering Peer Anchors, Concept Tags, and Demographic Indexes</CardTitle>
              <Badge variant="neutral" size="sm">/location-insights</Badge>
            </div>
            <CardDescription className="text-sm">
              Identifies cultural anchor venues patrons visit, defining concept tags, and target age demographics for any business type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Actual Form Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Category / Concept * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Dropdown: 8 options (Specialty Coffee, Artisanal Bakery, Craft Cocktail, Wine Bar, Bookstore Café, Casual Bistro, Tea Room, Microbrewery) or Custom.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">City / Market * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Geographic market (e.g. Austin, TX, South Delhi, or Gurgaon).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Neighborhood / District (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Local district to refine clusters (e.g. East Austin 78702 or Hauz Khas).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Description (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Operational nuances (e.g. 35-seat craft café with patio and vinyl audio).</p>
              </div>
            </div>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Available Buttons &amp; Actions</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Load Austin Coffee Preset:</strong> Automatically fills in Austin, TX, East Austin (78702), specialty-coffee, and patio craft roastery description.</li>
              <li><strong>Demo Mode / Live Qloo Mode Toggle:</strong> Switches between curated benchmark fixtures and live Qloo MCP execution.</li>
              <li><strong>Generate Demo Insights / Query Live Qloo Engine:</strong> Submits the form to the backend endpoint (`POST /api/location-insights`).</li>
              <li><strong>Clear Results:</strong> Resets the query dashboard back to the initial state.</li>
            </ul>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Returned Outputs &amp; Disclosures</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Cultural Concept Tags:</strong> In Demo mode, displays prevalence badges (High, Moderate) and concept URNs. In Live mode, displays empirical tag scores.</li>
              <li><strong>Cultural Peer Anchors:</strong> Venue cards showing category, address, vibe keywords, and scores. Demo scores are labeled <em>Demo Index (/100)</em>; Live scores are labeled <em>Qloo Score</em>.</li>
              <li><strong>Target Demographic Indexing:</strong> Primary Age Bracket, Target Segments, and Defining Lifestyle Affinities.</li>
              <li><strong>Qloo Tool Chaining Trace:</strong> In Live mode, chains `qloo_find_tags` &rarr; `qloo_recommend (place)` &rarr; `qloo_entity_tags`.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 4: Audience Comparison Workflow */}
      <section id="audience-comparison" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">04</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Workflow 02: Audience Contrast Mapping</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Contrasting Cultural Affinities Between Two Local Markets</CardTitle>
              <Badge variant="neutral" size="sm">/audience-comparison</Badge>
            </div>
            <CardDescription className="text-sm">
              Reveals shared baseline cultural passions versus distinguishing local traits between two localities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Actual Form Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Location A / Primary Market * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Baseline locality (e.g. South Delhi or Austin, TX).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Location B / Comparison Market * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Comparison or expansion target (e.g. Gurgaon or Nashville, TN).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Target Affinity Dimension (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Dropdown: Dining, Music, Nightlife, Fashion, Media, or All Categories Combined (`brand`).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Category Lens (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Operational lens used to frame comparative takeaways (e.g. Specialty Coffee).</p>
              </div>
            </div>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Available Buttons &amp; Actions</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Load South Delhi vs Gurgaon:</strong> Populates South Delhi as Location A and Gurgaon as Location B.</li>
              <li><strong>Load Austin vs Nashville:</strong> Populates Austin, TX as Location A and Nashville, TN as Location B.</li>
              <li><strong>Swap Locations:</strong> Inverts Location A and Location B immediately in the form state.</li>
              <li><strong>Compare Demo Audiences / Compare Live Audiences:</strong> Submits to `POST /api/compare-audiences`.</li>
              <li><strong>Clear Results:</strong> Clears the comparison view.</li>
            </ul>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Returned Outputs &amp; Disclosures</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Operational Strategic Takeaway:</strong> High-level summary of the primary behavioral divergence.</li>
              <li><strong>Side-by-Side Market Profiles:</strong> Dominant Lifestyle Themes and Cultural Anchor Signals for both markets.</li>
              <li><strong>Shared Cultural Interests:</strong> Cross-market concepts with overlap scores (Demo: <em>Illustrative Index /100</em>; Live: <em>Qloo Affinity Index</em>).</li>
              <li><strong>Distinct Cultural Signals:</strong> Two distinct columns highlighting traits unique to Market A (cyan indicator) and Market B (amber indicator).</li>
              <li><strong>Qloo Tool Chaining Trace:</strong> In Live mode, chains `qloo_describe (locality A &amp; B)` &rarr; `qloo_compare_audiences`.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 5: Local Trends & Momentum */}
      <section id="local-trends" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">05</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Workflow 03: Local Trends &amp; Momentum</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Multi-Quarter Cultural Curves &amp; Neighborhood Density Heatmaps</CardTitle>
              <Badge variant="neutral" size="sm">/local-trends</Badge>
            </div>
            <CardDescription className="text-sm">
              Tracks multi-quarter cultural velocity and reveals micro-district affinity heatmaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Actual Form Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">City / Target Market * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Primary city (e.g. Austin, TX, South Delhi, or Gurgaon).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Trend Category * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Dropdown: Specialty Coffee, Cocktails &amp; Nightlife, Artisan Dining, Indie Music, Wellness, or Custom.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Start Date (YYYY-MM-DD) * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Beginning of evaluation window (default `2025-01-01`).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">End Date (YYYY-MM-DD) * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Conclusion of evaluation window (default `2026-06-30`).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Neighborhood / Micro-district (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Sub-district to focus density heatmaps.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Concept Profile (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Concept context to frame operational implications.</p>
              </div>
            </div>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Available Buttons &amp; Actions</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Load South Delhi Dining:</strong> Fills South Delhi, artisan-dining, and Hauz Khas.</li>
              <li><strong>Load Gurgaon Lifestyle:</strong> Fills Gurgaon, wellness-lifestyle, and Cyber City.</li>
              <li><strong>Load Austin Music:</strong> Fills Austin, TX, indie-music, and Red River Cultural District.</li>
              <li><strong>Load Austin Coffee:</strong> Fills Austin, TX, specialty-coffee, and East Austin.</li>
              <li><strong>Discover Demo Trends / Discover Live Trends:</strong> Submits to `POST /api/local-trends`.</li>
              <li><strong>Clear Results:</strong> Clears the trends dashboard.</li>
            </ul>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Returned Outputs &amp; Disclosures</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Multi-Quarter Momentum Timeline:</strong> 6 quarters of momentum scores displayed with gradient progress bars. Demo scores are labeled <em>Illustrative Momentum Index</em>; Live scores are computed from Qloo time-series.</li>
              <li><strong>Emerging Cultural Shifts:</strong> Shift cards with growth badges (e.g. `+38% YoY` in demo fixtures), pioneering local spots, and operational implication callouts.</li>
              <li><strong>Neighborhood Affinity Density:</strong> Heatmap cards with density badges (`Peak`, `High`, `Moderate`) and patron profiles.</li>
              <li><strong>Qloo Tool Chaining Trace:</strong> In Live mode, chains `qloo_recommend (seed entities)` &rarr; `qloo_trends (time-series metrics)`.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 6: Recommendations & Ranking */}
      <section id="recommendations" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">06</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Workflow 04: Tactical Recommendations &amp; Ranking</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Two-Stage Discovery and Multi-Attribute Prioritization</CardTitle>
              <Badge variant="neutral" size="sm">/recommendations</Badge>
            </div>
            <CardDescription className="text-sm">
              Discovers candidate operational initiatives and contextually ranks them against your strategic goal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Actual Form Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Name * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Enterprise name (e.g. Solstice Craft Coffee Lab).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Category * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Dropdown: 8 industry options (Specialty Coffee, Bakery, Cocktail, etc.) or Custom.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">City / Market * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Primary city market (e.g. Austin, TX or South Delhi).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Neighborhood / District (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Neighborhood boundary for hyper-local calibration.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30 sm:col-span-2">
                <span className="font-bold text-text-primary">Strategic Business Goal / Objective * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Dropdown: 5 commercial goals (Boost Midweek Footfall, Elevate Check Size, Attract Remote Workers, Evening Programming, Brand Identity) or Custom.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Target Patron Segment (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Target audience (e.g. Creative freelancers &amp; designers).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Atmosphere &amp; Vibe Keywords (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Descriptors of your venue space (e.g. vinyl patio, natural wine).</p>
              </div>
            </div>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Available Buttons &amp; Actions</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Presets:</strong> `Austin Café (Footfall)`, `South Delhi Bistro`, and `Gurgaon Wellness`.</li>
              <li><strong>Filter by Type:</strong> Pill buttons (`All`, `culinary`, `programming`, `partnership`, `atmosphere`) to filter results interactively.</li>
              <li><strong>Generate Ranked Initiatives / Execute Live Ranking:</strong> Submits to `POST /api/recommendations`.</li>
              <li><strong>Clear Results:</strong> Clears the recommendations dashboard.</li>
            </ul>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Returned Outputs &amp; Disclosures</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Strategy Overview Card:</strong> Displays total ranked initiatives, count of low-effort options, and projected revenue impact summary. Impact figures are explicitly disclosed as agent-derived operational projections, never Qloo empirical data points.</li>
              <li><strong>Ranked Opportunity Cards:</strong> Each card displays rank (#1 Top Ranked, #2, #3), Fit Score (Demo: <em>Illustrative Fit Score /100</em>; Live: <em>Qloo Affinity Score</em>), operational effort badge (`Low`, `Medium`, `High`), target patron segment, strategic rationale, and numbered implementation milestones.</li>
              <li><strong>Stage 1 Candidate Pool Disclosure:</strong> In Live mode, displays the raw candidate options discovered by `qloo_recommend` prior to `qloo_rank` multi-attribute scoring.</li>
              <li><strong>Qloo Tool Chaining Trace:</strong> In Live mode, chains `qloo_recommend &rarr; qloo_rank`.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 7: Weekly Culture Plan Copilot */}
      <section id="culture-plan" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">07</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Flagship Copilot: Weekly Culture Plan</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generating, Interpreting, and Exporting the Weekly Operations Plan</CardTitle>
              <Badge variant="success" size="sm">/culture-plan</Badge>
            </div>
            <CardDescription className="text-sm">
              The flagship cognitive agent orchestrating all four workflows into one unified Monday–Sunday operational plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <h4 className="font-semibold text-text-primary text-xs sm:text-sm">Actual Form Fields</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Name * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Enterprise name (e.g. Flat Track Coffee &amp; Roasters).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Business Category * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Operational format (e.g. specialty coffee &amp; roastery).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Primary City Market * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Primary city locality (e.g. Austin).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Neighborhood (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Sub-locality (e.g. East Austin Cesar Chavez).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Operational Goal / Objective * (Required)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Specific weekly target (e.g. Increase weekday afternoon footfall).</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/30">
                <span className="font-bold text-text-primary">Benchmark Comparison City (Optional)</span>
                <p className="font-sans text-[11px] text-text-secondary mt-0.5">Text input: Optional contrast city (e.g. Nashville). Can be omitted.</p>
              </div>
            </div>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Available Presets &amp; Buttons</h4>
            <ul className="space-y-1.5 text-xs list-disc pl-4">
              <li><strong>Preset 1: Austin:</strong> Flat Track Coffee (Austin, East Austin, benchmark Nashville).</li>
              <li><strong>Preset 2: Brooklyn:</strong> Dorsia &amp; Disc Provisions (natural wine bar, North Williamsburg, benchmark Austin).</li>
              <li><strong>Preset 3: Seattle:</strong> Page &amp; Pour Bookshop (independent bookstore &amp; café, Capitol Hill, benchmark Portland).</li>
              <li><strong>Generate Weekly Culture Plan:</strong> Submits to `POST /api/agent/weekly-plan`.</li>
            </ul>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">The 8 Plan Sections</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">1. Executive Strategy:</strong> Strategic operations thesis and target outcomes.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">2. Cultural Anchors &amp; Demographics:</strong> High-affinity peer venues and target patron profile.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">3. Weekly Specials &amp; Menu Features:</strong> Days, items, pricing rationale, and provenance pills.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">4. Events &amp; Strategic Partnerships:</strong> Community collaborations, co-promotions, and URN provenance.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">5. Atmosphere &amp; Soundscape Direction:</strong> Instrumental genre, soundscape vibe, and lighting pacing.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">6. Localized Social Storytelling:</strong> Day-by-day content hooks with individual `Copy Hook Copy` buttons.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">7. Monday–Sunday Operational Schedule:</strong> Concrete shift duties, milestones, and target outcomes.
              </div>
              <div className="p-3 rounded-xl border border-border bg-surface-secondary/20">
                <strong className="text-text-primary">8. Expected Impact &amp; Provenance:</strong> Clear separation of empirical Qloo signals (concept tags, momentum curves, anchor entities) from agent-estimated operational projections (dwell time lift, ticket size growth). Impact summaries explicitly disclose that figures are operational benchmark projections rather than guaranteed commercial returns.
              </div>
            </div>

            <h4 className="font-semibold text-text-primary text-xs sm:text-sm pt-2">Export Actions</h4>
            <p className="text-xs">
              The plan view provides a dedicated clipboard export action:
            </p>
            <div className="p-3 rounded-xl border border-border bg-surface-secondary/40">
              <strong className="text-text-primary text-xs font-mono">Export Plan (Markdown) Button</strong>
              <p className="text-[11px] text-text-secondary mt-1">
                Located at the top right of the generated results. Copies a fully formatted markdown briefing document directly to your clipboard, ready to paste into shift notes, print for backroom bulletin boards, or send via email to staff leads.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 8: Demo Mode vs Live Qloo Mode */}
      <section id="demo-vs-live" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">08</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Demo Mode vs. Live Qloo Mode</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-lg">Operation Modes &amp; Data Isolation</CardTitle>
            <CardDescription className="text-sm">
              LocalMuse Ops maintains strict architectural isolation between offline benchmark fixtures and live Qloo MCP execution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Demo Mode Column */}
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" size="sm">Demo Mode</Badge>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">Curated Simulation</span>
                </div>
                <h4 className="font-semibold text-text-primary text-sm">Offline Curated Fixtures</h4>
                <ul className="space-y-2 text-xs list-disc pl-4 text-text-secondary">
                  <li><strong>Zero Key Required:</strong> Runs completely offline without an API key or internet access.</li>
                  <li><strong>Curated Datasets:</strong> Pre-calculated benchmark data for Austin, TX (and Nashville comparison). For all other locations (including South Delhi, Gurgaon, Brooklyn, Seattle, or custom entries), the mock engine dynamically generates adapted illustrative fixtures.</li>
                  <li><strong>Clear Disclosures:</strong> Always labeled with prominent amber disclaimer banners indicating data is illustrative.</li>
                  <li><strong>Zero External Traffic:</strong> Guarantees zero calls to external network servers.</li>
                </ul>
              </div>

              {/* Live Qloo Mode Column */}
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="success" size="sm">Live Qloo Mode</Badge>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Official MCP Chaining</span>
                </div>
                <h4 className="font-semibold text-text-primary text-sm">Authentic Qloo MCP Server</h4>
                <ul className="space-y-2 text-xs list-disc pl-4 text-text-secondary">
                  <li><strong>API Key Mandatory:</strong> Requires an event-issued `QLOO_API_KEY` configured in `server/.env`.</li>
                  <li><strong>Direct Tool Invocation:</strong> Calls actual Qloo tools (`qloo_find_tags`, `qloo_recommend`, `qloo_entity_tags`, `qloo_describe`, `qloo_compare_audiences`, `qloo_trends`, `qloo_rank`).</li>
                  <li><strong>Zero Mock Fallback:</strong> If credentials are missing or the API returns an error, the backend immediately fails fast with HTTP 401 `QLOO_AUTH`. It never silently substitutes mock data.</li>
                  <li><strong>Empirical Signals:</strong> Returns real entity URNs, measured momentum curves, and official taste correlations.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 9: Qloo Evidence vs Agent Suggestions */}
      <section id="evidence-vs-agent" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">09</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Qloo Evidence vs. Agent-Derived Suggestions</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-lg">Empirical Ground Truth vs. Operational AI Synthesis</CardTitle>
            <CardDescription className="text-sm">
              How the platform clearly discloses what originates from Qloo versus what is synthesized by the AI agent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <p>
              Every recommendation in the Weekly Culture Plan displays an interactive <strong>Provenance Pill</strong> identifying its exact origin type:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-surface-secondary/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="success" size="sm">Qloo Empirical Evidence</Badge>
                  <code className="text-[10px] font-mono text-primary font-bold">origin: qloo_evidence</code>
                </div>
                <p className="text-xs">
                  Direct empirical data points returned by Qloo tools. This includes verified concept tags, place entity URNs, time-series momentum curves, and demographic age indexing.
                </p>
                <div className="p-2.5 rounded-lg bg-surface border border-border text-[11px] font-mono text-text-secondary">
                  Example: Tag &ldquo;cascara&rdquo; (URN: urn:tag:culinary:cascara) with empirical affinity signal.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/30 bg-surface-secondary/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">Agent Derived Suggestion</Badge>
                  <code className="text-[10px] font-mono text-primary font-bold">origin: agent_derived</code>
                </div>
                <p className="text-xs">
                  Operational suggestions derived by the cognitive synthesizer to achieve your specific goal using the verified Qloo signal. The AI creates the menu item name, pricing rationale, and shift milestone.
                </p>
                <div className="p-2.5 rounded-lg bg-surface border border-border text-[11px] font-mono text-text-secondary">
                  Example: &ldquo;Sparkling Cascara Cold Foam Spritz&rdquo; offered at $6.50 on Wednesday afternoon shifts.
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/30 space-y-1">
              <h5 className="font-semibold text-text-primary text-xs">Interactive Provenance Drawer</h5>
              <p className="text-xs">
                Clicking the tool name next to any provenance badge expands a detailed drawer displaying the <strong>Grounding Entity/Tag</strong>, the <strong>Empirical Signal</strong>, and the <strong>Interpretation Note</strong> explaining how the agent bridged data into practice.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-surface-secondary/30 space-y-1">
              <h5 className="font-semibold text-text-primary text-xs">Live Mode Soundscape Rule</h5>
              <p className="text-xs">
                In Live Mode, static illustrative artist names are automatically suppressed to ensure the agent never fabricates artist endorsements or invents unverified streaming scores.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 10: Generic AI vs Qloo Comparison & Feedback */}
      <section id="generic-vs-qloo" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">10</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Generic AI vs. Qloo &amp; Feedback Handling</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-lg">Factual Breakdown of Comparison Features and Feedback Mechanisms</CardTitle>
            <CardDescription className="text-sm">
              Clarifying how the strategic comparison is displayed and how patron feedback is handled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
              <h4 className="font-semibold text-text-primary text-xs sm:text-sm">
                Generic AI vs. Qloo Comparison: Educational Contrast &amp; Practical Tool
              </h4>
              <p className="text-xs">
                <strong>Execution Truth:</strong> The application does <em>not</em> execute generic unanchored AI prompts alongside Qloo during backend workflow runs. The platform exclusively executes taste-grounded Qloo toolchains.
              </p>
              <p className="text-xs">
                To evaluate the difference in practice, the Weekly Culture Plan copilot (`/culture-plan`) provides an interactive <strong>&ldquo;Compare with Generic AI&rdquo;</strong> feature. This contrasts your generated Qloo plan against a transparent, deterministic generic strategy baseline across 5 core dimensions: <em>Cultural Relevance</em>, <em>Local Market Context</em>, <em>Evidence and Provenance</em>, <em>Operational Recommendations</em>, and <em>Implementation Practicality</em>.
              </p>
              <p className="text-xs text-accent-muted font-mono">
                * Note: The generic baseline is a rule-based illustrative example. The comparison demonstrates methodology and does not claim or guarantee increased revenue.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-surface-secondary/20 space-y-2">
              <h4 className="font-semibold text-text-primary text-xs sm:text-sm">
                Lightweight Operator Shift Review &amp; Local Memory
              </h4>
              <p className="text-xs">
                <strong>Persistence Architecture:</strong> LocalMuse Ops implements lightweight, client-side operator review memory using browser `localStorage` (<code className="font-mono text-primary font-bold">localmuse_operator_feedback</code>).
              </p>
              <p className="text-xs">
                After generating a plan, venue operators can submit a 1–5 star feasibility rating, select diagnostic tags (<em>Relevant</em>, <em>Not relevant</em>, <em>Too expensive</em>, <em>Difficult to implement</em>, <em>Other</em>), and add an optional 280-character shift note. When returning to that venue profile in subsequent sessions, the copilot displays a <strong>&ldquo;Prior Operator Memory&rdquo;</strong> banner allowing the operator to apply previous learnings directly to their operational goal.
              </p>
              <p className="text-xs text-accent-muted font-mono">
                * Privacy Notice: Stored exclusively on your local browser. It is not transmitted to external cloud databases or recorded as Qloo customer-level data.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 11: Common Errors & Troubleshooting */}
      <section id="troubleshooting" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border">11</span>
          <h2 className="font-serif text-2xl font-bold text-text-primary">Common Errors &amp; Troubleshooting</h2>
        </div>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-lg">Diagnosing and Resolving Backend Statuses &amp; Error Envelopes</CardTitle>
            <CardDescription className="text-sm">
              Verified mapping of HTTP response codes, error envelopes, and recovery actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            <div className="space-y-3">
              {/* Error 1: QLOO_AUTH (401) */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">HTTP 401 &bull; QLOO_AUTH</span>
                    <Badge variant="warning" size="sm">Authentication Required</Badge>
                  </div>
                </div>
                <p className="text-xs">
                  <strong>Trigger:</strong> Querying in Live Qloo Mode when `QLOO_API_KEY` is missing or rejected by the Qloo API.
                </p>
                <p className="text-xs">
                  <strong>UI Behavior:</strong> Displays a dedicated Authentication Required card explaining that an event-issued API key is required.
                </p>
                <p className="text-xs">
                  <strong>Fix:</strong> Click <strong>Switch to Demo Mode</strong> to test with curated benchmark fixtures, or set <code className="font-mono px-1 py-0.5 rounded bg-surface border border-border text-text-primary">QLOO_API_KEY=your_key</code> in <code className="font-mono px-1 py-0.5 rounded bg-surface border border-border text-text-primary">server/.env</code> and restart the backend.
                </p>
              </div>

              {/* Error 2: HTTP 400 needs_input */}
              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-primary">HTTP 400 &bull; needs_input</span>
                    <Badge variant="neutral" size="sm">Validation Error</Badge>
                  </div>
                </div>
                <p className="text-xs">
                  <strong>Trigger:</strong> Submitting a form with missing required fields (e.g. submitting an empty city or omitting the business category).
                </p>
                <p className="text-xs">
                  <strong>UI Behavior:</strong> Renders an inline validation alert explaining which parameters are missing.
                </p>
                <p className="text-xs">
                  <strong>Fix:</strong> Fill in all fields marked with an asterisk (*), or click any preset button to populate verified defaults.
                </p>
              </div>

              {/* Error 3: HTTP 502 QLOO_MCP_ERROR */}
              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-primary">HTTP 502 &bull; QLOO_MCP_ERROR</span>
                    <Badge variant="danger" size="sm">Bad Gateway / Upstream Error</Badge>
                  </div>
                </div>
                <p className="text-xs">
                  <strong>Trigger:</strong> An underlying Qloo MCP tool execution failed, timed out, or returned an unparseable response.
                </p>
                <p className="text-xs">
                  <strong>UI Behavior:</strong> Displays an `ErrorState` card with the backend summary and a <strong>Retry Query</strong> button.
                </p>
                <p className="text-xs">
                  <strong>Fix:</strong> Click <strong>Retry Query</strong>, or switch to Demo Mode if the external API is experiencing downtime.
                </p>
              </div>

              {/* Error 4: Network Error (HTTP 0) */}
              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-primary">HTTP 0 &bull; Network Failure</span>
                    <Badge variant="danger" size="sm">Connection Refused</Badge>
                  </div>
                </div>
                <p className="text-xs">
                  <strong>Trigger:</strong> The Express backend server on port 4000 is stopped or unreachable.
                </p>
                <p className="text-xs">
                  <strong>UI Behavior:</strong> The sidebar/header health pill changes to &ldquo;Connecting...&rdquo;, and queries throw a network error.
                </p>
                <p className="text-xs">
                  <strong>Fix:</strong> Start the backend service in your terminal: <code className="font-mono px-1 py-0.5 rounded bg-surface border border-border text-text-primary">cd server &amp;&amp; npm run dev</code>.
                </p>
              </div>

              {/* Note 5: Graceful Degradation */}
              <div className="p-4 rounded-xl border border-border bg-surface-secondary/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-text-primary">HTTP 200 &bull; Graceful Partial Degradation</span>
                    <Badge variant="info" size="sm">Non-Fatal Degradation</Badge>
                  </div>
                </div>
                <p className="text-xs">
                  <strong>Behavior:</strong> In the Weekly Culture Plan copilot, if an optional benchmark comparison city fails locality resolution or the local trends stage returns empty data, the orchestrator preserves the overall plan and safely marks that sub-section as degraded or omitted rather than failing the whole weekly schedule.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer Navigation Strip */}
      <div className="p-6 rounded-3xl border border-border bg-surface text-center space-y-3">
        <h3 className="font-serif text-xl font-bold text-text-primary">Ready to Explore Taste-Driven Operations?</h3>
        <p className="text-xs text-text-secondary max-w-lg mx-auto">
          Launch the flagship Weekly Culture Plan copilot or evaluate any of the four discovery workflows.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/culture-plan"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            Launch Weekly Culture Plan
          </Link>
          <Link
            href="/location-insights"
            className="px-6 py-2.5 rounded-full bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary border border-border text-xs font-semibold transition-all cursor-pointer"
          >
            Explore Location Insights
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GuideView;
