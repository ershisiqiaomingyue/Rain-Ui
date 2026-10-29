import * as React from "react"
import { cn } from "@/lib/utils"

export function Item({
  className,
  icon,
  title,
  subtitle,
  description,
  action,
  onClick,
  ...props
}: {
  className?: string
  icon?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  onClick?: () => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const sub = subtitle || description
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors border border-transparent",
        onClick && "hover:bg-muted/50 cursor-pointer active:scale-[0.99] transition-transform",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="text-muted-foreground shrink-0 [&_svg]:size-4">{icon}</div>}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{title}</span>
          {sub && (
            <span className="text-xs text-muted-foreground truncate">{sub}</span>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
