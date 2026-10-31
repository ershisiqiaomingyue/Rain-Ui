"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "default"
  variant?: "ring" | "dots" | "default"
}

export function Spinner({
  className,
  size = "default",
  variant = "ring",
  ...props
}: SpinnerProps) {
  const sizeClass = {
    xs: "size-3",
    sm: "size-3.5",
    md: "size-4",
    default: "size-4.5",
    lg: "size-6",
  }[size]

  return (
    <svg
      data-slot="spinner"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={cn("animate-spin text-current shrink-0", sizeClass, className)}
      {...props}
    >
      {/* 汲取自 card-showcase.html 原生桌面平滑光环 (stroke-dasharray="32" + stroke-linecap="round") */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2.5"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeDasharray="32"
        strokeDashoffset="12"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}
