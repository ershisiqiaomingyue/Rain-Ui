import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex rounded-lg p-0.5 bg-muted/60 border border-border/50 backdrop-blur-sm",
          orientation === "vertical"
            ? "flex-col [&>button]:w-full [&>button]:rounded-md"
            : "flex-row items-center [&>button]:rounded-md",
          className
        )}
        {...props}
      />
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"
