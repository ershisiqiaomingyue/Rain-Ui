"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "./button"
import { cn } from "../../lib/utils"
import "./reasoning-effort.css"

/**
 * ReasoningEffort
 * -----------------------------------------------------------------------------
 * 可插拔的思考强度选择器（2 ~ 6 档）。中间滑块完整迁移自 Android-Tool：
 * 24px 内轨、刻度点、白色旋钮与主题色流光；下方档位文字保留 rain-ui 现有设计。
 */

export interface ReasoningEffortOption {
  value: string
  label: string
}

export interface ReasoningEffortProps {
  /** 当前档位 value */
  value: string
  /** 档位清单，顺序即从低到高 */
  options?: ReasoningEffortOption[]
  onChange: (value: string) => void
  /** 面板顶部的标题，传 null 隐藏 */
  title?: string | null
  /** 面板副标题，一般是模型名 */
  subtitle?: React.ReactNode
  /** 展示「恢复默认」按钮 */
  onReset?: () => void
  /** 说明文字，显示在底部 */
  footer?: React.ReactNode
  className?: string
  disabled?: boolean
}

export const REASONING_EFFORT_LEVELS: ReasoningEffortOption[] = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
  { value: "xhigh", label: "极高" },
  { value: "max", label: "最高" },
]

export function ReasoningEffort({
  value,
  options = REASONING_EFFORT_LEVELS,
  onChange,
  title = "思考强度",
  subtitle,
  onReset,
  footer,
  className,
  disabled = false,
}: ReasoningEffortProps) {
  const found = options.findIndex((option) => option.value === value)
  const index = found >= 0 ? found : 0
  const last = Math.max(1, options.length - 1)
  const current = options[index]
  const progress = index / last

  return (
    <div
      data-slot="reasoning-effort"
      className={cn("w-full select-none", disabled && "opacity-60", className)}
    >
      {(title || onReset) && (
        <div className="flex h-7 items-center justify-between gap-2">
          {title ? (
            <span className="text-xs font-medium text-foreground">{title}</span>
          ) : (
            <span />
          )}
          {onReset && (
            <Button
              type="button"
              variant="bare"
              size="icon-xs"
              onClick={onReset}
              disabled={disabled}
              aria-label="恢复默认思考强度"
              title="恢复默认思考强度"
            >
              <RotateCcw />
            </Button>
          )}
        </div>
      )}

      {subtitle && (
        <div className="truncate pt-0.5 text-center text-[11px] text-muted-foreground">
          {subtitle}
        </div>
      )}

      <div
        className="rain-reasoning-track mt-2"
        data-minimum={index === 0 ? "true" : undefined}
        style={{ "--rain-inference-progress": progress } as React.CSSProperties}
      >
        <span className="rain-reasoning-track-base" aria-hidden="true" />
        <span className="rain-reasoning-track-fill" aria-hidden="true" />
        <div className="rain-reasoning-ticks" aria-hidden="true">
          {options.map((option) => (
            <i key={option.value} />
          ))}
        </div>
        <span className="rain-reasoning-thumb" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={last}
          step={1}
          value={index}
          disabled={disabled}
          aria-label={title ?? "思考强度"}
          aria-valuetext={current?.label}
          onChange={(event) => {
            const next = options[Number(event.target.value)]
            if (next) onChange(next.value)
          }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between gap-0.5">
        {options.map((option) => {
          const active = option.value === value
          return (
            <Button
              key={option.value}
              type="button"
              variant="bare"
              size="xs"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-w-0 px-1.5",
                active
                  ? "bg-primary/10 font-semibold text-primary hover:bg-primary/15 hover:text-primary"
                  : "text-muted-foreground"
              )}
            >
              {option.label}
            </Button>
          )
        })}
      </div>

      {footer && (
        <div className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  )
}