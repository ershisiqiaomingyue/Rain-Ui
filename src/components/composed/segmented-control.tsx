"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  label: string
  className?: string
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-muted/70 border border-border/60",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-pressed={active}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center justify-center h-6 px-2.5 rounded-md text-xs transition-all duration-100 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50 disabled:pointer-events-none",
              active
                ? "bg-background text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
