"use client";

import React, { useState } from "react";
import { DEMO_PERSONAS, saveSession, type UserPersona, type UserSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onCancel?: () => void;
}

export function LoginPage({ onLoginSuccess, onCancel }: LoginPageProps) {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(DEMO_PERSONAS[0]);
  const [loading, setLoading] = useState(false);

  const handleSelectAndActivate = (persona: UserPersona) => {
    setSelectedPersona(persona);
    setLoading(true);
    setTimeout(() => {
      const session = saveSession(persona);
      setLoading(false);
      onLoginSuccess(session);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative w-full max-w-3xl rounded-3xl bg-surface text-text-primary shadow-2xl border border-border overflow-hidden my-auto transition-colors">
        
        {/* Top Header */}
        <div className="border-b border-border bg-surface-secondary/40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-surface shadow-xs">
              <span className="font-serif italic font-bold text-base text-surface">L</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-normal tracking-tight text-text-primary">
                  LocalMuse <span className="italic">Ops</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-surface-secondary text-text-secondary px-2 py-0.5 rounded-full font-semibold border border-border">
                  Demo Profile Selector
                </span>
              </div>
              <span className="text-[11px] text-accent-muted font-mono">
                Select an operator persona to pre-populate market context
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-full hover:bg-surface-secondary/50 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>✕ Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Persona Selector Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-xl sm:text-2xl text-text-primary">
              Choose Your Operator Perspective
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              Switching profiles pre-configures your business category, location anchors, and strategic goals across all five cultural intelligence modules. No passwords or authentication required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {DEMO_PERSONAS.map((persona) => {
              const isSelected = selectedPersona.id === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => handleSelectAndActivate(persona)}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2.5",
                    isSelected
                      ? "border-primary bg-surface-secondary/60 shadow-sm ring-1 ring-primary/30"
                      : "border-border bg-surface hover:border-text-secondary hover:bg-surface-secondary/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-muted block">
                        {persona.roleTitle}
                      </span>
                      <h3 className="font-serif text-base font-semibold text-text-primary leading-snug mt-0.5">
                        {persona.businessName}
                      </h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary font-mono border border-border shrink-0">
                      {persona.location}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-sans">
                    {persona.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs border-t border-border">
                    <span className="text-[11px] text-accent-muted font-mono truncate max-w-[200px]">
                      {persona.neighborhood}
                    </span>
                    <span className="font-semibold text-xs text-primary hover:underline inline-flex items-center gap-1">
                      {loading && isSelected ? "Activating..." : "Select Profile →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border text-xs text-text-secondary font-mono">
            <span>Demo operator profiles &bull; LocalMuse Ops</span>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
              >
                Continue without switching
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
