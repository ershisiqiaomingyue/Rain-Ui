import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { Separator } from "./separator"

/*
 * 按钮组与 Button default 使用同一度量。
 */
const buttonGroupVariants = cva(
  "inline-flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10",
  {
    variants: {
      orientation: {
        horizontal:
          "flex-row [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>
>(({ className, orientation, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
})
ButtonGroup.displayName = "ButtonGroup"

const ButtonGroupText = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex h-8 items-center gap-2 rounded-[10px] border bg-muted px-3 text-xs font-medium [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
})
ButtonGroupText.displayName = "ButtonGroupText"

const ButtonGroupSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
})
ButtonGroupSeparator.displayName = "ButtonGroupSeparator"

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
