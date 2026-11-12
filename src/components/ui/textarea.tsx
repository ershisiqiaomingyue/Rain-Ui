import * as React from "react"
import { cn } from "../../lib/utils"

/* 与 Input 同一度量：rounded-[10px] / text-xs / px-3；高度由 min-h 控制 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[72px] w-full rounded-[10px] border border-transparent bg-[var(--field-bg)] hover:bg-[var(--field-bg-hover)] active:bg-[var(--field-bg-active)] focus-visible:border-[var(--line-2)] focus-visible:ring-2 focus-visible:ring-[var(--line-strong)] px-3 py-2 text-xs text-foreground transition-[border-color,background-color,box-shadow] outline-none placeholder:text-muted-foreground/80 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
