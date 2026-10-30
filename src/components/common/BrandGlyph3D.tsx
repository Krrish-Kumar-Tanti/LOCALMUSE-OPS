import React from "react";
import { cn } from "@/lib/utils";

export interface BrandGlyph3DProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

/**
 * Lightweight, pure CSS 3D geometric brand glyph representing
 * multi-faceted cultural affinity intelligence.
 *
 * Zero external packages, zero WebGL/Canvas overhead, 60 FPS.
 * Acts as the visual placeholder for any future WebGL 3D brand element.
 */
export function BrandGlyph3D({
  size = "md",
  className,
  animate = false
}: BrandGlyph3DProps) {
  const containerSize = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-14 h-14"
  };

  const cubeSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none",
        containerSize[size],
        className
      )}
      style={{ perspective: "400px" }}
      aria-label="LocalMuse Cultural Intelligence Prism"
      role="img"
    >
      <div
        className={cn(
          "relative transition-transform duration-700 ease-out",
          cubeSize[size],
          animate && "hover:rotate-y-45 hover:rotate-x-12"
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-24deg) rotateY(36deg)"
        }}
      >
        {/* Top Facet (Culinary / Lifestyle - Emerald Tint) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xs border border-emerald-300/40 opacity-90 shadow-xs"
          style={{
            transform: "rotateX(90deg) translateZ(10px)",
            transformOrigin: "center"
          }}
        />

        {/* Left Facet (Arts & Music - Violet Tint) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xs border border-indigo-400/40 opacity-85 shadow-xs"
          style={{
            transform: "translateZ(10px)"
          }}
        />

        {/* Right Facet (Demographics / Taste - Amber Tint) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xs border border-amber-300/40 opacity-80 shadow-xs"
          style={{
            transform: "rotateY(90deg) translateZ(10px)",
            transformOrigin: "center"
          }}
        />
      </div>
    </div>
  );
}
