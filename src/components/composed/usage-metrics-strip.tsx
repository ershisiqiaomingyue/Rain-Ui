"use client"

import * as React from "react"
import { Database } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface UsageMetric {
  id: string
  label: string
  /** 已格式化的数值，null 渲染为 — */
  value: string | null
  /** 悬浮提示内容（多行用 \n），有值才可 hover 展开 */
  detail?: string
  /** 数值高亮（例如缓存命中 97.3%） */
  emphasis?: boolean
}

export interface TokenUsageBreakdown {
  /** 总 token，已格式化 */
  total: string
  rows: { id: string; label: string; value: string }[]
}

export interface UsageMetricsStripProps {
  metrics: UsageMetric[]
  balance?: { label: string; value: string | null; detail?: string; refreshing?: boolean }
  onRefreshBalance?: () => void
  cost?: { label: string; value: string | null; detail?: string }
  /** 带图标的那一项（图1：Token 用量浮层） */
  tokenUsage?: TokenUsageBreakdown
  className?: string
}

/** 单条指标：有 detail 时包 Tooltip，可 hover 展开 */
function Metric({ metric }: { metric: UsageMetric }) {
  const body = (
    <>
      <span className="text-muted-foreground">{metric.label}</span>
      <b
        className={cn(
          "font-medium tabular-nums",
          metric.emphasis ? "text-primary" : "text-foreground"
        )}
      >
        {metric.value ?? "—"}
      </b>
    </>
  )
  const hitArea = "inline-flex min-h-9 cursor-default items-center gap-1 rounded-[10px] px-2.5 transition-colors hover:bg-muted/70"

  if (!metric.detail) return <span className={hitArea}>{body}</span>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={hitArea}>{body}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-72 whitespace-pre-line leading-relaxed">
        {metric.detail}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * 会话用量条
 * -----------------------------------------------------------------------------
 * 一行细字统计，条目之间用竖线分隔（图2）。可插槽：metrics 传多少条就渲染多少条；
 * 带 detail 的条目 hover 时用 Tooltip 展开；tokenUsage 传了就多出一个带图标的
 * Token 用量入口，点击展开明细浮层（图1）。
 */
export function UsageMetricsStrip({
  metrics,
  balance,
  onRefreshBalance,
  cost,
  tokenUsage,
  className,
}: UsageMetricsStripProps) {
  const nodes: React.ReactNode[] = []

  if (tokenUsage) {
    nodes.push(
      <Popover key="token-usage">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Token 用量明细"
            className="inline-flex min-h-9 items-center gap-1 rounded-[10px] px-2.5 transition-colors outline-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <Database className="size-3 text-muted-foreground" />
            <b className="font-medium tabular-nums text-foreground">{tokenUsage.total}</b>
            <span className="text-muted-foreground">缓存命中</span>
            <b className="font-medium tabular-nums text-foreground">
              {tokenUsage.rows.find((row) => row.id === "cache")?.value ?? "—"}
            </b>
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" sideOffset={6} className="w-64 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Database className="size-3.5 text-muted-foreground" />
              Token 用量
            </span>
            <span className="font-mono text-xs font-medium tabular-nums text-foreground">
              {tokenUsage.total}
            </span>
          </div>
          <Separator className="my-2" />
          <ul className="space-y-2">
            {tokenUsage.rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono tabular-nums text-foreground">{row.value}</span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    )
  }

  metrics.forEach((metric) => nodes.push(<Metric key={metric.id} metric={metric} />))

  if (cost) {
    nodes.push(
      <Metric
        key="cost"
        metric={{ id: "cost", label: cost.label, value: cost.value, detail: cost.detail }}
      />
    )
  }

  if (balance) {
    nodes.push(
      <button
        key="balance"
        type="button"
        onClick={onRefreshBalance}
        disabled={balance.refreshing}
        title={balance.detail}
        className="inline-flex min-h-9 items-center gap-1 rounded-[10px] px-2.5 transition-colors outline-none hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
      >
        <span className="text-muted-foreground">{balance.label}</span>
        <b className="font-medium tabular-nums text-foreground">{balance.value ?? "—"}</b>
        {balance.refreshing && <Spinner size="xs" className="size-2.5 text-muted-foreground" />}
      </button>
    )
  }

  return (
    <TooltipProvider delayDuration={120}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] leading-none",
          className
        )}
        aria-label="会话用量"
      >
        {nodes.map((node, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="h-3 w-px shrink-0 bg-border" aria-hidden="true" />}
            {node}
          </React.Fragment>
        ))}
      </div>
    </TooltipProvider>
  )
}
