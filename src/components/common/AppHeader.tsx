"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { OperationMode } from "@/types";

export interface AppHeaderProps {
  title?: string;
  description?: string;
  mode?: OperationMode;
  onToggleMode?: () => void;
  isBackendOnline?: boolean;
  isMcpConnected?: boolean;
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function AppHeader({
  title = "Operations & Cultural Intelligence",
  description = "Taste-powered local market intelligence for independent enterprises",
  mode = "demo",
  onToggleMode,
  isBackendOnline = true,
  isMcpConnected = true,
  onMobileMenuToggle,
  className
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-10",
        className
      )}
    >
      {/* Left: Mobile trigger & view title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Drawer"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex flex-col truncate">
          <h1 className="text-sm sm:text-base font-semibold text-zinc-100 truncate tracking-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-zinc-400 truncate">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Connection status & Mode toggle control */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Backend health status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-[11px] text-zinc-400">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              isBackendOnline && isMcpConnected ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
            )}
          />
          <span>{isBackendOnline ? "Backend Connected (Port 4000)" : "Connecting to Backend..."}</span>
        </div>

        {/* Mode switcher button */}
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800/80 transition-colors text-xs text-zinc-300 font-medium cursor-pointer"
          title="Switch between Demo Curated Fixtures and Live Qloo MCP Mode"
        >
          <span className="text-[11px] text-zinc-400 hidden sm:inline">Mode:</span>
          {mode === "demo" ? (
            <Badge variant="warning" size="sm" dot>
              Demo Fixtures
            </Badge>
          ) : (
            <Badge variant="success" size="sm" dot pulse>
              Live Qloo
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
}
