"use client"

import * as React from "react"
import { AlertCircle, Check, CircleDashed } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export type CompactionStatus = "running" | "completed" | "interrupted" | "failed"

export interface CompactionProgressProps {
  status: CompactionStatus
  /** 0-100，无法上报进度时为 null */
  progress?: number | null
  detail?: React.ReactNode
  className?: string
  /** strip = 独立状态条；row = 时间线单行 */
  variant?: "strip" | "row"
}

const LABELS: Record<CompactionStatus, string> = {
  running: "正在压缩上下文",
  completed: "上下文已压缩",
  interrupted: "上下文压缩已中断",
  failed: "上下文压缩失败",
}

export function CompactionProgress({
  status,
  progress,
  detail,
  className,
  variant = "strip",
}: CompactionProgressProps) {
  const row = variant === "row"
  const showTrack = status === "running" || status === "completed"
  const indeterminate = status === "running" && progress == null
  const value = status === "completed" ? 100 : Math.min(100, Math.max(0, progress ?? 0))
  const percentText = indeterminate ? "…" : `${Math.round(value)}%`

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl border text-xs",
        status === "failed" && "border-destructive/30 bg-destructive/10 text-destructive",
        status === "interrupted" && "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        (status === "running" || status === "completed") && "border-border/70 bg-card text-foreground",
        row && "border-transparent bg-transparent px-0 py-1",
        className
      )}
    >
      <span
        className={cn(
          "size-4 rounded-full flex items-center justify-center shrink-0",
          status === "completed" && "bg-primary text-primary-foreground",
          status === "running" && "bg-primary/15 text-primary",
          status === "interrupted" && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
          status === "failed" && "bg-destructive/20 text-destructive"
        )}
      >
        {status === "running" && <Spinner size="xs" className="size-3" />}
        {status === "completed" && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-2.5"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}
        {status === "interrupted" && <CircleDashed className="size-3" />}
        {status === "failed" && <AlertCircle className="size-3" />}
      </span>

      <span className="font-medium shrink-0">{LABELS[status]}</span>

      {!row && showTrack && (
        <div
          className={cn(
            "flex-1 h-1.5 rounded-full bg-muted overflow-hidden",
            indeterminate && "animate-pulse"
          )}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : Math.round(value)}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={indeterminate ? { width: "40%" } : { width: `${value}%` }}
          />
        </div>
      )}

      {showTrack && (
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground shrink-0">
          {percentText}
        </span>
      )}

      {detail && (
        <span className="text-[11px] text-muted-foreground truncate">{detail}</span>
      )}
    </div>
  )
}
