"use client"

import * as React from "react"
import { AppIcon } from "../icons/AppIcon"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import {
  ReasoningEffort,
  REASONING_EFFORT_LEVELS,
  type ReasoningEffortOption,
} from "../ui/reasoning-effort"
import { cn } from "../../lib/utils"
import "./model-provider-picker.css"

export type ModelOption = {
  id: string
  name: string
  contextWindow?: number | null
  description?: string
  supportsReasoning?: boolean
  /** 模型图标（品牌图标），不传则用通用芯片图标 */
  icon?: React.ReactNode
  /** 行尾附加内容（积分倍率、限时免费标签等），排在上下文窗口右侧 */
  meta?: React.ReactNode
}

export type ProviderOption = {
  id: string
  name: string
  icon?: React.ReactNode
  models: ModelOption[]
}

export type ReasoningLevel = "off" | "low" | "medium" | "high" | "xhigh" | "max"

export interface ModelProviderPickerProps {
  providers?: ProviderOption[]
  selectedProviderId: string
  selectedModelId: string
  reasoningLevel?: ReasoningLevel
  onSelect: (providerId: string, modelId: string) => void
  onReasoningLevelChange?: (level: ReasoningLevel) => void
  onOpenSettings?: () => void
  /** 模型列表可搜索：供应商模型多于 8 个时在列表顶部给出搜索框 */
  searchable?: boolean
  /** 允许的思考档位，默认五档全开 */
  reasoningOptions?: ReasoningEffortOption[]
  /** 模型固定思考强度时的说明（如「固定思考模式」）：给了就渲染成不可点的按钮 */
  reasoningFixedHint?: string
  /** 模型清单面板的宽度覆盖（行尾带积分倍率、营销标签时用 w-72 之类放宽） */
  modelPanelClassName?: string
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
 * 单个供应商的模型清单。
 *
 * 抽成独立组件是因为搜索词是每个供应商自己的状态（hooks 不能写在 map 回调里）；
 * HoverCard 关闭即卸载，搜索词自然复位。
 */
function ProviderModelsPanel({
  provider,
  active,
  selectedModelId,
  searchable,
  onChoose,
  className = "p-1",
}: {
  provider: ProviderOption
  active: boolean
  selectedModelId: string
  searchable: boolean
  onChoose: (providerId: string, modelId: string) => void
  /** 直接铺在弹层里(单供应商)时不带内边距，行才会和「管理模型与密钥」对齐。 */
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  const keyword = query.trim().toLowerCase()
  const models = keyword
    ? provider.models.filter(
        (model) =>
          model.name.toLowerCase().includes(keyword) || model.id.toLowerCase().includes(keyword)
      )
    : provider.models
  const showSearch = searchable && provider.models.length > 8

  return (
    <div className={className}>
      {showSearch && (
        <Input
          size="sm"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索模型"
          aria-label={`搜索 ${provider.name} 的模型`}
          prefixIcon={<AppIcon name="search" size={14} className="size-3.5" />}
          clearable
          onClear={() => setQuery("")}
          className="mb-1"
        />
      )}

      <div className="ui-model-picker-list">
        {models.map((model) => {
          const selected = active && model.id === selectedModelId
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onChoose(provider.id, model.id)}
              className={cn(
                "flex h-8 w-full items-center gap-2 rounded-[8px] px-2 text-left text-xs outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40",
                selected && "bg-muted/70"
              )}
            >
              <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                {model.icon || <AppIcon name="cpu" size={14} className="size-3.5" />}
              </span>
              {/* 行高与截断由 .ui-model-picker-label 给出：行高必须留足下伸部空间，
                  否则 g/p/q/y 的尾巴会被 overflow:hidden 切掉。 */}
              <span className="ui-model-picker-label min-w-0 flex-1 self-center text-foreground">
                {model.name}
              </span>
              {model.contextWindow ? (
                <span className="min-w-7 shrink-0 self-center text-right font-mono text-[10.5px] leading-none tabular-nums text-muted-foreground">
                  {formatWindow(model.contextWindow)}
                </span>
              ) : null}
              {model.meta ? (
                <span className="flex shrink-0 items-center gap-1 self-center">{model.meta}</span>
              ) : null}
              <span className="flex size-3.5 shrink-0 items-center justify-center">
                {selected && <AppIcon name="check" size={12} className="size-3 text-primary" />}
              </span>
            </button>
          )
        })}
        {models.length === 0 && (
          <p className="px-2 py-3 text-center text-[11px] text-muted-foreground">
            {provider.models.length === 0 ? "该供应商未保存模型" : "没有匹配的模型"}
          </p>
        )}
      </div>
    </div>
  )
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
  searchable = false,
  reasoningOptions = REASONING_EFFORT_LEVELS,
  reasoningFixedHint,
  modelPanelClassName,
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

  // 只有一个供应商时(外部 ACP 引擎就是这种:一家引擎一套模型),供应商这一层
  // 只剩一次多余的点击 —— 直接把它的模型清单铺在弹层里。
  const soloProvider = providers.length === 1 ? providers[0] : null

  const effortLabel =
    reasoningOptions.find((level) => level.value === reasoningLevel)?.label ??
    REASONING_EFFORT_LEVELS.find((level) => level.value === reasoningLevel)?.label ??
    "中"
  // 可调：模型支持思考且至少要有一个以上档位可选。
  const reasoningAdjustable = Boolean(
    currentModel?.supportsReasoning && onReasoningLevelChange && reasoningOptions.length > 1
  )
  // 固定：模型支持思考但无档位可调，用不可点的按钮把这件事说明白。
  const reasoningFixed = Boolean(
    currentModel?.supportsReasoning && reasoningFixedHint && !reasoningAdjustable
  )

  const choose = (providerId: string, modelId: string) => {
    onSelect(providerId, modelId)
    setModelOpen(false)
  }

  return (
    <div className={cn("ui-model-picker inline-flex items-center gap-2", className)}>
      <ButtonGroup>
        <Popover open={modelOpen} onOpenChange={setModelOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              disabled={disabled}
              aria-label={`选择模型，当前 ${currentModel?.name ?? "未配置模型"}`}
              className="h-8 min-w-0 items-center gap-1.5 px-2.5 font-normal leading-none"
            >
              <span className="flex size-4 shrink-0 items-center justify-center text-primary">
                {currentModel?.icon || currentProvider?.icon || <AppIcon name="cpu" size={14} className="size-3.5" />}
              </span>
              <span className="ui-model-picker-label ui-model-picker-trigger-label text-foreground">
                {currentModel?.name || "未配置模型"}
              </span>
              {currentModel?.contextWindow ? (
                <span className="ui-model-picker-window shrink-0 self-center font-mono text-[11px] leading-none tabular-nums text-muted-foreground">
                  {formatWindow(currentModel.contextWindow)}
                </span>
              ) : null}
              <AppIcon
                name="chevron-down"
                size={14}
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
            className={cn(
              "w-max min-w-[var(--radix-popover-trigger-width)] max-w-[17rem] p-1.5",
              soloProvider && modelPanelClassName
            )}
          >
            {soloProvider ? (
              <ProviderModelsPanel
                className="p-0"
                provider={soloProvider}
                active
                selectedModelId={currentModel?.id ?? ""}
                searchable={searchable}
                onChoose={choose}
              />
            ) : (
              <div className="ui-model-picker-providers">
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
                            {provider.icon || <AppIcon name="cpu" size={14} className="size-3.5" />}
                          </span>
                          <span className="ui-model-picker-label min-w-0 flex-1 self-center text-foreground">
                            {provider.name}
                          </span>
                          <span className="shrink-0 self-center font-mono text-[10.5px] leading-none tabular-nums text-muted-foreground">
                            {provider.models.length}
                          </span>
                          <span className="flex size-3.5 shrink-0 items-center justify-center">
                            {active && <AppIcon name="check" size={12} className="size-3 text-primary" />}
                          </span>
                          <AppIcon name="chevron-right" size={14} className="size-3.5 shrink-0 text-muted-foreground" />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent side="right" align="start" sideOffset={6} collisionPadding={8} className={cn("w-max min-w-44 max-w-72 p-0", modelPanelClassName)}>
                        <ProviderModelsPanel
                          provider={provider}
                          active={active}
                          selectedModelId={currentModel?.id ?? ""}
                          searchable={searchable}
                          onChoose={choose}
                        />
                      </HoverCardContent>
                    </HoverCard>
                  )
                })}
                {providers.length === 0 && (
                  <p className="px-2 py-2 text-center text-[11px] text-muted-foreground">还没有供应商</p>
                )}
              </div>
            )}

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
                  <AppIcon name="settings" size={14} className="size-3.5" />
                  管理模型与密钥
                  <AppIcon name="plus" size={14} className="ml-auto size-3.5" />
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>

        {reasoningAdjustable && (
          <Popover open={reasoningOpen} onOpenChange={setReasoningOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="default"
                disabled={disabled}
                aria-label={`选择思考强度，当前 ${effortLabel}`}
                aria-expanded={reasoningOpen}
                className="ui-model-picker-reasoning h-8 items-center gap-1.5 px-2.5 font-normal leading-none text-muted-foreground"
              >
                <span className="shrink-0 self-center text-[11px] leading-none text-muted-foreground">思考</span>
                <span className="inline-flex w-7 shrink-0 items-center justify-center self-center text-xs font-medium leading-none text-foreground">{effortLabel}</span>
                <AppIcon
                  name="chevron-down"
                  size={14}
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
                options={reasoningOptions}
                title="思考强度"
                subtitle={currentModel?.name}
                onClose={() => setReasoningOpen(false)}
                onReset={() =>
                  onReasoningLevelChange?.(
                    (reasoningOptions.find((level) => level.value === "medium")?.value ??
                      reasoningOptions[Math.floor(reasoningOptions.length / 2)]?.value ??
                      "medium") as ReasoningLevel
                  )
                }
                onChange={(next) => onReasoningLevelChange?.(next as ReasoningLevel)}
              />
            </PopoverContent>
          </Popover>
        )}

        {reasoningFixed && (
          <Button
            variant="default"
            disabled
            title={reasoningFixedHint}
            aria-label={`思考强度固定：${reasoningFixedHint}`}
            className="ui-model-picker-reasoning h-8 items-center gap-1.5 px-2.5 font-normal leading-none text-muted-foreground"
          >
            <span className="shrink-0 self-center text-[11px] leading-none text-muted-foreground">思考</span>
            <span className="inline-flex shrink-0 items-center justify-center self-center text-xs font-medium leading-none text-foreground">{effortLabel}</span>
          </Button>
        )}
      </ButtonGroup>

      {children}
    </div>
  )
}
