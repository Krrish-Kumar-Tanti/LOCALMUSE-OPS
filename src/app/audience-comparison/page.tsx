"use client";

import React from "react";
import { AppShell } from "@/components/common/AppShell";
import { AudienceComparisonView } from "@/components/audience-comparison/AudienceComparisonView";

export default function AudienceComparisonPage() {
  return (
    <AppShell
      activeNavId="compare-audiences"
      title="Audience Comparison"
      description="Cross-market taste contrast, shared passions, and distinguishing lifestyle traits"
    >
      <AudienceComparisonView />
    </AppShell>
  );
}
