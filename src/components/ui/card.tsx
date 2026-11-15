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
      /** 中性三档：default（白卡+发丝线）/ muted（灰面）/ outline（只描边）。
          边框一律 --border，不染主色 —— 卡面本身不承担语义，语义归 Badge 和 tone。 */
      muted: 'rounded-[14px] border border-border bg-[hsl(var(--muted)/0.8)] shadow-card',
      outline: 'rounded-[14px] border border-border',
      /** 内部用：卡里再放卡时的自动样子，别手写。 */
      inset: 'border border-border bg-[hsl(var(--card)/0.65)]',
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
