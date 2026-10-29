"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Slider（基础组件）
 * -----------------------------------------------------------------------------
 * 原生 range 之上的一层受控滑块：32px 胶囊命中区、24px 內轨、24px 白色旋钮。
 * 与 Button default 同高同圆角，以桌面应用的内嵌控制器形态呈现。
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
          "relative flex h-8 w-full items-center rounded-full select-none",
          disabled && "opacity-50",
          className
        )}
      >
        <div className="absolute inset-x-0 h-6 overflow-hidden rounded-full bg-muted/90 ring-1 ring-inset ring-border/55">
          <div className="h-full rounded-full bg-primary transition-[width] duration-75" style={{ width: `${percent}%` }} />
        </div>
        <span
          className="pointer-events-none absolute size-5 -translate-x-1/2 rounded-full border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.22)] dark:border-white/15 dark:bg-zinc-100"
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
