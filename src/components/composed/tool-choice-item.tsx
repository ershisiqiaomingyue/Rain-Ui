"use client"

import * as React from "react"

import { AppIcon } from "../icons/AppIcon"
import { cn } from "../../lib/utils"
import {
  ExpandableItem,
  ExpandableItemMedia,
  ExpandableItemSection,
  type ExpandableItemIcon,
  type ExpandableItemProps,
  type ExpandableItemSectionTone,
} from "./expandable-item"

/**
 * 工具条目 —— 展开后是「二选一 / 多选一」的那一套。
 *
 * 场景是「同一个能力有好几种来源」：用应用自己管的这份，还是用系统里那个；
 * 语言服务器用内置的，还是指定一个可执行文件。收起态只显示当前用的是哪个，
 * 点开才把候选项摊出来，选中即生效（要草稿 + 保存就用 ToolItem 那一套）。
 *
 * 候选项整体装在一张浅色分项卡片里，**选中的那一项在白底上立起来**（回到卡片白 +
 * 主题色描边），所以「当前用的是哪个」在彩色底上也不用找，扫一眼就看得到。
 */

export interface ToolChoiceOption {
  id: string
  label: React.ReactNode
  /** 选项下的补充说明 */
  description?: React.ReactNode
  /** 行尾等宽信息：版本号、占用体积… */
  meta?: React.ReactNode
  icon?: ExpandableItemIcon
  disabled?: boolean
}

export interface ToolChoiceItemProps extends Omit<ExpandableItemProps, "children"> {
  /** 当前选中的选项 id */
  value: string
  options: ToolChoiceOption[]
  onChange?: (id: string) => void
  /** 展开区第一行的说明 */
  description?: React.ReactNode
  /** 候选项分项卡片的标题，例如「来源」 */
  sectionLabel?: React.ReactNode
  /** 候选项分项卡片的配色，默认主题色（跟壳的 tone 不是一个东西：那个管行首图标盘） */
  sectionTone?: ExpandableItemSectionTone
  children?: React.ReactNode
}

export function ToolChoiceItem({
  value,
  options,
  onChange,
  description,
  sectionLabel,
  sectionTone = "neutral",
  children,
  title,
  ...rest
}: ToolChoiceItemProps) {
  const hasContent = Boolean(description || options.length || children)

  return (
    <ExpandableItem title={title} {...rest}>
      {hasContent ? (
        <div className="flex flex-col gap-2">
          {description ? (
            <p className="m-0 px-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}

          {options.length ? (
            <ExpandableItemSection tone={sectionTone} label={sectionLabel}>
              <div
                role="radiogroup"
                aria-label={typeof title === "string" ? title : undefined}
                className="flex flex-col gap-1.5"
              >
                {options.map((option) => {
                  const selected = option.id === value
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={option.disabled}
                      onClick={() => onChange?.(option.id)}
                      className={cn(
                        "flex min-w-0 items-center gap-2.5 rounded-[10px] border px-2.5 py-2 text-left outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-ring/40",
                        selected
                          ? "border-primary/40 bg-card shadow-xs ring-1 ring-primary/15"
                          : "border-transparent hover:bg-card/70",
                        option.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {selected ? (
                          <AppIcon name="check" aria-hidden strokeWidth={3.2} className="size-2.5" />
                        ) : null}
                      </span>

                      {option.icon ? <ExpandableItemMedia icon={option.icon} /> : null}

                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          className={cn(
                            "truncate text-xs text-foreground",
                            selected && "font-medium"
                          )}
                        >
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="truncate text-[11px] text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </span>

                      {option.meta ? (
                        <span
                          className={cn(
                            "shrink-0 font-mono text-[10.5px]",
                            selected ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {option.meta}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </ExpandableItemSection>
          ) : null}

          {children}
        </div>
      ) : null}
    </ExpandableItem>
  )
}
