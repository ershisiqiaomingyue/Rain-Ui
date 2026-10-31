"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

/* 与 Button default 同一度量：h-8 / rounded-[10px] / text-xs / px-3 */
const INPUT_BASE =
  "flex w-full min-w-0 rounded-[10px] border border-transparent bg-muted/45 hover:bg-muted/55 focus-visible:border-primary/40 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/15 px-3 py-1 text-xs text-foreground transition-[border-color,background-color,box-shadow] outline-none placeholder:text-muted-foreground/60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"

const INPUT_SIZE = {
  sm: "h-7 text-[11px]",
  md: "h-8",
  lg: "h-9 text-sm",
} as const

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  size?: keyof typeof INPUT_SIZE
  variant?: "sunken" | "surface"
  prefixIcon?: React.ReactNode
  suffixAction?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
  inputStyle?: React.CSSProperties
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size = "md",
      variant = "sunken",
      prefixIcon,
      suffixAction,
      clearable,
      onClear,
      wrapperClassName,
      wrapperStyle,
      inputStyle,
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = typeof value === "number" || (typeof value === "string" && value.length > 0)
    const showClear = Boolean(clearable && !disabled && hasValue)
    const decorated = Boolean(prefixIcon || suffixAction || showClear)

    const input = (
      <input
        type={type}
        data-slot="input"
        ref={ref}
        value={value}
        disabled={disabled}
        className={cn(
          INPUT_BASE,
          INPUT_SIZE[size],
          variant === "surface" && "border-border bg-background/80 hover:bg-background",
          prefixIcon && "pl-8",
          suffixAction && showClear ? "pr-14" : (suffixAction || showClear) && "pr-8",
          className
        )}
        style={inputStyle}
        {...props}
      />
    )

    if (!decorated) return input

    return (
      <div
        data-slot="input-wrapper"
        className={cn("relative flex w-full items-center", wrapperClassName)}
        style={wrapperStyle}
      >
        {prefixIcon && (
          <span
            data-slot="input-prefix"
            className="pointer-events-none absolute left-2.5 z-1 flex items-center text-muted-foreground"
          >
            {prefixIcon}
          </span>
        )}
        {input}
        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="清空"
            title="清空"
            onClick={onClear}
            className={cn(
              "absolute right-1 flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
              suffixAction && "right-7"
            )}
          >
            <X className="size-3" />
          </button>
        )}
        {suffixAction && (
          <span
            data-slot="input-suffix"
            className="absolute right-1.5 flex items-center text-muted-foreground"
          >
            {suffixAction}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
