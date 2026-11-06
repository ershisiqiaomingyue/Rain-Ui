"use client"

import * as React from "react"

import { Item, ItemContent, ItemMedia } from "../ui/item"
import { Progress } from "../ui/progress"
import { cn } from "../../lib/utils"
import { dataToneClasses, type DataTone } from "../../lib/tone"

export interface RankBarProps {
  /** 名次，从 1 开始；省略则不显示名次方块 */
  rank?: number
  /** 主体文字（工作区名、模型名、会话标题），过长省略并进 title */
  label: React.ReactNode
  /** 悬浮提示，默认用 label 的字符串形式 */
  title?: string
  /** 数值左侧的小标记（状态徽章等），不要塞长文本 */
  note?: React.ReactNode
  /** 第二行补充说明，例如「12 轮 · 3 个会话」 */
  meta?: React.ReactNode
  /** 右侧主数值，已是格式化后的字符串 */
  value: React.ReactNode
  /** 占比条 0–1；省略则不画条 */
  ratio?: number
  /** 显式配色；省略按 seed 取色 */
  tone?: DataTone
  /** 色相种子，同一实体跨列表同色 */
  seed?: string | null
  /** 在 label 前加一个实心色点（不排名次的列表用） */
  dot?: boolean
  className?: string
}

const clampRatio = (ratio: number): number => {
  if (!Number.isFinite(ratio)) return 0
  // 极小的值也要留一条可见的宽度，否则「占比 0.3%」看起来像没数据。
  return Math.min(Math.max(ratio, 0.02), 1) * 100
}

/**
 * 排行行：名次色块（或色点）+ 名称 + 占比条 + 右侧数值。
 *
 * 占比条的满格基准由调用方算好传进来（同一维度内比较），组件不猜总量——
 * 跨维度（工作区总量 vs 单模型总量）本来就不可比。
 */
export function RankBar({
  rank,
  label,
  title,
  note,
  meta,
  value,
  ratio,
  tone,
  seed,
  dot = false,
  className,
}: RankBarProps) {
  const palette = dataToneClasses(tone, seed)
  const fallbackTitle = title ?? (typeof label === "string" ? label : undefined)

  return (
    <Item
      variant="muted"
      size="sm"
      data-slot="rank-bar"
      data-tone={tone ?? undefined}
      className={cn("gap-2.5 rounded-xl", className)}
    >
      {typeof rank === "number" ? (
        <ItemMedia
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-[6px] text-[11px] font-semibold tabular-nums",
            palette.soft,
            palette.ink,
          )}
        >
          {rank}
        </ItemMedia>
      ) : null}
      <ItemContent className="gap-1">
        <div className="flex min-w-0 items-center gap-1.5">
          {dot ? <span className={cn("size-1.5 shrink-0 rounded-full", palette.solid)} /> : null}
          <span
            className="min-w-0 flex-1 truncate text-[12.5px] font-medium leading-[1.45] text-foreground"
            title={fallbackTitle}
          >
            {label}
          </span>
          {note ? <span className="shrink-0">{note}</span> : null}
          <span className="shrink-0 text-[12.5px] font-semibold tabular-nums text-foreground">{value}</span>
        </div>
        {typeof ratio === "number" ? (
          <Progress value={clampRatio(ratio)} className={cn("h-1", palette.bar)} />
        ) : null}
        {meta ? (
          <span className="truncate text-[11px] leading-[1.4] tabular-nums text-muted-foreground">{meta}</span>
        ) : null}
      </ItemContent>
    </Item>
  )
}
