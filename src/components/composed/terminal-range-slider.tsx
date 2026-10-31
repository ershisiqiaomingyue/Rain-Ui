"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface TerminalRangeSliderProps {
  title?: string
  desc?: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
  className?: string
  onChange: (value: number) => void
}

export function TerminalRangeSlider({
  title = "终端字体大小",
  desc = "控制内置交互终端控制台的等宽字体大小 (px)",
  value,
  min = 10,
  max = 24,
  step = 1,
  unit = "px",
  disabled = false,
  className,
  onChange,
}: TerminalRangeSliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-colors",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-xs font-semibold text-foreground tracking-tight">
          {title}
        </span>
        {desc && (
          <span className="text-[11.5px] text-muted-foreground leading-normal line-clamp-1">
            {desc}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex items-center w-36 sm:w-44 h-6">
          {/* 原生桌面平滑轨道底色 */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-75"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            aria-label={title}
            onChange={(e) => onChange(Number.parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {/* Apple HIG 质感圆形滑动拇指 (Thumb) */}
          <div
            className="absolute size-4 rounded-full bg-background border-2 border-primary shadow-xs pointer-events-none -translate-x-1/2 transition-transform duration-75 active:scale-110"
            style={{ left: `${percentage}%` }}
          />
        </div>

        {/* 右侧数值药丸徽章 */}
        <span className="min-w-12 text-right font-mono text-xs tabular-nums font-medium text-foreground px-1.5 py-0.5 rounded-md bg-muted/70 border border-border/50">
          {value}
          {unit}
        </span>
      </div>
    </div>
  )
}
