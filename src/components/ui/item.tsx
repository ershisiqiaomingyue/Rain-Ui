import * as React from "react"
import { cn } from "@/lib/utils"

export function Item({
  className,
  icon,
  title,
  subtitle,
  action,
  onClick,
  ...props
}: {
  className?: string
  icon?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  onClick?: () => void
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors border border-transparent",
        onClick && "hover:bg-muted/50 cursor-pointer active:scale-[0.99] transition-transform",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="text-muted-foreground shrink-0">{icon}</div>}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{title}</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
