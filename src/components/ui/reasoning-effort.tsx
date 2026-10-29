"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * ReasoningEffort
 * -----------------------------------------------------------------------------
 * 思考强度档位滑块。源自 Android-Tool 的推理强度选择器（原生桌面质感）：
 * 渐变轨道 + 刻度点 + 圆形拖拽拇指 + 档位文字按钮。
 *
 * 档位数量不固定：2 ~ 6 档都可以，传几档就渲染几档（低 / 中 / 高 /
 * 极高 / 最高 …）。默认取 5 档，和产品里一致。
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
  /** 展示「恢复默认」按钮，点击回到 defaultLevel */
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
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )
  const last = Math.max(1, options.length - 1)
  const progress = index / last
  const current = options[index]

  return (
    <div
      data-slot="reasoning-effort"
      className={cn("w-full select-none", className)}
    >
      {(title || subtitle || onReset) && (
        <div className="relative mb-1 flex min-h-5 items-center gap-2 pr-7">
          {title && (
            <span className="text-[11px] font-medium text-foreground">
              {title}
            </span>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              aria-label="恢复默认思考强度"
              title="恢复默认思考强度"
              className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
            >
              <RotateCcw className="size-3" />
            </button>
          )}
        </div>
      )}

      {subtitle && (
        <div className="mb-2 truncate text-center text-[11px] text-muted-foreground">
          {subtitle}
        </div>
      )}

      {/* 轨道：渐变填充宽度 = 档位进度；刻度点均分；拇指跟随 */}
      <div
        className="relative mx-0.5 h-8"
        style={{ "--effort-progress": progress } as React.CSSProperties}
      >
        <span className="pointer-events-none absolute inset-x-0 top-1 h-6 rounded-full bg-muted" />
        <span
          className="pointer-events-none absolute left-0 top-1 h-6 overflow-hidden rounded-full bg-gradient-to-r from-primary/55 to-primary transition-[width] duration-150 ease-out"
          style={{ width: `calc(12px + (100% - 24px) * ${progress})` }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
          {options.map((option) => (
            <i
              key={option.value}
              className="size-[3px] rounded-full bg-foreground/30"
            />
          ))}
        </div>
        <span
          className="pointer-events-none absolute top-1 size-6 -translate-x-1/2 rounded-full border border-black/5 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.16)] transition-[left] duration-150 ease-out"
          style={{ left: `calc(12px + (100% - 24px) * ${progress})` }}
        />
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
          className="absolute inset-0 h-8 w-full cursor-grab appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed"
        />
      </div>

      <div className="mt-0.5 flex justify-between">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-w-7 px-0 py-0.5 text-[10px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50",
                active
                  ? "font-semibold text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {footer && (
        <div className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  )
}
