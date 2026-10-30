import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-zinc-100 text-zinc-950 hover:bg-white shadow-sm hover:shadow active:bg-zinc-200",
      secondary:
        "bg-zinc-800 text-zinc-100 hover:bg-zinc-700/90 border border-zinc-700/60 active:bg-zinc-800",
      outline:
        "border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800/70 hover:text-zinc-100 active:bg-zinc-800",
      ghost:
        "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 active:bg-zinc-800/80",
      danger:
        "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:bg-red-500/30"
    };

    const sizeStyles = {
      sm: "px-2.5 py-1.5 text-xs rounded-md gap-1.5",
      md: "px-3.5 py-2 text-sm rounded-lg gap-2",
      lg: "px-4.5 py-2.5 text-base rounded-lg gap-2.5"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
