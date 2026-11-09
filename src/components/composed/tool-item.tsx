"use client"

import * as React from "react"

import { FieldError } from "../ui/field"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import {
  ExpandableItem,
  ExpandableItemSection,
  type ExpandableItemProps,
  type ExpandableItemSectionTone,
} from "./expandable-item"

/**
 * 工具条目 —— 展开后是「说明 + 可编辑字段 + 底部动作」。
 *
 * 给语言服务器、工具链这类「一行说明去哪改」的场景用：收起态只有名称 + 版本，
 * 点开才把启动命令、启动参数这些暴露出来。
 *
 * 每个字段自己是一张分项卡片（默认主题色，需要区分分组时按字段给 tone），
 * 输入框在分项里回到白底——这样「卡片 → 分项 → 输入框」三层底色一路分得清。
 * 说明文字不套卡片，直接躺在展开区里，免得衬得整块都在飘。
 */

export interface ToolField {
  id: string
  label: string
  value: string
  placeholder?: string
  /** 字段下方的补充说明 */
  description?: string
  /** 与 label 同行的右对齐提示，例如「可填命令名或绝对路径」 */
  hint?: string
  /** 这一张分项卡片的配色，默认主题色 */
  tone?: ExpandableItemSectionTone
  readOnly?: boolean
  /** 路径、参数、版本号这类等宽显示 */
  mono?: boolean
  /** 校验失败文案 */
  error?: string
  /** 行尾动作，例如「浏览…」选文件按钮 */
  action?: React.ReactNode
  onChange?: (value: string) => void
}

export interface ToolItemProps extends Omit<ExpandableItemProps, "children" | "footer"> {
  /** 展开区第一行的说明 */
  description?: React.ReactNode
  fields?: ToolField[]
  children?: React.ReactNode
  footerLeft?: React.ReactNode
  footer?: React.ReactNode
}

export function ToolItem({ description, fields, children, ...rest }: ToolItemProps) {
  const hasContent = Boolean(description || fields?.length || children)

  return (
    <ExpandableItem {...rest}>
      {hasContent ? (
        <div className="flex flex-col gap-2">
          {description ? (
            <p className="m-0 px-0.5 text-[11.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}

          {fields?.map((field) => (
            <ExpandableItemSection
              key={field.id}
              tone={field.tone ?? "neutral"}
              label={field.label}
              hint={field.hint}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <Input
                  id={field.id}
                  size="sm"
                  variant="surface"
                  value={field.value}
                  readOnly={field.readOnly}
                  placeholder={field.placeholder}
                  onChange={
                    field.onChange ? (event) => field.onChange?.(event.target.value) : undefined
                  }
                  className={cn("min-w-0 flex-1", field.mono && "font-mono text-[11px]")}
                />
                {field.action}
              </div>
              {field.description ? (
                <p className="mt-1.5 mb-0 px-0.5 text-[11px] leading-normal text-muted-foreground">
                  {field.description}
                </p>
              ) : null}
              {field.error ? <FieldError className="mt-1.5">{field.error}</FieldError> : null}
            </ExpandableItemSection>
          ))}

          {children}
        </div>
      ) : null}
    </ExpandableItem>
  )
}
