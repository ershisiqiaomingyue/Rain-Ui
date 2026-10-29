"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UsageMetric {
  id: string
  label: string
  /** 已格式化的数值，null 渲染为 — */
  value: string | null
  detail?: string
}

export interface UsageMetricsStripProps {
  metrics: UsageMetric[]
  balance?: { label: string; value: string | null; detail?: string; refreshing?: boolean }
  onRefreshBalance?: () => void
  cost?: { id?: string; label: string; value: string | null; detail?: string }
  className?: string
}

export function UsageMetricsStrip({
  metrics,
  balance,
  onRefreshBalance,
  cost,
  className,
}: UsageMetricsStripProps) {
  const items = [
    ...metrics,
    ...(cost ? [{ id: "cost", ...cost }] : []),
  ]

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 px-1 pt-1.5 border-t border-border/50 text-[10.5px] text-muted-foreground",
        className
      )}
      aria-label="当前会话用量"
    >
      {items.map((m) => (
        <span key={m.id} className="inline-flex items-center gap-1" title={m.detail}>
          <span>{m.label}</span>
          <b className="font-medium text-foreground tabular-nums">{m.value ?? "—"}</b>
        </span>
      ))}

      {balance && (
        <button
          type="button"
          onClick={onRefreshBalance}
          disabled={balance.refreshing}
          title={balance.detail}
          className="inline-flex items-center gap-1 rounded-sm px-1 -mx-1 hover:bg-muted/70 transition-colors disabled:opacity-60"
        >
          <span>{balance.label}</span>
          <b className="font-medium text-foreground tabular-nums">{balance.value ?? "—"}</b>
          {balance.refreshing && <RefreshCw className="size-2.5 animate-spin" />}
        </button>
      )}
    </div>
  )
}
