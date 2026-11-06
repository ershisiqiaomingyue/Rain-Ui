"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { dataToneClasses, type DataTone } from "../../lib/tone"

export interface ToneDotProps {
  /** 显式配色；省略按 seed 取色 */
  tone?: DataTone
  /** 色相种子（工作区路径、模型 id 等） */
  seed?: string | null
  size?: "xs" | "sm"
  title?: string
  className?: string
}

const DOT_SIZE: Record<NonNullable<ToneDotProps["size"]>, string> = {
  xs: "size-1.5",
  sm: "size-2",
}

/**
 * 彩色数据点：给「同一实体在多个列表里同色」提供最小可复用单元。
 * 表格首列、排行行、图例都用它，避免各处再拼一遍圆点 class。
 */
export function ToneDot({ tone, seed, size = "xs", title, className }: ToneDotProps) {
  const palette = dataToneClasses(tone, seed)

  return (
    <span
      data-slot="tone-dot"
      data-tone={tone ?? undefined}
      title={title}
      aria-hidden={title ? undefined : true}
      className={cn("inline-block shrink-0 rounded-full", DOT_SIZE[size], palette.solid, className)}
    />
  )
}
