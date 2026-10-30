"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme, type ThemeMode } from "@/lib/ThemeContext";
import { cn } from "@/lib/utils";

export interface ThemeSelectorProps {
  className?: string;
  showLabels?: boolean;
}

const emptySubscribe = () => () => {};

export function ThemeSelector({ className, showLabels = false }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const options: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: "light",
      label: "Light",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.78a1 1 0 011.42 1.42l-.71.7a1 1 0 01-1.42-1.41l.71-.71zm3.78 5.22a1 1 0 010 2h-1a1 1 0 110-2h1zm-2.07 4.93a1 1 0 010 1.41l-.71.71a1 1 0 11-1.42-1.41l.71-.71a1 1 0 011.42 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.93-.78a1 1 0 01-1.42 0l-.7-.71a1 1 0 011.41-1.42l.71.71a1 1 0 010 1.42zM4 11a1 1 0 110-2H3a1 1 0 110 2h1zm1.78-6.22a1 1 0 010-1.42l.71-.7a1 1 0 011.41 1.41l-.7.71a1 1 0 01-1.42 0zM10 6a4 4 0 100 8 4 4 0 000-8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      mode: "system",
      label: "System",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.86a1 1 0 01-.99 1.14H8.087a1 1 0 01-.99-1.14l.123-.86H5a2 2 0 01-2-2V5zm2 0v8h10V5H5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      mode: "dark",
      label: "Dark",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ),
    },
  ];

  // Prevent SSR mismatch before mounting by rendering neutral skeleton buttons
  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center p-0.5 rounded-full border border-border bg-surface/80 text-text-secondary shadow-2xs",
          className
        )}
        aria-hidden="true"
      >
        <span className="w-6 h-6 rounded-full inline-block" />
        <span className="w-6 h-6 rounded-full inline-block" />
        <span className="w-6 h-6 rounded-full inline-block" />
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={cn(
        "inline-flex items-center p-0.5 rounded-full border border-border bg-surface/80 text-text-secondary shadow-2xs transition-colors",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            role="radio"
            aria-checked={isSelected}
            aria-label={`Switch to ${opt.label} theme`}
            onClick={() => setTheme(opt.mode)}
            title={`Switch to ${opt.label} theme`}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary",
              isSelected
                ? "bg-primary text-surface font-semibold shadow-2xs"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50"
            )}
          >
            {opt.icon}
            {showLabels && <span className="text-[11px] capitalize">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
