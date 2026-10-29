import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "default" | "lg"
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  const sizeClass = {
    sm: "h-3.5 w-3.5",
    default: "h-5 w-5",
    lg: "h-8 w-8",
  }[size]

  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", sizeClass, className)}
      {...props}
    />
  )
}
