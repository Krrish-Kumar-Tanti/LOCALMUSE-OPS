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
        "rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 sm:p-6 text-left space-y-3 text-text-primary transition-colors",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base font-semibold text-rose-900 dark:text-rose-200">{title}</h4>
            {code && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/30 font-semibold">
                {code}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed font-sans">{message}</p>
          {recovery && (
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-1.5 font-medium font-sans">
              Recovery hint: {recovery}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" onClick={onRetry}>
            Retry Operation &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
