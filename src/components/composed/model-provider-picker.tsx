"use client"

import * as React from "react"
import { Check, ChevronDown, Cpu, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ModelOption = {
  id: string
  name: string
  contextWindow?: number | null
  description?: string
  supportsReasoning?: boolean
}

export type ProviderOption = {
  id: string
  name: string
  icon?: React.ReactNode
  models: ModelOption[]
}

export type ReasoningLevel = "low" | "medium" | "high" | "max"

export interface ModelProviderPickerProps {
  providers?: ProviderOption[]
  selectedProviderId: string
  selectedModelId: string
  reasoningLevel?: ReasoningLevel
  onSelect: (providerId: string, modelId: string) => void
  onReasoningLevelChange?: (level: ReasoningLevel) => void
  onOpenSettings?: () => void
  className?: string
  disabled?: boolean
}

function formatWindow(count?: number | null) {
  if (!count) return ""
  if (count >= 1_000_000) return `${count / 1_000_000}M`
  if (count >= 1_000) return `${count / 1_000}K`
  return `${count}`
}

export function ModelProviderPicker({
  providers = [],
  selectedProviderId,
  selectedModelId,
  reasoningLevel = "medium",
  onSelect,
  onReasoningLevelChange,
  onOpenSettings,
  className,
  disabled = false,
}: ModelProviderPickerProps) {
  const currentProvider =
    providers.find((p) => p.id === selectedProviderId) || providers[0]
  const currentModel =
    currentProvider?.models.find((m) => m.id === selectedModelId) ||
    currentProvider?.models[0]

  const reasoningLevels: { id: ReasoningLevel; label: string }[] = [
    { id: "low", label: "低推理 (Low)" },
    { id: "medium", label: "中等推理 (Medium)" },
    { id: "high", label: "高推理深度 (High)" },
    { id: "max", label: "极致推理 (Max)" },
  ]

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className="h-7 gap-1.5 px-2.5 rounded-lg border-border/80 bg-background/80 hover:bg-muted text-xs font-normal"
          >
            <div className="flex items-center gap-1.5">
              {currentProvider?.icon || <Cpu className="size-3.5 text-primary" />}
              <span className="font-medium text-foreground">
                {currentProvider?.name || "Provider"}
              </span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{currentModel?.name || "Model"}</span>
              {currentModel?.contextWindow && (
                <span className="ml-0.5 text-[10px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground">
                  {formatWindow(currentModel.contextWindow)}
                </span>
              )}
            </div>
            <ChevronDown className="size-3 text-muted-foreground opacity-60 ml-0.5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="w-56 p-1 rounded-xl shadow-lg border-border/80"
        >
          <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1">
            切换 AI 服务商与模型
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {providers.map((p) => {
            const isCurrentP = p.id === currentProvider?.id
            return (
              <DropdownMenuSub key={p.id}>
                <DropdownMenuSubTrigger className="text-xs px-2 py-1.5 rounded-md">
                  <div className="flex items-center gap-2 flex-1">
                    {p.icon || <Cpu className="size-3.5 text-muted-foreground" />}
                    <span>{p.name}</span>
                  </div>
                  {isCurrentP && <span className="size-1.5 rounded-full bg-primary mr-1" />}
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent className="w-52 p-1 rounded-xl shadow-lg border-border/80">
                  <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1">
                    {p.name} 模型库
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {p.models.map((m) => {
                      const isSelected = isCurrentP && m.id === currentModel?.id
                      return (
                        <DropdownMenuItem
                          key={m.id}
                          onClick={() => onSelect(p.id, m.id)}
                          className="text-xs px-2 py-1.5 rounded-md flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className={cn(isSelected && "font-semibold text-primary")}>
                              {m.name}
                            </span>
                            {m.contextWindow && (
                              <span className="font-mono text-[10px] text-muted-foreground">
                                上下文 {formatWindow(m.contextWindow)}
                              </span>
                            )}
                          </div>
                          {isSelected && <Check className="size-3.5 text-primary ml-2" />}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          })}

          {onOpenSettings && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onOpenSettings}
                className="text-xs px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                配置模型与 API Key...
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 推理深度指示 (若模型支持思考) */}
      {currentModel?.supportsReasoning && onReasoningLevelChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              title="设置思考推理深度"
            >
              <Sparkles className="size-3 text-amber-500" />
              <span className="text-[11px] capitalize">{reasoningLevel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl border-border/80">
            <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1">
              思考推理深度
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {reasoningLevels.map((lvl) => (
              <DropdownMenuItem
                key={lvl.id}
                onClick={() => onReasoningLevelChange(lvl.id)}
                className="text-xs px-2 py-1.5 rounded-md flex items-center justify-between cursor-pointer"
              >
                <span>{lvl.label}</span>
                {reasoningLevel === lvl.id && <Check className="size-3.5 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
