"use client";

import React from "react";
import { AppShell } from "@/components/common/AppShell";
import { LocationInsightsView } from "@/components/location-insights/LocationInsightsView";

export default function LocationInsightsPage() {
  return (
    <AppShell
      activeNavId="location-insights"
      title="Location Insights"
      description="Taste-powered peer anchors and cultural concept indexing for local enterprises"
    >
      <LocationInsightsView />
    </AppShell>
  );
}
