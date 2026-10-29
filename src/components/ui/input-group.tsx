import * as React from "react"
import { cn } from "@/lib/utils"

export function InputGroup({
  className,
  lead,
  tail,
  prefix,
  suffix,
  children,
  ...props
}: {
  className?: string
  lead?: React.ReactNode
  tail?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const left = lead || prefix
  const right = tail || suffix
  return (
    <div
      className={cn(
        "relative flex items-center w-full rounded-md shadow-xs",
        className
      )}
      {...props}
    >
      {left && (
        <div className="absolute left-2.5 flex items-center pointer-events-none text-muted-foreground z-10 [&_svg]:size-3.5">
          {left}
        </div>
      )}
      <div className={cn("w-full", left && "[&>input]:pl-8", right && "[&>input]:pr-8")}>
        {children}
      </div>
      {right && (
        <div className="absolute right-2.5 flex items-center text-muted-foreground z-10 [&_svg]:size-3.5">
          {right}
        </div>
      )}
    </div>
  )
}
