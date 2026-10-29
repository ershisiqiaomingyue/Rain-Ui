"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Slider（基础组件）
 * -----------------------------------------------------------------------------
 * 原生 range 之上的一层受控滑块：轨道 6px、圆角全通、拇指 16px 圆形。
 * 高度与 Button default 对齐（h-8 命中区），视觉轨道居中。
 */
export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, min = 0, max = 100, step = 1, className, disabled, ...props }, ref) => {
    const percent = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

    return (
      <div
        data-slot="slider"
        className={cn(
          "relative flex h-8 w-full items-center select-none",
          disabled && "opacity-50",
          className
        )}
      >
        <div className="absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-75" style={{ width: `${percent}%` }} />
        </div>
        <span
          className="pointer-events-none absolute size-4 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow-xs"
          style={{ left: `${percent}%` }}
        />
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => onValueChange(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed"
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
