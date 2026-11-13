"use client"

import * as React from "react"
import { AppIcon } from "../icons/AppIcon"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Separator } from "../ui/separator"
import { Spinner } from "../ui/spinner"
import { cn } from "../../lib/utils"

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
  /** 浮层底部的操作区（例如「刷新余额」按钮） */
  popoverFooter?: React.ReactNode
  className?: string
}

/**
 * 单条指标：有 detail 时包 Tooltip，可 hover 展开；没有 detail 的条目不可交互，
 * 因此不给 hover 底色。数值限宽截断（完整值始终在 detail 里），避免某一条读数变长
 * 时把同一行的其他条目推开。
 */
function Metric({ metric }: { metric: UsageMetric }) {
  const body = (
    <>
      <span className="text-muted-foreground">{metric.label}</span>
      <b
        className={cn(
          "min-w-0 max-w-[14ch] truncate font-medium tabular-nums",
          metric.emphasis ? "text-primary" : "text-foreground"
        )}
      >
        {metric.value ?? "—"}
      </b>
    </>
  )
  // 11px 字配 22px 的 hit-area：上下各留 11px 呼吸，再高一行读数就和上面的控件分家了。
  const hitArea = "inline-flex min-h-[22px] shrink-0 items-center gap-1 whitespace-nowrap rounded-[7px] px-2"

  if (!metric.detail) return <span className={cn(hitArea, "cursor-default")}>{body}</span>

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(hitArea, "cursor-default transition-colors hover:bg-accent")}>
          {body}
        </span>
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
  popoverFooter,
  className,
}: UsageMetricsStripProps) {
  const nodes: React.ReactNode[] = []

  if (tokenUsage) {
    nodes.push(
      <Popover key="token-usage">
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="会话用量明细"
            className="inline-flex min-h-[22px] shrink-0 items-center gap-1 whitespace-nowrap rounded-[7px] px-2 transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <AppIcon name="database" size={12} className="size-3 text-muted-foreground" />
            <span className="text-muted-foreground">缓存命中</span>
            <b className="max-w-[14ch] truncate font-medium tabular-nums text-foreground">
              {tokenUsage.rows.find((row) => row.id === "cache")?.value ?? "—"}
            </b>
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" sideOffset={6} className="w-64 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <AppIcon name="database" size={14} className="size-3.5 text-muted-foreground" />
              Token 用量
            </span>
            <span className="font-mono text-xs font-medium tabular-nums text-foreground">
              {tokenUsage.total}
            </span>
          </div>
          <Separator className="my-2" />
          <ul className="space-y-2">
            {tokenUsage.rows.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="shrink-0 text-muted-foreground">{row.label}</span>
                <span className="min-w-0 truncate text-right font-mono tabular-nums text-foreground">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
          {popoverFooter && (
            <div className="mt-2 border-t border-border/60 pt-2">{popoverFooter}</div>
          )}
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
        className="inline-flex min-h-[22px] shrink-0 items-center gap-1 whitespace-nowrap rounded-[7px] px-2 transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
      >
        <AppIcon name="balance" size={12} className="size-3 text-muted-foreground" />
        <span className="text-muted-foreground">{balance.label}</span>
        {/* 数值槽位只设上限：短值（「未上报」「不支持」）贴着 8px 内边距，hover 底色的
            左右留白才和别的条目对称；超长余额（例如带 6 位小数加币种）在 10ch 处截断，
            完整值仍在 title 里。 */}
        <b className="max-w-[10ch] min-w-0 truncate text-left font-medium tabular-nums text-foreground">
          {balance.value ?? "—"}
        </b>
        {/* 传了 refreshing 就常驻一个转圈位，避免刷新中多出一个图标把整行推走。 */}
        {balance.refreshing === undefined ? null : (
          <span className="inline-flex size-2.5 shrink-0 items-center justify-center">
            {balance.refreshing && <Spinner size="xs" className="size-2.5 text-muted-foreground" />}
          </span>
        )}
      </button>
    )
  }

  return (
    <TooltipProvider delayDuration={120}>
      <div
        className={cn(
          // 一行到底：窗口变窄时不换行、不把其他读数挤走，放不下的条目靠 hover / 浮层展开。
          // 行高跟着 22px 的 hit-area 走，不再给整行垫 32px 的 min-h-8。
          "flex min-h-[22px] flex-nowrap items-center gap-x-1 overflow-hidden text-[11px] leading-none",
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
