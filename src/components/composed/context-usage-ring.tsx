"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

export type ContextSegment = {
  id: string
  label: string
  tokens?: number | null
  percent?: number | null
  /** 直接给 CSS 颜色值（`hsl(var(--token) / 0.5)` 这种），不要给 Tailwind 类：
   *  库组件用的工具类要靠消费方的 Tailwind 扫到本库产物才会生成，宿主换一次
   *  配置这些颜色就整块消失；`var(--token)` 走到哪都在，还自动跟主题。 */
  color?: string
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
  /** 产品补充说明：拼进按钮 title，并在面板底部单独一行显示 */
  hint?: string
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
  hint,
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

  // 强调色用 --accent-* 那一族，不用 --primary：后者是「淡色按钮底」
  // （亮 239 84% 94% / 暗 239 36% 22%），拿来画环和分段条，亮色下淡得跟底
  // 一样、暗色下比底还深，两边都看不出是数据。--accent-bar 就是 palettes.css
  // 里给「进度条填充」留的那一档。
  const statusColor = isDanger
    ? "hsl(var(--destructive))"
    : isWarning
      ? "hsl(var(--warning))"
      : "hsl(var(--accent-strong))"

  const displayPercent = anomaly
    ? "异常"
    : computedPercent == null
      ? "—"
      : `${computedPercent}%`

  // 三段是「同一个量的三份」，所以只在强调色上分强弱、不另开色相：
  // 固定的系统提示词走中性灰（跟 status-badge 的 neutral 点同一档），
  // 工具定义半档，对话消息（大头）满档。
  const segments: ContextSegment[] = [
    {
      id: "system",
      label: "系统提示词",
      tokens: systemTokens,
      percent: capacity && systemTokens != null ? (systemTokens / capacity) * 100 : null,
      color: "hsl(var(--muted-foreground) / 0.45)",
    },
    {
      id: "tools",
      label: "工具定义",
      tokens: toolTokens,
      percent: capacity && toolTokens != null ? (toolTokens / capacity) * 100 : null,
      color: "hsl(var(--accent-bar) / 0.6)",
    },
    {
      id: "messages",
      label: "对话消息",
      tokens: resolvedMessageTokens,
      percent:
        capacity && resolvedMessageTokens != null
          ? (resolvedMessageTokens / capacity) * 100
          : null,
      color: "hsl(var(--accent-bar))",
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
              : `上下文用量 ${displayPercent}（~${formatTokens(tokens)} / ${formatTokens(capacity)}）${hint ? `；${hint}` : ""}`
          }
        >
          <span className="relative flex size-6 shrink-0 items-center justify-center">
            <svg className="-rotate-90" viewBox="0 0 20 20" width="22" height="22">
              <circle
                style={{ color: "hsl(var(--muted-foreground) / 0.2)" }}
                stroke="currentColor"
                strokeWidth="2.2"
                fill="none"
                cx="10"
                cy="10"
                r="7.5"
              />
              <circle
                className={cn("transition-all duration-300", busy && "animate-pulse")}
                style={{ color: statusColor }}
                stroke="currentColor"
                strokeWidth="2.2"
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
          <span className="font-mono text-xs tabular-nums">{displayPercent}</span>
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
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, seg.percent ?? 0))}%`,
                backgroundColor: seg.color,
              }}
            />
          ))}
        </div>

        <ul className="space-y-2 text-xs">
          {segments.map((seg) => (
            <li key={seg.id} className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-[2px]" style={{ backgroundColor: seg.color }} />
                {seg.label}
              </span>
              <span className="font-mono text-[11px] tabular-nums text-foreground">
                {seg.tokens != null ? `~${formatTokens(seg.tokens)}` : "—"}
              </span>
            </li>
          ))}
        </ul>

        {(readingModelId || hint) && (
          <div className="space-y-1 border-t border-border/60 pt-1.5 text-[10.5px] text-muted-foreground/80">
            {readingModelId && <div>读数上报来源：{readingModelId}</div>}
            {hint && <div>{hint}</div>}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
