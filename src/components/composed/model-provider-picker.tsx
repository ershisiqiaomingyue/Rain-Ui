"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronRight, Cpu, Plus, Settings2 } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
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
 * 触发器与 Button default 同度量：模型图标、模型名、上下文窗口与思考强度同处一条水平线。
 * 模型和思考强度各自使用向上展开的 Popover。
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
  const [modelOpen, setModelOpen] = React.useState(false)
  const [reasoningOpen, setReasoningOpen] = React.useState(false)

  const currentProvider =
    providers.find((provider) => provider.id === selectedProviderId) || providers[0]
  const currentModel =
    currentProvider?.models.find((model) => model.id === selectedModelId) ||
    currentProvider?.models[0]

  const effortLabel =
    REASONING_EFFORT_LEVELS.find((level) => level.value === reasoningLevel)?.label ?? "中"
  const reasoningEnabled = Boolean(currentModel?.supportsReasoning && onReasoningLevelChange)

  const choose = (providerId: string, modelId: string) => {
    onSelect(providerId, modelId)
    setModelOpen(false)
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <ButtonGroup>
        <Popover open={modelOpen} onOpenChange={setModelOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              aria-label={`选择模型，当前 ${currentModel?.name ?? "未配置模型"}`}
              className="h-8 min-w-0 items-center gap-1.5 px-2.5 font-normal leading-none"
            >
              <span className="flex size-4 shrink-0 items-center justify-center text-primary">
                {currentModel?.icon || currentProvider?.icon || <Cpu className="size-3.5" />}
              </span>
              <span className="max-w-[9.5rem] truncate text-center text-xs leading-none text-foreground">
                {currentModel?.name || "未配置模型"}
              </span>
              {currentModel?.contextWindow ? (
                <span className="shrink-0 self-center font-mono text-[11px] leading-none tabular-nums text-muted-foreground">
                  {formatWindow(currentModel.contextWindow)}
                </span>
              ) : null}
              <ChevronDown
                className={cn(
                  "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150",
                  modelOpen && "rotate-180"
                )}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="top"
            sideOffset={6}
            collisionPadding={8}
            avoidCollisions={false}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="w-[var(--radix-popover-trigger-width)] p-1.5"
          >
            <div className="flex flex-col gap-0.5">
              {providers.map((provider) => {
                const active = provider.id === currentProvider?.id
                return (
                  <HoverCard key={provider.id} openDelay={80} closeDelay={120}>
                    <HoverCardTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-xs outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40",
                          active && "bg-muted/70"
                        )}
                      >
                        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                          {provider.icon || <Cpu className="size-3.5" />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-foreground">{provider.name}</span>
                        <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-muted-foreground">
                          {provider.models.length}
                        </span>
                        <span className="flex size-3.5 shrink-0 items-center justify-center">
                          {active && <Check className="size-3 text-primary" />}
                        </span>
                        <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" align="start" sideOffset={6} collisionPadding={8} className="w-56 p-1">
                      <div className="max-h-56 overflow-y-auto">
                        {provider.models.map((model) => {
                          const selected = active && model.id === currentModel?.id
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => choose(provider.id, model.id)}
                              className={cn(
                                "flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-xs outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40",
                                selected && "bg-muted/70"
                              )}
                            >
                              <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                                {model.icon || <Cpu className="size-3.5" />}
                              </span>
                              <span className="min-w-0 flex-1 truncate text-foreground">{model.name}</span>
                              {model.contextWindow ? (
                                <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-muted-foreground">
                                  {formatWindow(model.contextWindow)}
                                </span>
                              ) : null}
                              <span className="flex size-3.5 shrink-0 items-center justify-center">
                                {selected && <Check className="size-3 text-primary" />}
                              </span>
                            </button>
                          )
                        })}
                        {provider.models.length === 0 && (
                          <p className="px-2 py-3 text-center text-[11px] text-muted-foreground">
                            该供应商未保存模型
                          </p>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )
              })}
              {providers.length === 0 && (
                <p className="px-2 py-2 text-center text-[11px] text-muted-foreground">还没有供应商</p>
              )}
            </div>

            {onOpenSettings && (
              <>
                <Separator className="my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setModelOpen(false)
                    onOpenSettings()
                  }}
                  className="flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-xs text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <Settings2 className="size-3.5" />
                  管理模型与密钥
                  <Plus className="ml-auto size-3.5" />
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>

        {reasoningEnabled && (
          <Popover open={reasoningOpen} onOpenChange={setReasoningOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                aria-label={`选择思考强度，当前 ${effortLabel}`}
                aria-expanded={reasoningOpen}
                className="h-8 items-center gap-1.5 px-2.5 font-normal leading-none text-muted-foreground"
              >
                <span className="shrink-0 self-center text-[11px] leading-none text-muted-foreground">思考</span>
                <span className="inline-flex w-7 shrink-0 items-center justify-center self-center text-xs font-medium leading-none text-foreground">{effortLabel}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 shrink-0 transition-transform duration-150",
                    reasoningOpen && "rotate-180"
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={6}
              collisionPadding={8}
              avoidCollisions={false}
              className="w-64 p-3"
              aria-label="思考强度"
            >
              <ReasoningEffort
                value={reasoningLevel}
                title="思考强度"
                subtitle={currentModel?.name}
                onReset={() =>
                  onReasoningLevelChange?.(
                    (REASONING_EFFORT_LEVELS.find((level) => level.value === "medium")?.value ??
                      "medium") as ReasoningLevel
                  )
                }
                onChange={(next) => onReasoningLevelChange?.(next as ReasoningLevel)}
              />
            </PopoverContent>
          </Popover>
        )}
      </ButtonGroup>

      {children}
    </div>
  )
}
