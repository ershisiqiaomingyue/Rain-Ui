"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Label } from "./label"

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn("flex flex-col gap-3 w-full", className)}
      {...props}
    />
  )
})
FieldGroup.displayName = "FieldGroup"

const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.ComponentProps<"fieldset">
>(({ className, ...props }, ref) => {
  return (
    <fieldset
      ref={ref}
      data-slot="fieldset"
      className={cn("flex flex-col gap-2 w-full border-none p-0 m-0", className)}
      {...props}
    />
  )
})
FieldSet.displayName = "FieldSet"

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.ComponentProps<"legend"> & { variant?: "label" | "title" }
>(({ className, variant = "title", ...props }, ref) => {
  return (
    <legend
      ref={ref}
      data-slot="field-legend"
      className={cn(
        "font-semibold text-foreground tracking-tight",
        variant === "label" ? "text-xs" : "text-sm",
        className
      )}
      {...props}
    />
  )
})
FieldLegend.displayName = "FieldLegend"

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    orientation?: "vertical" | "horizontal"
    label?: string
    description?: string
    hint?: string
    error?: string
    required?: boolean
  }
>(({ className, orientation = "vertical", label, description, hint, error, required, children, ...props }, ref) => {
  const desc = description || hint
  return (
    <div
      ref={ref}
      data-slot="field"
      className={cn(
        "w-full",
        orientation === "horizontal"
          ? "flex items-center justify-between gap-3"
          : "flex flex-col gap-1.5",
        className
      )}
      {...props}
    >
      {label && (
        <FieldLabel className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      {children}
      {desc && !error && <FieldDescription>{desc}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </div>
  )
})
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      data-slot="field-label"
      className={cn("text-xs font-medium text-foreground/90 select-none", className)}
      {...props}
    />
  )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="field-description"
      className={cn("text-[11.5px] text-muted-foreground leading-normal", className)}
      {...props}
    />
  )
})
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="field-error"
      className={cn("text-[11.5px] font-medium text-destructive leading-normal", className)}
      {...props}
    />
  )
})
FieldError.displayName = "FieldError"

export {
  FieldGroup,
  FieldSet,
  FieldLegend,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
}
