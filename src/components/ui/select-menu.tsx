"use client"

// Options 式 Select：在 shadcn 原语（Popover + Command）之上组合，供业务侧用
// `options` 数组直接声明下拉项；外观与 demo 一致，trigger 默认 32px（h-8）。
// 支持分组、说明行、leading/trailing、行内删除、header/footer、keepOpenOnSelect。

import * as React from "react"
import { AppIcon } from "../icons/AppIcon"
import { cn } from "../../lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"

export interface SelectOptionAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}

export interface SelectOption {
  label: string
  value: string
  /** 行内删除按钮（如移除自定义主题、模型目录项）。 */
  onRemove?: () => void
  removeLabel?: string
  group?: { id: string; label: string }
  /** 标签下方的说明行。 */
  description?: string
  /** 置灰且不可选中。 */
  disabled?: boolean
  /** 与标签同行、右对齐的紧凑提示（如上下文窗口徽标）。 */
  trailing?: string
  /** 与标签同行的前置视觉（如主题色点）。 */
  leading?: React.ReactNode
  /** 行内操作按钮，点击不会选中该行。 */
  actions?: SelectOptionAction[]
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (val: string) => void
  /** 尺寸：sm 28px / md 32px（默认）/ lg 36px。 */
  size?: "sm" | "md" | "lg"
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  contentClassName?: string
  style?: React.CSSProperties
  /** 渲染在选项列表上方。 */
  header?: React.ReactNode
  /** 渲染在选项列表下方。 */
  footer?: React.ReactNode
  /** 选中后保持菜单打开。 */
  keepOpenOnSelect?: boolean
  "aria-label"?: string
}

const SIZE_TO_BUTTON: Record<NonNullable<SelectProps["size"]>, "sm" | "default" | "lg"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
}

const STOP_KEYS = ["Enter", " ", "Space"]

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      onChange,
      size = "md",
      placeholder = "请选择...",
      disabled = false,
      searchable = false,
      searchPlaceholder = "搜索选项",
      emptyText = "未找到匹配项",
      className,
      contentClassName,
      style,
      header,
      footer,
      keepOpenOnSelect = false,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue)
    const isControlled = value !== undefined
    const currentVal = isControlled ? value : uncontrolledValue
    const currentOption = options.find((option) => option.value === currentVal)
    const displayText = options.length === 0 ? "暂无数据" : currentOption?.label ?? currentVal ?? placeholder
    const [search, setSearch] = React.useState("")

    const handleSelect = (optionValue: string) => {
      if (!isControlled) setUncontrolledValue(optionValue)
      onChange?.(optionValue)
      if (!keepOpenOnSelect) setOpen(false)
    }

    // 连续同组折叠成一个 CommandGroup；未分组的项先渲染为无标题组。
    // 自管过滤：与旧 kit 一致的子串匹配，不依赖 cmdk 的模糊打分。
    const grouped = React.useMemo(() => {
      const query = search.trim().toLowerCase()
      const visible =
        searchable && query
          ? options.filter((option) =>
              [option.label, option.value, option.group?.label ?? ""]
                .join(" ")
                .toLowerCase()
                .includes(query)
            )
          : options
      const chunks: Array<{ id: string | null; label?: string; options: SelectOption[] }> = []
      for (const option of visible) {
        const id = option.group?.id ?? null
        const label = option.group?.label
        const tail = chunks[chunks.length - 1]
        if (tail && tail.id === id && tail.label === label) {
          tail.options.push(option)
        } else {
          chunks.push({ id, label, options: [option] })
        }
      }
      return chunks
    }, [options, searchable, search])

    // 未展开且没有任何选项时只展示空状态，不允许打开空弹层。
    const unavailable = disabled || options.length === 0

    return (
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (!unavailable) setOpen(next)
          if (!next) setSearch("")
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            role="combobox"
            variant="default"
            size={SIZE_TO_BUTTON[size]}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            disabled={unavailable}
            title={displayText}
            className={cn("w-fit min-w-0 max-w-full justify-between gap-2 px-3 font-normal", className)}
            style={style}
          >
            {/*
             * 宽度取所有可选项里最长的一行，而不是随当前选中项伸缩。
             *
             * 隐藏探针按弹层 item 的真实结构测量：图标、说明文字、右侧徽标、
             * 勾选槽和行内操作都会参与。弹层相对触发器多出的 20px 内边距
             * 用 -mx-2.5 抵消，末尾 pr-2 是统一预留的 8px。
             *
             * 列宽写死成 `minmax(0,1fr)`：不约束时整格仍按探针撑开（宽度照旧跟内容走），
             * 一旦外层把触发器收窄（设备选择器那种定宽下拉），列才跟着收窄，里面的
             * 文字才能真的省略。缺了它，列宽由探针的 max-content 决定，选中项会溢出到
             * 箭头底下被硬切掉，连省略号都不出现。
             */}
            <span className="grid min-w-0 max-w-full grid-cols-[minmax(0,1fr)]">
              {options.map((option, index) => (
                <span
                  key={`measure-option-${option.value}-${index}`}
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 -mx-2.5 flex w-max items-center gap-2 whitespace-nowrap pr-2"
                >
                  {option.leading && <span className="flex shrink-0 items-center">{option.leading}</span>}
                  <span className="flex flex-col items-start">
                    <span>{option.label}</span>
                    {option.description && (
                      <span className="text-[11px] text-muted-foreground">{option.description}</span>
                    )}
                  </span>
                  {option.trailing && (
                    <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{option.trailing}</span>
                  )}
                  <AppIcon name="check" className="size-3.5 shrink-0" />
                  {option.actions?.map((action) => (
                    <span
                      key={`measure-action-${action.label}`}
                      className="ml-1 inline-flex size-6 shrink-0 items-center justify-center"
                    >
                      {action.icon}
                    </span>
                  ))}
                  {option.onRemove && (
                    <span className="ml-1 inline-flex size-6 shrink-0 items-center justify-center">
                      <AppIcon name="trash" className="size-3.5" />
                    </span>
                  )}
                </span>
              ))}
              {Array.from(new Set(options.flatMap((option) => option.group?.label ?? []))).map((groupLabel, index) => (
                <span
                  key={`measure-group-${groupLabel}-${index}`}
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 -mx-2.5 w-max whitespace-nowrap pr-2 text-xs font-medium"
                >
                  {groupLabel}
                </span>
              ))}
              {[
                ...(currentVal && !currentOption ? [{ label: currentVal, leading: undefined }] : []),
                ...(!currentVal && !currentOption ? [{ label: displayText, leading: undefined }] : []),
              ].map((measureOption, index) => (
                <span
                  key={`measure-value-${measureOption.label}-${index}`}
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 flex items-center gap-2 whitespace-nowrap"
                >
                  {measureOption.leading}
                  {measureOption.label}
                </span>
              ))}
              <span className="col-start-1 row-start-1 flex min-w-0 items-center gap-2">
                {currentOption?.leading}
                <span className={cn("min-w-0 truncate", !currentOption && !currentVal && "text-muted-foreground/60")}>
                  {displayText}
                </span>
              </span>
            </span>
            <AppIcon name="chevrons-up-down" className="size-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-0 rounded-lg p-0 shadow-md",
            contentClassName
          )}
          onOpenAutoFocus={(event) => {
            // 可搜索时让输入框先拿焦点，避免 cmdk 抢走后光标又跳回列表。
            if (!searchable) event.preventDefault()
          }}
        >
          {header && <div className="border-b px-3 py-2">{header}</div>}
          <Command shouldFilter={false}>
            {searchable && (
              <CommandInput
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder}
                className="h-8 text-xs"
              />
            )}
            <CommandList className="max-h-[200px]">
              {searchable && <CommandEmpty>{options.length === 0 ? "暂无数据" : emptyText}</CommandEmpty>}
              {grouped.map((chunk, chunkIndex) => {
                const items = chunk.options.map((option) => {
                  const isSelected = option.value === currentVal
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value} ${option.group?.label ?? ""}`}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.leading && (
                        <span className="flex shrink-0 items-center" title={option.label}>
                          {option.leading}
                        </span>
                      )}
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate">{option.label}</span>
                        {option.description && (
                          <span className="truncate text-[11px] text-muted-foreground">{option.description}</span>
                        )}
                      </span>
                      {option.trailing && (
                        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground" title={option.trailing}>
                          {option.trailing}
                        </span>
                      )}
                      {isSelected && !option.trailing && <AppIcon name="check" className="ml-auto size-3.5" />}
                      {isSelected && option.trailing && <AppIcon name="check" className="size-3.5" />}
                      {option.actions?.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          aria-label={action.label}
                          title={action.label}
                          className={cn(
                            "ml-1 inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                            action.danger && "hover:bg-destructive/10 hover:text-destructive"
                          )}
                          onClick={(event) => {
                            event.stopPropagation()
                            action.onClick()
                          }}
                          onKeyDown={(event) => {
                            if (STOP_KEYS.includes(event.key)) event.stopPropagation()
                          }}
                        >
                          {action.icon}
                        </button>
                      ))}
                      {option.onRemove && (
                        <button
                          type="button"
                          aria-label={option.removeLabel || `删除 ${option.label}`}
                          title={option.removeLabel || `删除 ${option.label}`}
                          className="ml-1 inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          onClick={(event) => {
                            event.stopPropagation()
                            option.onRemove?.()
                          }}
                          onKeyDown={(event) => {
                            if (STOP_KEYS.includes(event.key)) event.stopPropagation()
                          }}
                        >
                          <AppIcon name="trash" className="size-3.5" />
                        </button>
                      )}
                    </CommandItem>
                  )
                })
                return (
                  <CommandGroup key={chunk.id ?? chunkIndex} heading={chunk.label}>
                    {items}
                  </CommandGroup>
                )
              })}
            </CommandList>
          </Command>
          {footer && <div className="border-t p-2">{footer}</div>}
        </PopoverContent>
      </Popover>
    )
  }
)

Select.displayName = "Select"

export default Select

