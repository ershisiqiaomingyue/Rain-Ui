"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusBadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral"

export interface StatusBadgeProps {
  variant?: StatusBadgeVariant
  /** 呼吸脉冲点，用于运行中状态 */
  pulse?: boolean
  /** 隐藏圆点，只保留文字胶囊 */
  hideDot?: boolean
  title?: string
  className?: string
  children: React.ReactNode
}

const variantStyles: Record<StatusBadgeVariant, { wrap: string; dot: string }> = {
  primary: {
    wrap: "bg-primary/10 text-primary border-primary/25",
    dot: "bg-primary",
  },
  success: {
    wrap: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  warning: {
    wrap: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
    dot: "bg-amber-500",
  },
  danger: {
    wrap: "bg-destructive/10 text-destructive border-destructive/25",
    dot: "bg-destructive",
  },
  neutral: {
    wrap: "bg-muted text-muted-foreground border-border/70",
    dot: "bg-muted-foreground/60",
  },
}

export function StatusBadge({
  variant = "neutral",
  pulse = false,
  hideDot = false,
  title,
  className,
  children,
}: StatusBadgeProps) {
  const styles = variantStyles[variant]
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 h-5 px-2 rounded-full border text-[11px] font-medium whitespace-nowrap",
        styles.wrap,
        className
      )}
    >
      {!hideDot && (
        <span className="relative flex size-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full opacity-70 animate-ping",
                styles.dot
              )}
            />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", styles.dot)} />
        </span>
      )}
      {children}
    </span>
  )
}
