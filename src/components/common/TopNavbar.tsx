"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { DEMO_PERSONAS } from "@/lib/auth";
import { ThemeSelector } from "@/components/common/ThemeSelector";
import { cn } from "@/lib/utils";

export interface TopNavbarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  className?: string;
  isLiveAvailable?: boolean;
}

export function TopNavbar({
  activeScreen,
  onNavigate,
  className = "",
}: TopNavbarProps) {
  const { isAuthenticated, currentPersona, openLoginModal, logout, switchPersona } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const allNavItems = [
    { id: "overview", label: "Overview" },
    { id: "culture-plan", label: "Weekly Culture Plan" },
    { id: "location-insights", label: "Location Insights" },
    { id: "compare-audiences", label: "Audience Comparison" },
    { id: "local-trends", label: "Local Trends" },
    { id: "recommendations", label: "Recommendations" },
    { id: "guide", label: "Platform Guide" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
  };

  return (
    <header className={cn("sticky top-0 z-40 backdrop-blur-md bg-surface/90 border-b border-border px-4 sm:px-8 py-3 transition-colors", className)}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div
          onClick={() => onNavigate("overview")}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none text-left"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-surface shadow-xs hover:scale-105 transition-transform">
            <span className="font-serif italic font-bold text-base text-surface">L</span>
          </div>
          <div className="leading-none">
            <span className="font-serif text-xl tracking-tight text-text-primary font-normal block">
              LocalMuse <span className="italic font-serif">Ops</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-accent-muted font-semibold">
              Taste &bull; Cultural Intelligence
            </span>
          </div>
        </div>

        {/* Center: Dynamic Navigation - Direct access to all workflows */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-text-secondary overflow-x-auto py-1 scrollbar-none">
          {allNavItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap text-xs",
                  isActive
                    ? "text-text-primary font-bold bg-surface border-border shadow-xs ring-1 ring-border"
                    : "bg-surface/50 border-transparent hover:bg-surface hover:border-border text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Selector & Operator Profile Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface/60 text-text-secondary text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Port 4000 Connected</span>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {!isAuthenticated ? (
            /* No persona chosen: Profile selector trigger */
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-surface text-xs font-semibold transition shadow-xs cursor-pointer hover:scale-[1.02]"
            >
              <span>Operator Persona</span>
              <span className="text-[10px] opacity-75">&rarr;</span>
            </button>
          ) : (
            /* Persona Active: Dropdown Switcher */
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border hover:bg-surface-secondary/50 text-text-primary text-xs font-medium transition shadow-xs cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-sans text-[11px] text-text-primary truncate max-w-[150px] sm:max-w-[200px]">
                    {currentPersona?.roleTitle ?? "Operator Profile"}
                  </span>
                  <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-border shadow-2xl p-2.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-mono uppercase text-accent-muted px-3 py-1 font-bold">
                      Switch Demo Operator Profile
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
                              "w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between transition-colors cursor-pointer",
                              isCurrent
                                ? "bg-surface-secondary text-text-primary font-bold border border-border shadow-2xs"
                                : "text-text-secondary hover:bg-surface-secondary/60 hover:text-text-primary"
                            )}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-semibold text-text-primary truncate">
                                {p.businessName}
                              </div>
                              <div className="text-[10px] text-accent-muted truncate font-mono">
                                {p.roleTitle} &bull; {p.location}
                              </div>
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

              {/* Reset Persona Button */}
              <button
                onClick={logout}
                title="Reset Persona"
                className="p-1.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition cursor-pointer"
                aria-label="Reset Persona"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
