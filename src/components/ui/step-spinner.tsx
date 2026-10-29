"use client"

import * as React from "react"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepSpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 外圈直径，默认与 Android-Tool 的任务步骤圆一致。 */
  size?: number
  label?: string
}

/**
 * 运行态步骤指示器：主色淡底圆 + 旋转弧线。
 * 与通用 Spinner 区分，专门用于「某个步骤正在执行」的状态。
 */
export const StepSpinner = React.forwardRef<HTMLSpanElement, StepSpinnerProps>(
  ({ size = 20, label, className, style, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex shrink-0 animate-spin items-center justify-center rounded-full bg-primary/[0.12] text-primary motion-reduce:animate-none",
        className
      )}
      style={{ width: size, height: size, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      <LoaderCircle size={Math.max(8, Math.round(size * 0.65))} strokeWidth={2.6} />
    </span>
  )
)
StepSpinner.displayName = "StepSpinner"