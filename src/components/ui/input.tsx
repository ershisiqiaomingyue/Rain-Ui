"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/* 与 Button default 同一度量：h-8 / rounded-[10px] / text-xs / px-3 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-8 w-full min-w-0 rounded-[10px] border border-transparent bg-muted/45 hover:bg-muted/55 focus-visible:border-primary/40 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/15 px-3 py-1 text-xs text-foreground transition-[border-color,background-color,box-shadow] outline-none placeholder:text-muted-foreground/60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
