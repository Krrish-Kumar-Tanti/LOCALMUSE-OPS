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
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-primary text-surface hover:bg-primary-hover shadow-xs active:scale-[0.99]",
      secondary:
        "bg-surface-secondary text-text-primary hover:bg-surface-secondary/80 font-semibold border border-border shadow-xs active:scale-[0.99]",
      outline:
        "border border-border text-text-primary bg-surface/70 hover:bg-surface hover:border-text-secondary active:bg-surface-secondary",
      ghost:
        "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/50 active:bg-surface-secondary/70",
      danger:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs rounded-full gap-1.5",
      md: "px-4 py-2 text-xs sm:text-sm rounded-full gap-2",
      lg: "px-5 py-2.5 text-sm sm:text-base rounded-full gap-2.5 font-semibold"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
