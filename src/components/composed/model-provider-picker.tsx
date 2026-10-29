"use client"

import * as React from "react"
import { Check, ChevronDown, Cpu, Plus, Search, Settings2 } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ReasoningEffort, REASONING_EFFORT_LEVELS } from "@/components/ui/reasoning-effort"
import { cn } from "@/lib/utils"

export type ModelOption = {
  id: string
  name: string
  contextWindow?: number | null
  description?: string
  supportsReasoning?: boolean
  /** 模型图标（品牌图标），不传则用通用芯片图标 */
  icon?: React.ReactNode
}

export type ProviderOption = {
  id: string
  name: string
  icon?: React.ReactNode
  models: ModelOption[]
}

export type ReasoningLevel = "low" | "medium" | "high" | "xhigh" | "max"

export interface ModelProviderPickerProps {
  providers?: ProviderOption[]
  selectedProviderId: string
  selectedModelId: string
  reasoningLevel?: ReasoningLevel
  onSelect: (providerId: string, modelId: string) => void
  onReasoningLevelChange?: (level: ReasoningLevel) => void
  onOpenSettings?: () => void
  /** 附加在触发器右侧的额外节点（如权限模式） */
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

function formatWindow(count?: number | null) {
  if (!count) return ""
  if (count >= 1_000_000) {
    const mega = count / 1_000_000
    return `${Number.isInteger(mega) ? mega : Number(mega.toFixed(1))}M`
  }
  if (count >= 1_000) {
    const kilo = count / 1_000
    return `${Number.isInteger(kilo) ? kilo : Number(kilo.toFixed(1))}K`
  }
  return String(count)
}

/**
 * 模型选择器
 * -----------------------------------------------------------------------------
 * 触发器和 Button default 完全同高（32px）、同圆角（10px）、同字号（12px）。
 * 触发器只显示模型本身：模型图标 + 模型名 + 上下文窗口 + 思考强度。
 * 供应商 / 协议不出现在触发器上。
 *
 * 弹层：宽度等于触发器宽度（与未展开的 Select 完全一致），
 * 第一行（供应商/模型标题行）已删除，只保留模型列表、思考强度与添加入口。
 */
export function ModelProviderPicker({
  providers = [],
  selectedProviderId,
  selectedModelId,
  reasoningLevel = "medium",
  onSelect,
  onReasoningLevelChange,
  onOpenSettings,
  children,
  className,
  disabled = false,
}: ModelProviderPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [effortOpen, setEffortOpen] = React.useState(false)

  const currentProvider =
    providers.find((p) => p.id === selectedProviderId) || providers[0]
  const currentModel =
    currentProvider?.models.find((m) => m.id === selectedModelId) ||
    currentProvider?.models[0]

  const flatModels = React.useMemo(
    () =>
      providers.flatMap((provider) =>
        provider.models.map((model) => ({ provider, model }))
      ),
    [providers]
  )

  const visible = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return flatModels
    return flatModels.filter(
      ({ model }) =>
        model.name.toLowerCase().includes(normalized) ||
        model.id.toLowerCase().includes(normalized)
    )
  }, [flatModels, query])

  const effortLabel =
    REASONING_EFFORT_LEVELS.find((level) => level.value === reasoningLevel)?.label ?? "中"

  const reasoningEnabled = Boolean(currentModel?.supportsReasoning && onReasoningLevelChange)

  const choose = (providerId: string, modelId: string) => {
    onSelect(providerId, modelId)
    setOpen(false)
    setEffortOpen(false)
    setQuery("")
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setEffortOpen(false)
            setQuery("")
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            aria-label="选择模型"
            className="h-8 max-w-[15rem] gap-1.5 px-2.5 font-normal"
          >
            <span className="flex size-4 shrink-0 items-center justify-center text-primary">
              {currentModel?.icon || currentProvider?.icon || <Cpu className="size-3.5" />}
            </span>
            <span className="min-w-0 truncate text-xs text-foreground">
              {currentModel?.name || "未配置模型"}
            </span>
            {currentModel?.contextWindow ? (
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                {formatWindow(currentModel.contextWindow)}
              </span>
            ) : null}
            {reasoningEnabled && currentModel?.supportsReasoning ? (
              <span className="shrink-0 text-[11px] text-muted-foreground">{effortLabel}</span>
            ) : null}
            <ChevronDown
              className={cn(
                "ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="top"
          sideOffset={6}
          className="w-[var(--radix-popover-trigger-width)] p-1.5"
        >
          {/* 模型列表（供应商与协议不展示） */}
          <div className="px-1 pb-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索模型"
                className="h-8 pl-7"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {visible.map(({ provider, model }) => {
              const selected = model.id === currentModel?.id && provider.id === currentProvider?.id
              return (
                <button
                  key={`${provider.id}-${model.id}`}
                  type="button"
                  onClick={() => choose(provider.id, model.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors outline-none hover:bg-muted focus-visible:bg-muted",
                    selected && "bg-muted/60"
                  )}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                    {model.icon || provider.icon || <Cpu className="size-3.5" />}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-xs",
                      selected ? "font-medium text-foreground" : "text-foreground/90"
                    )}
                  >
                    {model.name}
                  </span>
                  {model.contextWindow ? (
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {formatWindow(model.contextWindow)}
                    </span>
                  ) : null}
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    {selected && <Check className="size-3.5 text-primary" />}
                  </span>
                </button>
              )
            })}
            {visible.length === 0 && (
              <p className="px-2 py-3 text-center text-[11px] text-muted-foreground">
                {flatModels.length ? "没有匹配的模型" : "该供应商未保存模型"}
              </p>
            )}
          </div>

          {reasoningEnabled && (
            <>
              <Separator className="my-1.5" />
              <button
                type="button"
                aria-expanded={effortOpen}
                onClick={() => setEffortOpen((value) => !value)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
              >
                <span className="text-foreground">思考强度</span>
                <span className="ml-auto text-[11px] text-muted-foreground">{effortLabel}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-muted-foreground transition-transform",
                    effortOpen && "rotate-180"
                  )}
                />
              </button>
              {effortOpen && (
                <div className="px-2 pb-2 pt-1">
                  <ReasoningEffort
                    value={reasoningLevel}
                    title={null}
                    onReset={() =>
                      onReasoningLevelChange?.(
                        (REASONING_EFFORT_LEVELS.find((l) => l.value === "medium")?.value ??
                          "medium") as ReasoningLevel
                      )
                    }
                    onChange={(next) => onReasoningLevelChange?.(next as ReasoningLevel)}
                  />
                </div>
              )}
            </>
          )}

          {onOpenSettings && (
            <>
              <Separator className="my-1.5" />
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onOpenSettings()
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted"
              >
                <Settings2 className="size-3.5" />
                管理模型与密钥
                <Plus className="ml-auto size-3.5" />
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      {children}
    </div>
  )
}
