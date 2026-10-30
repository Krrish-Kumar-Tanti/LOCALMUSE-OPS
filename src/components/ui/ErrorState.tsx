import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  code?: string;
  recovery?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Operation Failed",
  message,
  code,
  recovery,
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-red-500/20 bg-red-950/20 p-5 sm:p-6 text-left space-y-3",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-red-200">{title}</h4>
            {code && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-900/40 text-red-300 border border-red-700/50">
                {code}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-red-300/90 leading-relaxed">{message}</p>
          {recovery && (
            <p className="text-xs text-red-400/80 mt-1.5 font-medium">
              Recovery hint: {recovery}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <div className="pt-2 flex justify-end">
          <Button variant="danger" size="sm" onClick={onRetry}>
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
}
