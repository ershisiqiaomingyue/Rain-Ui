import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export function Field({
  label,
  description,
  error,
  required,
  className,
  children,
}: {
  label?: string
  description?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <Label className="text-xs font-semibold text-foreground/90 flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-[11.5px] text-muted-foreground leading-normal">{description}</p>
      )}
      {error && (
        <p className="text-[11.5px] font-medium text-destructive leading-normal">{error}</p>
      )}
    </div>
  )
}
