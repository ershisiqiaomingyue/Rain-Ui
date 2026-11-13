import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * 卡片的层次不靠手写类名：`Card` 自己在上下文里记深度，往里再放一张 `Card` 就是下一层。
 *
 * 第 0 层拿 variant 给的底色 + 描边 + shadow-card；第 1 层起自动降级成半透明的 card 底
 * （在渐变或彩色卡面上像一层覆膜）、圆角收一档、去掉阴影，只靠描边分层；到第 3 层圆角
 * 再收一档。所以「卡里堆内容块」不需要外面再包一层 div，也不会出现两层同样重的线。
 *
 * 显式传 variant（比如在 secondary 卡里放一张 sky 卡）时只覆盖底色，圆角收缩照旧。
 */
const CardDepthContext = React.createContext(0)

const cardVariants = cva("relative text-card-foreground", {
  variants: {
    variant: {
      /** shadcn 原样：白/暗底 + 发丝线 + 原版阴影，别改它，现有消费方都在用。 */
      default: "rounded-xl border bg-card shadow",
      /** 淡天蓝渐变卡面：三个色标 + 一条比 --border 更偏蓝的描边。 */
      sky: "rounded-xl border border-[hsl(var(--sky-line))] bg-[linear-gradient(168deg,hsl(var(--sky-veil))_0%,hsl(var(--sky-mist))_52%,hsl(var(--sky-shade))_100%)] shadow-card",
      /** 强调卡：主色洗一层，比 main 按钮轻得多，用来装当前正在做的那件事。 */
      primary: "rounded-xl border border-[hsl(var(--primary)/0.16)] bg-[hsl(var(--primary)/0.06)] shadow-card",
      /** 次级卡：实心次级底，放在渐变卡或页面底上都立得住。 */
      secondary: "rounded-xl border border-border bg-secondary text-secondary-foreground shadow-card",
      /** 退后一档：半透明灰底，装辅助信息，和背景只差一点点。 */
      muted: "rounded-xl border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--muted)/0.6)] shadow-card",
      /** 只有线：不填色，纯靠描边分层，最适合再往里堆内容。 */
      outline: "rounded-xl border border-border",
      /** 内部用：卡里再放卡时的自动样子，别手写。 */
      inset: "border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    const depth = React.useContext(CardDepthContext)
    const nested = depth > 0

    return (
      <CardDepthContext.Provider value={depth + 1}>
        <div
          ref={ref}
          data-slot="card"
          data-depth={depth}
          className={cn(
            cardVariants({ variant: variant ?? (nested ? "inset" : "default") }),
            nested && (depth > 1 ? "rounded-md" : "rounded-lg"),
            className
          )}
          {...props}
        />
      </CardDepthContext.Provider>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
}
