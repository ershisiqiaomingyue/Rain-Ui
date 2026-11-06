"use client"

import * as React from "react"

import { AppIcon, type AppIconName } from "../icons/AppIcon"
import { Item, ItemContent, ItemMedia } from "../ui/item"
import { Skeleton } from "../ui/skeleton"
import { cn } from "../../lib/utils"
import { dataToneClasses, type DataTone } from "../../lib/tone"

export interface StatTileProps {
  /** 指标名，11px 一行，过长省略 */
  label: React.ReactNode
  /** 指标值，已格式化的字符串（这里不做数字格式化） */
  value: React.ReactNode
  /** 值下面的一行补充说明，例如「3 个会话 · 42 轮」 */
  hint?: React.ReactNode
  /** 左侧图标方块里的图标 */
  icon?: AppIconName
  /** 显式配色；省略且给了 seed 时按 seed 取色 */
  tone?: DataTone
  /** 色相种子（工作区路径、模型 id 等），同一实体到处同色 */
  seed?: string | null
  /** 首次加载：数值位置改用 Skeleton 占位，避免闪一个 0 */
  loading?: boolean
  className?: string
}

/**
 * 指标卡：图标色块 + 指标名 + 大号数值 + 一行说明。
 *
 * 用于统计页顶部的 KPI 行（总用量、输入、输出、轮次这类），
 * 四张并排时给固定 tone，同一指标的颜色在各页面保持一致。
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
  tone,
  seed,
  loading = false,
  className,
}: StatTileProps) {
  const palette = dataToneClasses(tone, seed)

  return (
    <Item
      variant="muted"
      size="sm"
      data-slot="stat-tile"
      data-tone={tone ?? undefined}
      className={cn("gap-2.5 rounded-xl", className)}
    >
      {icon ? (
        <ItemMedia
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg",
            palette.soft,
            palette.ink,
          )}
        >
          <AppIcon name={icon} size={15} />
        </ItemMedia>
      ) : null}
      <ItemContent className="gap-[2px]">
        <span className="truncate text-[11px] font-medium leading-[1.4] text-muted-foreground">{label}</span>
        {loading ? (
          <Skeleton className="h-[18px] w-16" />
        ) : (
          <span
            className={cn(
              "truncate text-[15px] font-semibold leading-[1.35] tabular-nums tracking-tight",
              palette.ink,
            )}
          >
            {value}
          </span>
        )}
        {hint ? (
          <span className="truncate text-[10.5px] leading-[1.4] text-muted-foreground">{hint}</span>
        ) : null}
      </ItemContent>
    </Item>
  )
}
