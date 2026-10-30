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
    neutral: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    outline: "border-zinc-700 text-zinc-400 bg-transparent"
  };

  const dotColor = {
    neutral: "bg-zinc-400",
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-indigo-400",
    outline: "bg-zinc-400"
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full tracking-wide select-none",
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
      <span>{children}</span>
    </span>
  );
}
