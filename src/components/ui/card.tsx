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
      default: "rounded-[14px] border bg-card shadow",
      /** 重点卡：淡天蓝渐变卡面。三档都是 --primary 叠透明度，换 primary 整套跟着换。 */
      primary:
        "rounded-[14px] border border-[hsl(var(--primary)/0.22)] bg-[linear-gradient(168deg,hsl(var(--primary)/0.03)_0%,hsl(var(--primary)/0.08)_52%,hsl(var(--primary)/0.17)_100%)] shadow-card",
      /** 不放渐变的淡蓝底，一组卡里的次级那张用它。 */
      soft: "rounded-[14px] border border-[hsl(var(--primary)/0.14)] bg-[hsl(var(--primary)/0.06)] shadow-card",
      /** 淡白灰：在白底上只分出一块，不出灰调。 */
      muted: "rounded-[14px] border border-[hsl(var(--primary)/0.1)] bg-[hsl(var(--muted)/0.8)] shadow-card",
      /** 只有线：不填色，纯靠描边分层，最适合再往里堆内容。 */
      outline: "rounded-[14px] border border-[hsl(var(--primary)/0.18)]",
      /** 内部用：卡里再放卡时的自动样子，别手写。 */
      inset: "border border-[hsl(var(--primary)/0.14)] bg-[hsl(var(--card)/0.65)]",
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
            nested && (depth > 1 ? "rounded-[8px]" : "rounded-[10px]"),
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
