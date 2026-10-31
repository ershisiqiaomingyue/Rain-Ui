import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"

import { cn } from "../../lib/utils"

/*
 * 统一控件度量（单一事实来源）：
 *   高度 32px (h-8) · 圆角 10px (rounded-[10px]) · 字号 12px (text-xs) · 水平内边距 12px (px-3)
 * 所有 select / input / textarea / tabs / toggle / pagination / menubar / input-group
 * 等控件都必须复用这组度量，保证与 Button default 完全一致。
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[10px] border border-transparent text-xs font-medium whitespace-nowrap outline-none select-none transition-all duration-100 ease-out focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 active:translate-y-[1px] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [box-shadow:var(--btn-primary-shadow)] hover:bg-primary/90 active:bg-primary/95",
        primary:
          "bg-primary text-primary-foreground [box-shadow:var(--btn-primary-shadow)] hover:bg-primary/90 active:bg-primary/95",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground active:bg-muted/80 dark:border-input dark:bg-transparent dark:hover:bg-muted/30",
        surface:
          "border-border bg-background hover:bg-muted hover:text-foreground active:bg-muted/80 dark:border-input dark:bg-transparent dark:hover:bg-muted/30",
        secondary:
          "bg-[var(--btn-glass-accent-bg)] text-[var(--btn-glass-accent-text)] hover:bg-[var(--btn-glass-accent-hover)] active:bg-[var(--btn-glass-accent-active)]",
        ghost:
          "hover:bg-muted hover:text-foreground active:bg-muted/70 dark:hover:bg-muted/40",
        subtle:
          "hover:bg-muted hover:text-foreground active:bg-muted/70 dark:hover:bg-muted/40",
        bare:
          "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted hover:text-foreground active:bg-muted/70 dark:hover:bg-muted/40",
        destructive:
          "bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] hover:bg-[var(--btn-danger-hover)] active:bg-[var(--btn-danger-hover)]",
        danger:
          "bg-[var(--btn-danger-bg)] text-[var(--btn-danger-text)] hover:bg-[var(--btn-danger-hover)] active:bg-[var(--btn-danger-hover)]",
        success:
          "bg-[var(--btn-success-bg)] text-[var(--btn-success-text)] hover:bg-[var(--btn-success-hover)] active:bg-[var(--btn-success-hover)]",
        link:
          "text-primary underline-offset-4 hover:underline active:translate-y-0 active:scale-100",
      },
      size: {
        /* 尺寸阶梯：只变高度/间距/字号，圆角恒定为 10px，避免「有的圆有的方」 */
        default: "h-8 gap-1.5 px-3",
        md: "h-8 gap-1.5 px-3",
        xs: "h-6 gap-1 px-2 text-[11px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-3.5 text-sm",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 [&_svg:not([class*='size-'])]:size-4",
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
  /** leading icon node; when there are no children the button auto-collapses to a square icon size */
  icon?: React.ReactNode
  /** shows a spinner in place of the icon and disables the button unless allowClickWhileLoading */
  loading?: boolean
  allowClickWhileLoading?: boolean
}

const ICON_ONLY_SIZE: Record<string, NonNullable<ButtonProps["size"]>> = {
  default: "icon",
  md: "icon",
  xs: "icon-xs",
  sm: "icon-sm",
  lg: "icon-lg",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      icon,
      loading = false,
      allowClickWhileLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    if (asChild) {
      return (
        <Comp
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    const hasChildren =
      children !== undefined && children !== null && children !== false && children !== ""
    const iconOnly = !hasChildren && (Boolean(icon) || loading)
    const resolvedSize = iconOnly ? (ICON_ONLY_SIZE[size ?? "default"] ?? size) : size

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={resolvedSize}
        aria-busy={loading || undefined}
        disabled={disabled || (loading && !allowClickWhileLoading)}
        className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden /> : icon}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
