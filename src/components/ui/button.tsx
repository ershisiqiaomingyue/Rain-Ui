import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:bg-primary/95",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/25 hover:bg-destructive/20 active:bg-destructive/30",
        outline:
          "border border-border/80 bg-background/80 shadow-2xs hover:bg-accent/80 hover:text-accent-foreground",
        secondary:
          "bg-secondary/90 text-secondary-foreground border border-border/40 shadow-2xs hover:bg-secondary hover:border-border/70",
        ghost:
          "hover:bg-accent/80 hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 px-2 text-[11px] rounded",
        sm: "h-7 px-2.5 text-xs rounded-md",
        default: "h-7 px-2.5 text-xs rounded-md",
        md: "h-8 px-3 text-[13px] rounded-md",
        lg: "h-9 px-4 text-sm rounded-lg",
        icon: "h-7 w-7 rounded-md",
        "icon-sm": "h-6 w-6 rounded",
        "icon-md": "h-8 w-8 rounded-md",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
