"use client"

import * as React from "react"

import { Badge, type BadgeProps } from "@/components/ui/badge"
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

const variantToBadge: Record<StatusBadgeVariant, { badge: BadgeProps["variant"]; dot: string }> = {
  primary: { badge: "secondary", dot: "bg-primary" },
  success: { badge: "success", dot: "bg-emerald-500" },
  warning: { badge: "warning", dot: "bg-amber-500" },
  danger: { badge: "destructive", dot: "bg-destructive" },
  neutral: { badge: "muted", dot: "bg-muted-foreground/60" },
}

/**
 * 状态徽章：复用基础 Badge，高度提到 24px（h-6），字号 11.5px。
 */
export function StatusBadge({
  variant = "neutral",
  pulse = false,
  hideDot = false,
  title,
  className,
  children,
}: StatusBadgeProps) {
  const styles = variantToBadge[variant]

  return (
    <Badge
      title={title}
      variant={styles.badge}
      className={cn("h-6 gap-1.5 px-2 text-[11.5px] font-medium rounded-full", className)}
    >
      {!hideDot && (
        <span className="relative flex size-1.5 shrink-0">
          {pulse && (
            <span
              className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-70", styles.dot)}
            />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", styles.dot)} />
        </span>
      )}
      {children}
    </Badge>
  )
}
