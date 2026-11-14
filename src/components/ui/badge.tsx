"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Badge —— 库里唯一的徽章组件（原 StatusBadge 已并进来）。
 * -----------------------------------------------------------------------------
 * 像 Button 一样用 cva 出表：配色（variant）× 圆角（radius）都是显式档位，
 * 状态点（dot / pulse）是 prop，不再需要一层独立的 StatusBadge 包装。
 *
 * 配色：一套状态族（success / warning / destructive）+ 一套中性（default=primary、
 * secondary、muted、outline）。success / warning 是 palettes.css 里仅有的两个
 * 特批状态 token；危险永远走 --destructive，不另开名字。
 *
 * 图标规则：不允许给图标改色 —— svg 用 currentColor 继承徽章文字色，
 * 这里只统一尺寸，不写任何 [&>svg]:text-*。
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden border px-2 h-6 whitespace-nowrap text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        muted: "border-border/70 bg-muted text-muted-foreground",
        outline: "border-border bg-background text-foreground",
        /* 状态三档一律「淡底软胶囊」：8% 色底 + 25% 描边 + 同色深一档的字。
           字色用 color-mix 往 foreground 混 —— 暗色主题自动提亮、亮色主题自动压深，
           两个主题都可读。实心琥珀/绿在卡面上像警告灯，软胶囊才是仪表盘的用法；
           危险字的 --destructive-ink 是现成的混合 token，直接用。 */
        success:
          "border-[hsl(var(--success)/0.25)] bg-[hsl(var(--success)/0.08)] text-[color:color-mix(in_srgb,hsl(var(--success))_80%,hsl(var(--foreground)))]",
        warning:
          "border-[hsl(var(--warning)/0.25)] bg-[hsl(var(--warning)/0.08)] text-[color:color-mix(in_srgb,hsl(var(--warning))_80%,hsl(var(--foreground)))]",
        destructive:
          "border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.08)] text-[color:var(--destructive-ink)]",
      },
      radius: {
        full: "rounded-full",
        lg: "rounded-[10px]",
        md: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      radius: "full",
    },
  }
)

/** 状态点的颜色档位：默认跟文字（current）；白色胶囊配绿呼吸灯这类用法，
    点色和胶囊配色各选各的。 */
export const BADGE_DOT_TONES = {
  current: "bg-current",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
} as const

export type BadgeDotTone = keyof typeof BADGE_DOT_TONES

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  /** 前置状态点。默认颜色跟文字（current），用 dotTone 指定独立色档 */
  dot?: boolean
  /** 状态点呼吸脉冲（「运行中」），只在 dot 开启时生效 */
  pulse?: boolean
  /** 状态点的颜色档，默认 current（跟文字） */
  dotTone?: BadgeDotTone
}

function Badge({
  className,
  variant,
  radius,
  dot = false,
  pulse = false,
  dotTone = "current",
  asChild = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"
  const dotClass = BADGE_DOT_TONES[dotTone]
  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-radius={radius}
      className={cn(badgeVariants({ variant, radius }), className)}
      {...props}
    >
      {dot && (
        <span className="relative flex size-1.5 shrink-0">
          {pulse && (
            <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-70", dotClass)} />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", dotClass)} />
        </span>
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
