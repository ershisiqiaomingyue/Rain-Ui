import * as React from "react"
import { cn } from "@/lib/utils"

export function InputGroup({
  className,
  lead,
  tail,
  children,
  ...props
}: {
  className?: string
  lead?: React.ReactNode
  tail?: React.ReactNode
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-md shadow-sm",
        className
      )}
      {...props}
    >
      {lead && (
        <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground z-10">
          {lead}
        </div>
      )}
      <div className={cn("w-full", lead && "[&>input]:pl-9", tail && "[&>input]:pr-9")}>
        {children}
      </div>
      {tail && (
        <div className="absolute right-3 flex items-center text-muted-foreground z-10">
          {tail}
        </div>
      )}
    </div>
  )
}
