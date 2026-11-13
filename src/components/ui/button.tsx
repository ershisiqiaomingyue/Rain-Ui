import * as React from "react"
import { AppIcon } from "../icons/AppIcon"
import { Spinner } from "../../../components/ui/Spinner"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
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
        /*
         * default 是 A 的「描边」那颗：白卡面 + --input 描边，hover 落到 surface-2。
         * 不写 variant 的按钮全走这里 —— 别改回 bg-primary，库里的主按钮是 primary。
         */
        default:
          "border-input bg-card shadow-sm hover:bg-secondary hover:text-foreground",
        /*
         * 主按钮：实心 --primary + 白字，平的，不叠渐变。
         * 「淡蓝」那套是次要按钮（见下面的 secondary），主次靠明度分，不靠色相分。
         * hover 不用 bg-primary/90（那是在页底色上做透明，会越悬越淡）；
         * 往 ink 里混 15% 得到 A 的 accent-hover（211→212，L 43→39），比新开一个
         * --primary-hover token 省事，也不用担心宿主忘了同步。
         */
        primary:
          "bg-primary text-primary-foreground shadow-control hover:bg-[color:color-mix(in_srgb,hsl(var(--primary))_85%,hsl(var(--foreground)))]",
        surface:
          "border-border bg-card shadow-sm hover:bg-accent hover:text-accent-foreground",
        /*
         * 次要按钮 = A 的「淡蓝」：6% 天蓝铺底、深天蓝字、22% 天蓝描边。
         * 字不是 --primary 本身（43% 明度压在 6% 淡底上只有 3.9:1），
         * 而是 primary 往 ink 里混 30%，落在 214 86% 36% 附近 —— 就是 A 的
         * accent-deep，对淡底 5.2:1。这样仍然只有一个色源。
         */
        secondary:
          "border-[hsl(var(--primary)/0.24)] bg-[hsl(var(--primary)/0.06)] text-[color:color-mix(in_srgb,hsl(var(--primary))_70%,hsl(var(--foreground)))] hover:border-[hsl(var(--primary)/0.36)] hover:bg-[hsl(var(--primary)/0.1)]",
        /* 必须显式声明透明：只写 hover 态的话，未悬停时 background-color 落在
           浏览器默认的 buttonface（亮色下是中性灰），整站的 ghost 按钮都会带一块灰底。 */
        ghost:
          "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        subtle:
          "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        bare:
          "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /* 行内危险操作（卸载这类）走描边红：实心红一排放五个按钮里太吵，
           真正要拦一下的场景（确认删除）用 destructive 的实心。 */
        danger:
          "border-[hsl(var(--destructive)/0.24)] bg-transparent text-destructive hover:border-[hsl(var(--destructive)/0.46)] hover:bg-[hsl(var(--destructive)/0.07)]",
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
        {loading ? <Spinner aria-hidden /> : icon}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
