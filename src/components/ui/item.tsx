import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const itemVariants = cva(
  "group/item flex w-full items-center gap-2.5 rounded-[10px] border border-transparent px-3 py-2.5 text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        outline: "border-border bg-card",
        muted: "bg-muted/50 hover:bg-muted",
      },
      size: {
        default: "",
        sm: "px-2.5 py-2 text-xs",
        lg: "px-3.5 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Item = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemVariants>
>(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="item"
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
})
Item.displayName = "Item"

const ItemMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="item-media"
      className={cn("flex shrink-0 items-center justify-center text-muted-foreground", className)}
      {...props}
    />
  )
})
ItemMedia.displayName = "ItemMedia"

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="item-content"
      className={cn("flex flex-1 min-w-0 flex-col gap-0.5", className)}
      {...props}
    />
  )
})
ItemContent.displayName = "ItemContent"

const ItemTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="item-title"
      className={cn("font-medium text-foreground leading-snug", className)}
      {...props}
    />
  )
})
ItemTitle.displayName = "ItemTitle"

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="item-description"
      className={cn("text-xs text-muted-foreground leading-normal", className)}
      {...props}
    />
  )
})
ItemDescription.displayName = "ItemDescription"

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  itemVariants,
}
