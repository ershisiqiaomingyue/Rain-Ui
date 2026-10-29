import * as React from "react"
import { cn } from "@/lib/utils"

export function Empty({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: {
  className?: string
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border/70 bg-card/40 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground mb-4 shadow-sm border border-border/50">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mt-1.5 mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
