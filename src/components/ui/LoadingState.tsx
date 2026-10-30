import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading cultural intelligence data...",
  className
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-border bg-surface text-text-primary transition-colors",
        className
      )}
    >
      <div className="relative w-8 h-8 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-accent-muted/30" />
        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="font-serif text-base font-medium text-text-primary">{message}</p>
      <p className="text-[11px] text-accent-muted font-mono mt-1">Executing Qloo workflow tools</p>
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 rounded-md bg-surface-secondary animate-pulse", className)} />;
}
