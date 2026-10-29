"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "default"
}

export function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  const sizeClass = {
    xs: "size-3",
    sm: "size-3.5",
    md: "size-4",
    default: "size-5",
    lg: "size-6",
  }[size]

  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", sizeClass, className)}
      {...props}
    />
  )
}
