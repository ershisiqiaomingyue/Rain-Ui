"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface RadialProgressProps {
  /** 0-100；null 表示进度未知（不确定态：填充弧呼吸，不整圈旋转） */
  percent?: number | null
  /** 外径像素，默认 28（与紧凑控件同高） */
  size?: number
  /** 线宽像素，默认 2.6 */
  strokeWidth?: number
  /** 环内文字；默认百分比，进度未知时显示「…」 */
  label?: React.ReactNode
  /** 不画环内文字：环只当图形用，读数交给外部文案 */
  hideLabel?: boolean
  /** 无障碍名称，默认「进度」 */
  ariaLabel?: string
  className?: string
}

/**
 * 环形进度：给「总量已知、要一直盯着百分比」的等待用（下载、上传、批量导入）。
 *
 * 和上下文那两个环（`composed/context-usage-ring`、kit 的 `ProgressRing`）不是一回事：
 * 它们是「用量读数 + 70/90 阈值 + 可展开明细」，自身是按钮；这个只有环和读数，
 * 不可点、不开面板、不带阈值色，百分比由调用方给。
 */
export function RadialProgress({
  percent = null,
  size = 28,
  strokeWidth = 2.6,
  label,
  hideLabel = false,
  ariaLabel = "进度",
  className,
}: RadialProgressProps) {
  const value = percent == null ? null : Math.min(100, Math.max(0, percent))
  // 线宽向内收，环才不会被 viewBox 切掉两条边。
  const radius = (20 - strokeWidth) / 2
  const text = hideLabel ? null : (label ?? (value == null ? "…" : `${Math.round(value)}%`))

  return (
    <span
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value == null ? undefined : Math.round(value)}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90" width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
        <circle
          className="text-muted-foreground/25"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          cx="10"
          cy="10"
          r={radius}
        />
        <circle
          className={cn("text-primary transition-all duration-300", value == null && "animate-pulse")}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          cx="10"
          cy="10"
          r={radius}
          pathLength="100"
          strokeDasharray={`${value ?? 22} 100`}
        />
      </svg>
      {text != null && (
        <span
          className="absolute font-mono tabular-nums text-foreground"
          style={{ fontSize: Math.max(9, Math.round(size * 0.31)) }}
        >
          {text}
        </span>
      )}
    </span>
  )
}
