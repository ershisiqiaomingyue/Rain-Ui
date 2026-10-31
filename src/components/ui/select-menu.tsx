"use client"

// Options 式 Select：在 shadcn 原语（Popover + Command）之上组合，供业务侧用
// `options` 数组直接声明下拉项；外观与 demo 一致，trigger 默认 32px（h-8）。
// 支持分组、说明行、leading/trailing、行内删除、header/footer、keepOpenOnSelect。

import * as React from "react"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react"
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
            variant="outline"
            size={SIZE_TO_BUTTON[size]}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            disabled={unavailable}
            title={currentOption?.label || currentVal || placeholder}
            className={cn("w-full justify-between gap-2 px-3 font-normal", className)}
            style={style}
          >
            <span className="flex min-w-0 items-center gap-2 truncate">
              {currentOption?.leading}
              <span className={cn("truncate", !currentOption && !currentVal && "text-muted-foreground/60")}>
                {currentOption?.label ?? currentVal ?? placeholder}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[max(220px,var(--radix-popover-trigger-width))] rounded-lg p-0 shadow-md"
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
            <CommandList className="max-h-[320px]">
              {searchable && <CommandEmpty>{emptyText}</CommandEmpty>}
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
                        <span className="shrink-0" title={option.label}>
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
                      {isSelected && !option.trailing && <Check className="ml-auto size-3.5" />}
                      {isSelected && option.trailing && <Check className="size-3.5" />}
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
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </CommandItem>
                  )
                })
                return chunk.label ? (
                  <CommandGroup key={chunk.id ?? chunkIndex} heading={chunk.label}>
                    {items}
                  </CommandGroup>
                ) : (
                  <React.Fragment key={chunkIndex}>{items}</React.Fragment>
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

