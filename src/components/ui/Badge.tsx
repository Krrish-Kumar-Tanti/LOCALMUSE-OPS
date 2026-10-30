import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-surface-secondary text-text-primary border-border",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 font-semibold",
    danger: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
    info: "bg-primary/10 text-primary border-primary/30 font-medium",
    outline: "border-border text-text-secondary bg-surface/50"
  };

  const dotColor = {
    neutral: "bg-accent-muted",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-primary",
    outline: "bg-text-primary"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1 font-mono tracking-wider uppercase",
    md: "px-2.5 py-1 text-xs gap-1.5 font-mono tracking-wider"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full select-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColor[variant],
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}
