import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  action,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800/80", className)}>
      <div className="space-y-1.5">
        {badge && <div className="mb-1">{badge}</div>}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
