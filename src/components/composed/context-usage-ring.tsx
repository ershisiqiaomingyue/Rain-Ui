"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ContextSegment = {
  id: string
  label: string
  tokens?: number | null
  percent?: number | null
  colorClass?: string
}

export interface ContextUsageRingProps {
  /** 0-100，或 null 当未知时 */
  percent?: number | null
  tokens?: number | null
  capacity?: number | null
  systemTokens?: number
  toolTokens?: number
  messageTokens?: number
  /** 读数正在获取：轨道保持不动，只让填充弧呼吸，绝不整圈旋转 */
  busy?: boolean
  readingModelId?: string
  anomaly?: boolean
  className?: string
  onRefresh?: () => void
}

function formatTokens(count?: number | null) {
  if (count == null || count < 0) return "—"
  if (count >= 1_000_000) {
    const val = count / 1_000_000
    return `${Number.isInteger(val) ? val : Number(val.toFixed(1))}M`
  }
  if (count >= 1_000) {
    const val = count / 1_000
    return `${Number.isInteger(val) ? val : Number(val.toFixed(1))}K`
  }
  return String(count)
}

export function ContextUsageRing({
  percent: customPercent,
  tokens,
  capacity,
  systemTokens,
  toolTokens,
  messageTokens,
  busy = false,
  readingModelId,
  anomaly = false,
  className,
  onRefresh,
}: ContextUsageRingProps) {
  const [open, setOpen] = React.useState(false)

  const computedPercent =
    customPercent != null
      ? customPercent
      : capacity && tokens != null
        ? Math.min(100, Math.max(0, Math.round((tokens / capacity) * 100)))
        : null

  const resolvedMessageTokens =
    messageTokens != null
      ? messageTokens
      : tokens != null && systemTokens != null && toolTokens != null
        ? Math.max(0, tokens - systemTokens - toolTokens)
        : null

  const isDanger = computedPercent != null && computedPercent >= 90
  const isWarning = computedPercent != null && computedPercent >= 70 && computedPercent < 90

  const statusColor = isDanger
    ? "text-destructive"
    : isWarning
      ? "text-amber-500"
      : "text-primary"

  const displayPercent = anomaly
    ? "异常"
    : computedPercent == null
      ? "—"
      : `${computedPercent}%`

  const segments: ContextSegment[] = [
    {
      id: "system",
      label: "系统提示词",
      tokens: systemTokens,
      percent: capacity && systemTokens != null ? (systemTokens / capacity) * 100 : null,
      colorClass: "bg-muted-foreground/45",
    },
    {
      id: "tools",
      label: "工具定义",
      tokens: toolTokens,
      percent: capacity && toolTokens != null ? (toolTokens / capacity) * 100 : null,
      colorClass: "bg-primary/55",
    },
    {
      id: "messages",
      label: "对话消息",
      tokens: resolvedMessageTokens,
      percent:
        capacity && resolvedMessageTokens != null
          ? (resolvedMessageTokens / capacity) * 100
          : null,
      colorClass: "bg-primary",
    },
  ]

  return (
    <Popover open={open} onOpenChange={(next) => {
      setOpen(next)
      if (next) onRefresh?.()
    }}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5 px-1.5 font-normal text-muted-foreground hover:text-foreground",
            open && "bg-muted text-foreground",
            className
          )}
          title={
            anomaly
              ? "上下文读数自相矛盾"
              : `上下文用量 ${displayPercent}（~${formatTokens(tokens)} / ${formatTokens(capacity)}）`
          }
        >
          <span className="relative flex size-5 shrink-0 items-center justify-center">
            <svg className="-rotate-90" viewBox="0 0 20 20" width="20" height="20">
              <circle
                className="text-muted-foreground/20"
                stroke="currentColor"
                strokeWidth="2.4"
                fill="none"
                cx="10"
                cy="10"
                r="7.5"
              />
              <circle
                className={cn(
                  "transition-all duration-300",
                  statusColor,
                  busy && "animate-pulse"
                )}
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
                cx="10"
                cy="10"
                r="7.5"
                pathLength="100"
                strokeDasharray={`${computedPercent ?? 0} 100`}
              />
            </svg>
          </span>
          <span className="font-mono text-[11px] tabular-nums">{displayPercent}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-64 space-y-3 rounded-xl p-3.5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            上下文已用
            <b className="ml-1 font-semibold text-foreground">{displayPercent}</b>
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {formatTokens(tokens)} / {formatTokens(capacity)}
          </span>
        </div>

        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className={cn("h-full transition-all duration-300", seg.colorClass)}
              style={{ width: `${Math.min(100, Math.max(0, seg.percent ?? 0))}%` }}
            />
          ))}
        </div>

        <ul className="space-y-2 text-xs">
          {segments.map((seg) => (
            <li key={seg.id} className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={cn("size-2 rounded-[2px]", seg.colorClass)} />
                {seg.label}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-foreground">
                {seg.tokens != null ? `~${formatTokens(seg.tokens)}` : "—"}
              </span>
            </li>
          ))}
        </ul>

        {readingModelId && (
          <div className="border-t border-border/60 pt-1.5 text-[10.5px] text-muted-foreground/80">
            读数上报来源：{readingModelId}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
