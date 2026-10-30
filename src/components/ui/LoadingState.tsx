import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Retrieving cultural intelligence...",
  className
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-zinc-800/60 bg-zinc-900/30",
        className
      )}
    >
      <div className="relative w-8 h-8 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-zinc-200 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-zinc-300">{message}</p>
      <p className="text-[11px] text-zinc-500 mt-1">Executing Qloo workflow tools</p>
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 rounded-md bg-zinc-800/60 animate-pulse", className)} />;
}
