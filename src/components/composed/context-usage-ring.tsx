"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type ContextSegment = {
  id: string
  label: string
  tokens?: number | null
  percent?: number | null
  colorClass?: string
}

export interface ContextUsageRingProps {
  /** 0-100, 或 null 当未知时 */
  percent?: number | null
  tokens?: number | null
  capacity?: number | null
  systemTokens?: number
  toolTokens?: number
  messageTokens?: number
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

  // 告警阈值：>= 90% 危险 (红), >= 70% 警告 (琥珀黄), 正常 (跟随桌面主色)
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
      percent:
        capacity && systemTokens != null
          ? (systemTokens / capacity) * 100
          : null,
      colorClass: "bg-slate-400 dark:bg-slate-500",
    },
    {
      id: "tools",
      label: "工具定义",
      tokens: toolTokens,
      percent:
        capacity && toolTokens != null
          ? (toolTokens / capacity) * 100
          : null,
      colorClass: "bg-indigo-500",
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={() => {
            if (!open) onRefresh?.()
          }}
          className={cn(
            "group inline-flex items-center gap-1.5 h-7 px-1.5 rounded-full hover:bg-muted/70 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring text-xs select-none",
            open && "bg-muted/80",
            className
          )}
          title={
            anomaly
              ? "上下文读数自相矛盾"
              : `上下文用量 ${displayPercent} (~${formatTokens(tokens)} / ${formatTokens(capacity)})`
          }
        >
          {/* 上下文圆环 20px，带 track 底圈与 fill 动效 */}
          <div className="relative size-5 shrink-0 flex items-center justify-center">
            <svg
              className={cn(
                "size-5 -rotate-90 transition-transform duration-300",
                busy && "animate-spin text-muted-foreground"
              )}
              viewBox="0 0 20 20"
            >
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
                className={cn("transition-all duration-300", statusColor)}
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
          </div>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground group-hover:text-foreground">
            {displayPercent}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-72 p-3.5 space-y-3 rounded-xl border-border/80 bg-popover/95 backdrop-blur-md shadow-lg"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            上下文已用{" "}
            <b className="font-semibold text-foreground">{displayPercent}</b>
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            ~{formatTokens(tokens)} / {formatTokens(capacity)}
          </span>
        </div>

        {/* 综合分段进度条 */}
        <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden flex">
          {segments.map((seg) => (
            <div
              key={seg.id}
              className={cn("h-full transition-all duration-300", seg.colorClass)}
              style={{
                width: `${Math.min(100, Math.max(0, seg.percent ?? 0))}%`,
              }}
            />
          ))}
        </div>

        {/* 明细分项列表 */}
        <ul className="space-y-2 pt-1 text-xs">
          {segments.map((seg) => (
            <li
              key={seg.id}
              className="flex items-center justify-between text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-xs", seg.colorClass)} />
                <span>{seg.label}</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-foreground">
                {seg.tokens != null ? `~${formatTokens(seg.tokens)}` : "—"}
              </span>
            </li>
          ))}
        </ul>

        {readingModelId && (
          <div className="pt-1.5 border-t border-border/60 text-[10.5px] text-muted-foreground/80">
            读数上报来源：{readingModelId}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
