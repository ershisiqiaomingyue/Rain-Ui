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
        "flex min-h-[72px] w-full rounded-[10px] border border-transparent bg-muted/45 hover:bg-muted/55 focus-visible:border-primary/40 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/15 px-3 py-2 text-xs text-foreground transition-[border-color,background-color,box-shadow] outline-none placeholder:text-muted-foreground/60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
