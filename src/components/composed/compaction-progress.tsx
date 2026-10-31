"use client"

import * as React from "react"
import { AlertCircle, Check, CircleDashed } from "lucide-react"

import { Spinner } from "../ui/spinner"
import { cn } from "../../lib/utils"

export type CompactionStatus = "running" | "completed" | "interrupted" | "failed"

export interface CompactionProgressProps {
  status: CompactionStatus
  /** 0-100，无法上报进度时为 null */
  progress?: number | null
  detail?: React.ReactNode
  className?: string
}

const LABELS: Record<CompactionStatus, string> = {
  running: "正在压缩上下文",
  completed: "上下文已压缩",
  interrupted: "压缩已中断",
  failed: "压缩失败",
}

/**
 * 上下文压缩状态。
 * 宽度统一（与通知卡同宽），多个状态从上往下依次排列。
 */
export function CompactionProgress({
  status,
  progress,
  detail,
  className,
}: CompactionProgressProps) {
  const indeterminate = status === "running" && progress == null
  const value = status === "completed" ? 100 : Math.min(100, Math.max(0, progress ?? 0))
  const percentText = indeterminate ? "…" : `${Math.round(value)}%`

  return (
    <div
      data-slot="compaction-progress"
      className={cn(
        "flex h-8 w-full items-center gap-2 rounded-[10px] border border-border/70 bg-card px-2.5 text-xs",
        status === "failed" && "border-destructive/40 bg-destructive/8 text-destructive",
        status === "interrupted" &&
          "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        className
      )}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full",
          status === "completed" && "bg-primary text-primary-foreground",
          status === "running" && "bg-primary/12 text-primary",
          status === "interrupted" && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
          status === "failed" && "bg-destructive/15 text-destructive"
        )}
      >
        {status === "running" && <Spinner size="xs" className="size-3" />}
        {status === "completed" && <Check className="size-2.5" strokeWidth={3.2} />}
        {status === "interrupted" && <CircleDashed className="size-3" />}
        {status === "failed" && <AlertCircle className="size-3" />}
      </span>

      <span className="shrink-0 font-medium">{LABELS[status]}</span>

      {(status === "running" || status === "completed") && (
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={indeterminate ? undefined : Math.round(value)}
          >
            <span
              className={cn(
                "block h-full rounded-full bg-primary transition-all duration-300",
                indeterminate && "animate-pulse"
              )}
              style={{ width: indeterminate ? "40%" : `${value}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right font-mono text-[10.5px] tabular-nums text-muted-foreground">
            {percentText}
          </span>
        </span>
      )}

      {detail && (
        <span className="ml-auto shrink-0 truncate font-mono text-[10.5px] tabular-nums text-muted-foreground">
          {detail}
        </span>
      )}
    </div>
  )
}
