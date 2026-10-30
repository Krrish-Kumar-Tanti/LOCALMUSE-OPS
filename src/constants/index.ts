/**
 * LocalMuse Ops - Frontend Application Constants
 */

export const APP_CONFIG = {
  name: "LocalMuse Ops",
  tagline: "Taste-Driven Cultural Operations Intelligence",
  version: "0.1.0",
  description:
    "Production-grade, taste-driven operations copilot for local hospitality and retail enterprises, powered by the canonical Qloo MCP protocol.",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  defaultMode: "demo" as const,
  defaultLocation: "Austin, TX",
  defaultCategory: "specialty coffee & roastery"
};

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/",
    description: "System overview, active mode, and workflow index"
  },
  {
    id: "culture-plan",
    label: "Weekly Culture Plan",
    href: "/culture-plan",
    description: "Agentic weekly operating rhythm synthesized across all four Qloo capabilities",
    badge: "Copilot"
  },
  {
    id: "location-insights",
    label: "Location Insights",
    href: "/location-insights",
    description: "Cultural anchors, tag prevalence & demographic indexing",
    badge: "Module 01"
  },
  {
    id: "compare-audiences",
    label: "Audience Comparison",
    href: "/audience-comparison",
    description: "Cross-market affinity contrast & divergence mapping",
    badge: "Module 02"
  },
  {
    id: "local-trends",
    label: "Local Trends",
    href: "/local-trends",
    description: "Time-series popularity momentum & neighborhood heatmaps",
    badge: "Module 03"
  },
  {
    id: "recommendations",
    label: "Recommendations",
    href: "/recommendations",
    description: "Two-stage candidate discovery & tactical goal ranking",
    badge: "Module 04"
  },
  {
    id: "guide",
    label: "Platform Guide",
    href: "/guide",
    description: "Operational manual, Qloo toolchains & responsible AI rules",
    badge: "Manual"
  }
];
