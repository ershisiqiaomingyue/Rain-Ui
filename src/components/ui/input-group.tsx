import * as React from "react"
import { cn } from "../../lib/utils"
import { Button, type ButtonProps } from "./button"

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
      role="group"
      data-slot="input-group"
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-[10px] border border-input bg-transparent transition-[border-color,background-color,box-shadow] has-[>textarea]:h-auto has-[[data-slot=input-group-control]:focus-visible]:shadow-[0_1px_2px_hsl(var(--foreground)/0.05),0_2px_8px_hsl(var(--foreground)/0.09)] has-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {left && (
        <div className="pointer-events-none flex shrink-0 select-none items-center pl-2.5 pr-1 text-muted-foreground [&_svg]:size-3.5">
          {left}
        </div>
      )}
      {children}
      {right && (
        <div className="flex shrink-0 select-none items-center pl-1 pr-2.5 text-muted-foreground [&_svg]:size-3.5">
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
        "flex h-full w-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-2.5 py-1 text-xs text-foreground shadow-none outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
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
        "flex min-h-[60px] w-full min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent px-2.5 py-1.5 text-xs text-foreground shadow-none outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
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
>(({ className, align = "end", onClick, children, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return

    const target = event.target as HTMLElement
    if (
      target.closest(
        "button, a, input, textarea, select, [role='button'], [contenteditable='true']"
      )
    ) {
      return
    }

    event.currentTarget.parentElement
      ?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        "[data-slot=input-group-control]"
      )
      ?.focus()
  }

  return (
    <div
      ref={ref}
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      onClick={handleClick}
      className={cn(
        "flex shrink-0 cursor-text select-none items-center gap-1 text-xs text-muted-foreground",
        align === "start" ? "order-first pl-2.5 pr-1" : "order-last pl-1 pr-2.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

export interface InputGroupButtonProps extends Omit<ButtonProps, "size"> {
  size?: NonNullable<ButtonProps["size"]>
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(
  (
    {
      className,
      type = "button",
      variant = "ghost",
      size = "icon-xs",
      ...props
    },
    ref
  ) => (
    <Button
      ref={ref}
      type={type}
      variant={variant}
      size={size}
      className={cn("shadow-none", className)}
      {...props}
    />
  )
)
InputGroupButton.displayName = "InputGroupButton"

const InputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="input-group-text"
    className={cn(
      "flex select-none items-center gap-1 text-xs text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
      className
    )}
    {...props}
  />
))
InputGroupText.displayName = "InputGroupText"

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}