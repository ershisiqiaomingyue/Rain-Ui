import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export function Field({
  label,
  description,
  hint,
  error,
  required,
  className,
  children,
}: {
  label?: string
  description?: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  const desc = description || hint
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <Label className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {children}
      {desc && !error && (
        <p className="text-[11.5px] text-muted-foreground leading-normal">{desc}</p>
      )}
      {error && (
        <p className="text-[11.5px] font-medium text-destructive leading-normal">{error}</p>
      )}
    </div>
  )
}
