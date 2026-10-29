import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-medium whitespace-nowrap outline-none select-none transition-all duration-100 ease-out focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 active:translate-y-[1px] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-[550] [box-shadow:var(--btn-primary-shadow)] hover:bg-primary/90 active:bg-primary/95",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground active:bg-muted/80 dark:border-input dark:bg-transparent dark:hover:bg-muted/30",
        secondary:
          "bg-[var(--btn-glass-accent-bg)] text-[var(--btn-glass-accent-text)] [box-shadow:var(--btn-glass-rim)] hover:bg-[var(--btn-glass-accent-hover)] active:bg-[var(--btn-glass-accent-active)]",
        ghost:
          "hover:bg-muted hover:text-foreground active:bg-muted/70 dark:hover:bg-muted/40",
        destructive:
          "bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] [box-shadow:var(--btn-danger-rim)] hover:bg-[var(--btn-danger-hover)] active:bg-[var(--btn-danger-hover)]",
        link:
          "text-primary underline-offset-4 hover:underline active:opacity-80 active:translate-y-0 active:scale-100",
      },
      size: {
        default: "h-8 gap-1.5 px-3 text-xs rounded-lg",
        xs: "h-6 gap-1 px-2 text-[11px] rounded-md [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 px-2.5 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-3.5 text-sm rounded-lg",
        icon: "size-8 rounded-lg",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 rounded-lg [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
