"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* Badge：与 Button default 同族 —— 高 24px、圆角 6px、字号 12px */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-md border px-2 h-6 whitespace-nowrap text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-[var(--btn-glass-accent-bg)] text-[var(--btn-glass-accent-text)]",
        destructive: "border-transparent bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)]",
        outline: "border-border bg-background text-foreground",
        muted: "border-border/70 bg-muted text-muted-foreground",
        success: "border-transparent bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
        warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
