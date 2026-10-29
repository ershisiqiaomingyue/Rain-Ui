import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    lead?: React.ReactNode
    tail?: React.ReactNode
    prefix?: React.ReactNode
    suffix?: React.ReactNode
  }
>(({ className, lead, tail, prefix, suffix, children, ...props }, ref) => {
  const left = lead || prefix
  const right = tail || suffix

  return (
    <div
      ref={ref}
      data-slot="input-group"
      className={cn(
        "group/input-group relative flex items-center w-full rounded-lg border border-input bg-background transition-[border-color,background-color] focus-within:border-primary focus-within:ring-0",
        className
      )}
      {...props}
    >
      {left && (
        <div className="flex shrink-0 items-center pl-2.5 pr-1 text-muted-foreground [&_svg]:size-3.5 select-none pointer-events-none">
          {left}
        </div>
      )}
      {children}
      {right && (
        <div className="flex shrink-0 items-center pr-2.5 pl-1 text-muted-foreground [&_svg]:size-3.5 select-none">
          {right}
        </div>
      )}
    </div>
  )
})
InputGroup.displayName = "InputGroup"

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      data-slot="input-group-input"
      className={cn(
        "flex h-8 w-full min-w-0 flex-1 border-0 bg-transparent px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
InputGroupInput.displayName = "InputGroupInput"

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="input-group-textarea"
      className={cn(
        "flex min-h-[60px] w-full min-w-0 flex-1 resize-none border-0 bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
InputGroupTextarea.displayName = "InputGroupTextarea"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { align?: "start" | "end" }
>(({ className, align = "end", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="input-group-addon"
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground",
        align === "start" ? "pl-2.5 pr-1" : "pr-2 pl-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

export { InputGroup, InputGroupInput, InputGroupTextarea, InputGroupAddon }
