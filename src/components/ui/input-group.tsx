import * as React from "react"
import { cn } from "@/lib/utils"

/* 与 Input / Button 同一度量：h-8 / rounded-[10px] / text-xs */
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
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-[10px] border border-input bg-background transition-[border-color,box-shadow] has-[>textarea]:h-auto has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/20 has-disabled:opacity-50",
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
      data-slot="input-group-control"
      className={cn(
        "flex h-full w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 disabled:cursor-not-allowed disabled:opacity-50",
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
      data-slot="input-group-control"
      className={cn(
        "flex min-h-[60px] w-full min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 disabled:cursor-not-allowed disabled:opacity-50",
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
        "flex shrink-0 items-center gap-1 text-xs text-muted-foreground",
        align === "start" ? "pl-2.5 pr-1" : "pr-2.5 pl-1",
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
