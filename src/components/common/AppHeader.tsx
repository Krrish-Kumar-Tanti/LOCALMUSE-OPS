"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ThemeSelector } from "@/components/common/ThemeSelector";
import { useAuth } from "@/lib/AuthContext";
import { DEMO_PERSONAS } from "@/lib/auth";
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
  title = "Cultural Intelligence Workbench",
  description = "Taste-powered local market operations",
  mode = "demo",
  onToggleMode,
  isBackendOnline = true,
  isMcpConnected = true,
  onMobileMenuToggle,
  className
}: AppHeaderProps) {
  const { isAuthenticated, currentPersona, openLoginModal, logout, switchPersona } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "h-16 border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 text-text-primary transition-colors",
        className
      )}
    >
      {/* Left: Mobile trigger & view title */}
      <div className="flex items-center gap-3 min-w-0 text-left">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50 transition-colors cursor-pointer"
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
          <h1 className="font-serif text-base sm:text-lg font-normal text-text-primary truncate tracking-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-text-secondary truncate font-sans">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Connection status, Theme switcher, Mode toggle & Persona */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Backend health status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface/70 text-[11px] font-mono text-text-secondary">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              isBackendOnline && isMcpConnected ? "bg-emerald-600 animate-pulse" : "bg-text-secondary/50"
            )}
          />
          <span>{isBackendOnline ? "Backend Connected (Port 4000)" : "Connecting..."}</span>
        </div>

        {/* Theme Mode Selector */}
        <ThemeSelector />

        {/* Mode switcher button */}
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/80 hover:bg-surface transition-colors text-xs text-text-primary font-medium cursor-pointer shadow-2xs"
          title="Switch between Demo Curated Fixtures and Live Qloo MCP Mode"
        >
          <span className="text-[11px] text-text-secondary hidden sm:inline font-mono">Mode:</span>
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

        {/* Demo Persona Profile Controls */}
        {!isAuthenticated ? (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Persona</span>
            <span className="text-[10px] opacity-75">&rarr;</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface text-xs text-text-primary hover:bg-surface-secondary/50 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="font-sans text-[11px] font-medium truncate max-w-[120px] sm:max-w-[160px]">
                  {currentPersona?.roleTitle ?? "Operator"}
                </span>
                <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-border shadow-2xl p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-mono uppercase text-accent-muted px-3 py-1 font-bold">
                    Switch Demo Persona
                  </div>
                  <div className="space-y-1 mt-1">
                    {DEMO_PERSONAS.map((p) => {
                      const isCurrent = currentPersona?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchPersona(p);
                            setRoleMenuOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer",
                            isCurrent
                              ? "bg-surface-secondary text-text-primary font-bold border border-border shadow-2xs"
                              : "text-text-secondary hover:bg-surface-secondary/60 hover:text-text-primary"
                          )}
                        >
                          <div className="truncate">
                            <div className="truncate font-serif font-semibold text-text-primary">{p.businessName}</div>
                            <div className="text-[10px] text-accent-muted truncate font-mono">{p.roleTitle}</div>
                          </div>
                          {isCurrent && (
                            <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              title="Reset Persona"
              className="p-1.5 rounded-full border border-border bg-surface text-text-secondary hover:text-rose-600 hover:bg-surface-secondary/50 transition-colors cursor-pointer shadow-2xs"
              aria-label="Reset Persona"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
