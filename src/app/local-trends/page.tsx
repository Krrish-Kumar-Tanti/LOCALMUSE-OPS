"use client";

import React from "react";
import { AppShell } from "@/components/common/AppShell";
import { LocalTrendsView } from "@/components/local-trends/LocalTrendsView";

export default function LocalTrendsPage() {
  return (
    <AppShell
      activeNavId="local-trends"
      title="Local Trends"
      description="Time-series popularity momentum curves and neighborhood density heatmaps"
    >
      <LocalTrendsView />
    </AppShell>
  );
}
