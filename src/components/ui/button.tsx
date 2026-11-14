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
        /* ghost 是唯一「没有底」的档：图标动作、行内链接式的入口。
           subtle 必须显式声明自己的淡中性底 —— 带字的按钮要看得见形状；
           和 ghost 长得一模一样的时候，两个名字就是一个东西，等于没分层。 */
        ghost:
          "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        subtle:
          "bg-[hsl(var(--secondary)/0.7)] text-muted-foreground hover:bg-secondary hover:text-foreground",
        bare:
          "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /* 警告档：琥珀实心 + 深墨字（--warning 两个主题都配深字，白字压琥珀只有 3:1）。
           「需要确认 / 有风险但可恢复」的动作用这颗；不可逆删除仍然是 destructive。 */
        warning:
          "bg-warning text-warning-foreground hover:bg-[color:color-mix(in_srgb,hsl(var(--warning))_85%,hsl(var(--foreground)))]",
        /* 行内危险操作（撤销、移入回收站这类）走「淡红底 + 红字」：底是 --destructive
           的一成四，字是 --destructive-ink —— 直接把 hsl(var(--destructive)) 当字色，
           暗色主题里红字压深卡面只有 2:1，看着就是"只有个颜色"。
           真正要拦一下的场景（确认删除）用 destructive 的实心。 */
        danger:
          "border-transparent bg-[hsl(var(--destructive)/0.14)] text-[color:var(--destructive-ink)] hover:bg-[hsl(var(--destructive)/0.2)]",
        /* 图标态的删除：工具条上放不下淡红底方块，所以平时无底、墨色同 muted，
           悬停才浮一层淡红并转 --destructive-ink。危险信号只在真的指上去时出现。 */
        "danger-ghost":
          "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-[hsl(var(--destructive)/0.1)] hover:text-[color:var(--destructive-ink)]",
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
    /*
     * 图标态画不出「淡底 + 弱墨字」的层次，subtle 的底在那里只会让工具栏变成一排小方块，
     * 所以图标态退回 ghost（透明 + hover 浮一层）。带字的 subtle 才有底色。
     */
    const resolvedVariant = iconOnly && variant === "subtle" ? "ghost" : variant

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        aria-busy={loading || undefined}
        disabled={disabled || (loading && !allowClickWhileLoading)}
        className={cn(buttonVariants({ variant: resolvedVariant, size: resolvedSize, className }))}
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
