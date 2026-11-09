"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import {
  ExpandableItem,
  ExpandableItemSection,
  type ExpandableItemProps,
  type ExpandableItemSectionTone,
} from "./expandable-item"

/**
 * 工具条目 —— 展开后是「只读信息」：版本、安装位置、来源、许可…
 *
 * 给「这一项到底是什么」的场景用：收起态只有名称 + 当前版本，点开看完整信息。
 * 和 ToolItem 的分工是「能不能改」——这个组件里没有输入框，只有一行行的键值对。
 *
 * 键值对整体装在一张浅色分项卡片里（默认信息蓝），这样层级是
 * 白色条目卡片 → 彩色信息卡片 → 文字，而不是把一堆灰字直接摊在白底上。
 * 这里没有复用老组件库的 PropertyGrid：那套自带表头 / 斑马纹 / 展开行，
 * 比这里需要的重，混进来反而两边都不好改。
 */

export interface ToolInfoEntry {
  label: string
  value: React.ReactNode
  /** 路径、版本号这类等宽显示 */
  mono?: boolean
  /** 长路径允许换行（默认截断） */
  wrap?: boolean
  /** 鼠标悬停时的完整文本 */
  title?: string
}

export interface ToolInfoItemProps extends Omit<ExpandableItemProps, "children"> {
  /** 展开区第一行的说明 */
  description?: React.ReactNode
  /** 信息分项卡片的标题，例如「版本与安装位置」 */
  sectionLabel?: React.ReactNode
  /** 信息分项卡片右上角的补充信息 */
  sectionHint?: React.ReactNode
  /** 信息分项卡片的配色，默认信息蓝（跟壳的 tone 不是一个东西：那个管行首图标盘） */
  sectionTone?: ExpandableItemSectionTone
  items?: ToolInfoEntry[]
  /** 两列还是单列，默认两列（窄容器里会自动落回单列） */
  columns?: 1 | 2
  children?: React.ReactNode
}

export function ToolInfoItem({
  description,
  sectionLabel,
  sectionHint,
  sectionTone = "neutral",
  items,
  columns = 2,
  children,
  ...rest
}: ToolInfoItemProps) {
  const hasContent = Boolean(description || items?.length || children)

  return (
    <ExpandableItem {...rest}>
      {hasContent ? (
        <div className="flex flex-col gap-2">
          {description ? (
            <p className="m-0 px-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}

          {items?.length ? (
            <ExpandableItemSection tone={sectionTone} label={sectionLabel} hint={sectionHint}>
              <dl
                className={cn(
                  "m-0 grid gap-x-6 gap-y-2",
                  columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                )}
              >
                {items.map((item) => (
                  <div key={item.label} className="flex min-w-0 items-baseline gap-2">
                    <dt className="w-[62px] shrink-0 text-[11px] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd
                      title={item.title}
                      className={cn(
                        "m-0 min-w-0 flex-1 text-[11.5px] text-foreground",
                        item.mono && "font-mono text-[11px]",
                        item.wrap ? "break-all" : "truncate"
                      )}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </ExpandableItemSection>
          ) : null}

          {children}
        </div>
      ) : null}
    </ExpandableItem>
  )
}
